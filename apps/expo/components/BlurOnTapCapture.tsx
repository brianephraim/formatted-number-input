import * as React from 'react';
import { Keyboard, TextInput, View } from 'react-native';

export type BlurOnTapCaptureProps = {
  children: React.ReactNode;

  /** Enable/disable the behavior (default: true). */
  enabled?: boolean;

  /** Optional side-effect after a blur-causing tap (e.g. increment a counter). */
  onBlurTap?: () => void;

  /**
   * Avoid blurring when the tap target is the currently focused TextInput.
   * This allows caret placement and selection inside the input.
   * (default: true)
   */
  ignoreIfTargetIsFocusedInput?: boolean;
};

/**
 * Blur focused TextInput on *any* tap, even when the tap is handled by a child Pressable/Button.
 *
 * Why capture? React Native doesn't provide DOM-like bubbling you can rely on for Pressables.
 * Child Pressables typically "win" the responder, so a parent onPress won't fire.
 * `onStartShouldSetResponderCapture` runs during capture/responder negotiation and lets us run
 * a side effect (blur) while still allowing the child to handle the actual press.
 */
export function BlurOnTapCapture({
  children,
  enabled = true,
  onBlurTap,
  ignoreIfTargetIsFocusedInput = true
}: BlurOnTapCaptureProps) {
  const blurFocusedInput = React.useCallback(() => {
    // Works even when a hardware keyboard is connected (Keyboard.dismiss alone may do nothing).
    //
    // React Native tracks "currently focused TextInput" globally via an internal focus manager.
    // It’s exposed (somewhat oddly) as a static `TextInput.State.currentlyFocusedInput()` API.
    // We use it here to blur the active input without manually wiring refs everywhere.
    const focused = (TextInput as any).State?.currentlyFocusedInput?.();
    focused?.blur?.();
    Keyboard.dismiss();
  }, []);

  const onStartShouldSetResponderCapture = React.useCallback(
    (e: any) => {
      if (!enabled) return false;

      const focused = (TextInput as any).State?.currentlyFocusedInput?.();
      const focusedTag = focused?._nativeTag;

      if (ignoreIfTargetIsFocusedInput && focused && focusedTag != null && e?.target === focusedTag) {
        return false;
      }

      blurFocusedInput();
      onBlurTap?.();
      return false; // don't steal responder
    },
    [blurFocusedInput, enabled, ignoreIfTargetIsFocusedInput, onBlurTap]
  );

  return <View onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}>{children}</View>;
}
