/**
 * Type-compatibility test: every prop value used here must be accepted by
 * BOTH a plain JSX `<input>` AND `<FormattedNumberInputHtmlLike>`.
 *
 * This file is NOT executed — it only needs to compile (`tsc --noEmit`).
 * If a prop's type diverges between the two, this file will produce a
 * type error, catching regressions immediately.
 */

import * as React from 'react';
import { FormattedNumberInputHtmlLike } from './FormattedNumberInputHtmlLike';

// ---------------------------------------------------------------------------
// Shared prop values — identical variables are passed to both components.
// ---------------------------------------------------------------------------

// -- Standard HTML input attributes --
const name = 'amount';
const id = 'amount-field';
const className = 'form-input primary';
const placeholder = 'Enter amount';
const disabled = false;
const readOnly = true;
const required = true;
const autoFocus = true;
const autoComplete = 'off' as const;
const tabIndex = 3;
const title = 'Amount field';
const lang = 'en';
const dir = 'ltr' as const;
const hidden = false;
const spellCheck = false;
const draggable = false;
const inputMode = 'numeric' as const;
const enterKeyHint = 'done' as const;
const form = 'my-form';
const maxLength = 20;
const minLength = 1;
const pattern = '[0-9]*';
const size = 10;
const role = 'textbox' as const;
const slot = 'main-slot';
const autoCapitalize = 'none';
const contentEditable = false as const;
const contextMenu = 'ctx-menu';
const nonce = 'abc123';
const suppressContentEditableWarning = true;
const suppressHydrationWarning = true;
const translate = 'no' as const;
const accessKey = 'a';

// -- Style --
const style: React.CSSProperties = {
  color: 'red',
  fontSize: 16,
  padding: 10,
  border: '1px solid #ccc',
  borderRadius: 8,
  backgroundColor: '#fff',
  width: 300,
  boxSizing: 'border-box',
};

// -- ARIA attributes --
const ariaLabel = 'Amount input';
const ariaLabelledBy = 'amount-label';
const ariaDescribedBy = 'amount-help';
const ariaRequired = true;
const ariaDisabled = false;
const ariaInvalid = true;
const ariaHidden = false;
const ariaLive = 'polite' as const;
const ariaAtomic = true;
const ariaAutoComplete = 'none' as const;
const ariaPlaceholder = 'enter number';
const ariaReadOnly = false;
const ariaValueNow = 42;
const ariaValueMin = 0;
const ariaValueMax = 1000;
const ariaValueText = 'forty-two';

// -- Data attributes --
const dataCurrency = 'usd';
const dataFieldId = '123';

// -- Event handlers (typed with full React event signatures) --

const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  const _target: HTMLInputElement = e.target;
  const _type: string = e.type;
  const _relatedTarget = e.relatedTarget;
  void [_target, _type, _relatedTarget];
};

const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  const _target: HTMLInputElement = e.target;
  void _target;
};

const onClick = (e: React.MouseEvent<HTMLInputElement>) => {
  const _clientX: number = e.clientX;
  const _clientY: number = e.clientY;
  const _button: number = e.button;
  void [_clientX, _clientY, _button];
};

const onDoubleClick = (e: React.MouseEvent<HTMLInputElement>) => {
  const _detail: number = e.detail;
  void _detail;
};

const onMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
  e.preventDefault();
};

const onMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
  const _pageX: number = e.pageX;
  void _pageX;
};

const onMouseEnter = (e: React.MouseEvent<HTMLInputElement>) => {
  const _target = e.currentTarget;
  void _target;
};

const onMouseLeave = (e: React.MouseEvent<HTMLInputElement>) => {
  void e;
};

const onMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
  const _movementX: number = e.movementX;
  void _movementX;
};

const onMouseOver = (e: React.MouseEvent<HTMLInputElement>) => {
  void e;
};

const onMouseOut = (e: React.MouseEvent<HTMLInputElement>) => {
  void e;
};

const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const _key: string = e.key;
  const _code: string = e.code;
  const _ctrlKey: boolean = e.ctrlKey;
  const _shiftKey: boolean = e.shiftKey;
  const _altKey: boolean = e.altKey;
  const _metaKey: boolean = e.metaKey;
  const _repeat: boolean = e.repeat;
  void [_key, _code, _ctrlKey, _shiftKey, _altKey, _metaKey, _repeat];
};

const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const _key: string = e.key;
  void _key;
};

const onInput = (e: React.FormEvent<HTMLInputElement>) => {
  const _value: string = e.currentTarget.value;
  void _value;
};

const onSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
  const _selectionStart = e.currentTarget.selectionStart;
  const _selectionEnd = e.currentTarget.selectionEnd;
  void [_selectionStart, _selectionEnd];
};

const onCopy = (e: React.ClipboardEvent<HTMLInputElement>) => {
  const _data: string = e.clipboardData.getData('text/plain');
  void _data;
};

const onCut = (e: React.ClipboardEvent<HTMLInputElement>) => {
  void e.clipboardData;
};

const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  const _text = e.clipboardData.getData('text');
  void _text;
};

const onCompositionStart = (e: React.CompositionEvent<HTMLInputElement>) => {
  const _data: string = e.data;
  void _data;
};

const onCompositionUpdate = (e: React.CompositionEvent<HTMLInputElement>) => {
  void e.data;
};

const onCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
  void e.data;
};

const onContextMenu = (e: React.MouseEvent<HTMLInputElement>) => {
  e.preventDefault();
};

const onWheel = (e: React.WheelEvent<HTMLInputElement>) => {
  const _deltaY: number = e.deltaY;
  void _deltaY;
};

const onDrag = (e: React.DragEvent<HTMLInputElement>) => {
  void e.dataTransfer;
};

const onDragStart = (e: React.DragEvent<HTMLInputElement>) => {
  e.dataTransfer.setData('text/plain', 'drag-data');
};

const onDragEnd = (e: React.DragEvent<HTMLInputElement>) => {
  void e;
};

const onDragEnter = (e: React.DragEvent<HTMLInputElement>) => {
  e.preventDefault();
};

const onDragLeave = (e: React.DragEvent<HTMLInputElement>) => {
  void e;
};

const onDragOver = (e: React.DragEvent<HTMLInputElement>) => {
  e.preventDefault();
};

const onDrop = (e: React.DragEvent<HTMLInputElement>) => {
  const _data = e.dataTransfer.getData('text');
  void _data;
};

const onTouchStart = (e: React.TouchEvent<HTMLInputElement>) => {
  const _touches = e.touches;
  void _touches;
};

const onTouchMove = (e: React.TouchEvent<HTMLInputElement>) => {
  void e.changedTouches;
};

const onTouchEnd = (e: React.TouchEvent<HTMLInputElement>) => {
  void e;
};

const onTouchCancel = (e: React.TouchEvent<HTMLInputElement>) => {
  void e;
};

const onPointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
  const _pointerId: number = e.pointerId;
  const _pointerType: string = e.pointerType;
  const _pressure: number = e.pressure;
  void [_pointerId, _pointerType, _pressure];
};

const onPointerUp = (e: React.PointerEvent<HTMLInputElement>) => {
  void e.pointerId;
};

const onPointerMove = (e: React.PointerEvent<HTMLInputElement>) => {
  void e.width;
};

const onPointerEnter = (e: React.PointerEvent<HTMLInputElement>) => {
  void e;
};

const onPointerLeave = (e: React.PointerEvent<HTMLInputElement>) => {
  void e;
};

const onPointerOver = (e: React.PointerEvent<HTMLInputElement>) => {
  void e;
};

const onPointerOut = (e: React.PointerEvent<HTMLInputElement>) => {
  void e;
};

const onPointerCancel = (e: React.PointerEvent<HTMLInputElement>) => {
  void e;
};

const onGotPointerCapture = (e: React.PointerEvent<HTMLInputElement>) => {
  void e;
};

const onLostPointerCapture = (e: React.PointerEvent<HTMLInputElement>) => {
  void e;
};

const onAnimationStart = (e: React.AnimationEvent<HTMLInputElement>) => {
  const _animationName: string = e.animationName;
  void _animationName;
};

const onAnimationEnd = (e: React.AnimationEvent<HTMLInputElement>) => {
  void e.animationName;
};

const onAnimationIteration = (e: React.AnimationEvent<HTMLInputElement>) => {
  void e;
};

const onTransitionEnd = (e: React.TransitionEvent<HTMLInputElement>) => {
  const _propertyName: string = e.propertyName;
  const _elapsedTime: number = e.elapsedTime;
  void [_propertyName, _elapsedTime];
};

// ---------------------------------------------------------------------------
// Components that consume the EXACT same values
// ---------------------------------------------------------------------------

/** Standard HTML input — baseline for type correctness. */
export function HtmlInputBaseline() {
  return (
    <>
      {/* ---- Standard attributes ---- */}
      <input
        name={name}
        id={id}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        tabIndex={tabIndex}
        title={title}
        lang={lang}
        dir={dir}
        hidden={hidden}
        spellCheck={spellCheck}
        draggable={draggable}
        inputMode={inputMode}
        enterKeyHint={enterKeyHint}
        form={form}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        size={size}
        role={role}
        slot={slot}
        autoCapitalize={autoCapitalize}
        contentEditable={contentEditable}
        contextMenu={contextMenu}
        nonce={nonce}
        suppressContentEditableWarning={suppressContentEditableWarning}
        suppressHydrationWarning={suppressHydrationWarning}
        translate={translate}
        accessKey={accessKey}
        style={style}
        // ---- ARIA ----
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-required={ariaRequired}
        aria-disabled={ariaDisabled}
        aria-invalid={ariaInvalid}
        aria-hidden={ariaHidden}
        aria-live={ariaLive}
        aria-atomic={ariaAtomic}
        aria-autocomplete={ariaAutoComplete}
        aria-placeholder={ariaPlaceholder}
        aria-readonly={ariaReadOnly}
        aria-valuenow={ariaValueNow}
        aria-valuemin={ariaValueMin}
        aria-valuemax={ariaValueMax}
        aria-valuetext={ariaValueText}
        // ---- Data attributes ----
        data-currency={dataCurrency}
        data-field-id={dataFieldId}
        // ---- Focus events ----
        onFocus={onFocus}
        onBlur={onBlur}
        // ---- Mouse events ----
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onContextMenu={onContextMenu}
        // ---- Keyboard events ----
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        // ---- Input / Selection events ----
        onInput={onInput}
        onSelect={onSelect}
        // ---- Clipboard events ----
        onCopy={onCopy}
        onCut={onCut}
        onPaste={onPaste}
        // ---- Composition events ----
        onCompositionStart={onCompositionStart}
        onCompositionUpdate={onCompositionUpdate}
        onCompositionEnd={onCompositionEnd}
        // ---- Wheel ----
        onWheel={onWheel}
        // ---- Drag events ----
        onDrag={onDrag}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        // ---- Touch events ----
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
        // ---- Pointer events ----
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerCancel={onPointerCancel}
        onGotPointerCapture={onGotPointerCapture}
        onLostPointerCapture={onLostPointerCapture}
        // ---- Animation / Transition events ----
        onAnimationStart={onAnimationStart}
        onAnimationEnd={onAnimationEnd}
        onAnimationIteration={onAnimationIteration}
        onTransitionEnd={onTransitionEnd}
      />
    </>
  );
}

/** FormattedNumberInputHtmlLike — must accept every prop the baseline does. */
export function FormattedNumberInputHtmlLikeExhaustive() {
  return (
    <>
      {/* ---- Standard attributes ---- */}
      <FormattedNumberInputHtmlLike
        value={42}
        onChangeNumber={() => {}}
        name={name}
        id={id}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        tabIndex={tabIndex}
        title={title}
        lang={lang}
        dir={dir}
        hidden={hidden}
        spellCheck={spellCheck}
        draggable={draggable}
        inputMode={inputMode}
        enterKeyHint={enterKeyHint}
        form={form}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        size={size}
        role={role}
        slot={slot}
        autoCapitalize={autoCapitalize}
        contentEditable={contentEditable}
        contextMenu={contextMenu}
        nonce={nonce}
        suppressContentEditableWarning={suppressContentEditableWarning}
        suppressHydrationWarning={suppressHydrationWarning}
        translate={translate}
        accessKey={accessKey}
        style={style}
        // ---- ARIA ----
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-required={ariaRequired}
        aria-disabled={ariaDisabled}
        aria-invalid={ariaInvalid}
        aria-hidden={ariaHidden}
        aria-live={ariaLive}
        aria-atomic={ariaAtomic}
        aria-autocomplete={ariaAutoComplete}
        aria-placeholder={ariaPlaceholder}
        aria-readonly={ariaReadOnly}
        aria-valuenow={ariaValueNow}
        aria-valuemin={ariaValueMin}
        aria-valuemax={ariaValueMax}
        aria-valuetext={ariaValueText}
        // ---- Data attributes ----
        data-currency={dataCurrency}
        data-field-id={dataFieldId}
        // ---- Focus events ----
        onFocus={onFocus}
        onBlur={onBlur}
        // ---- Mouse events ----
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onContextMenu={onContextMenu}
        // ---- Keyboard events ----
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        // ---- Input / Selection events ----
        onInput={onInput}
        onSelect={onSelect}
        // ---- Clipboard events ----
        onCopy={onCopy}
        onCut={onCut}
        onPaste={onPaste}
        // ---- Composition events ----
        onCompositionStart={onCompositionStart}
        onCompositionUpdate={onCompositionUpdate}
        onCompositionEnd={onCompositionEnd}
        // ---- Wheel ----
        onWheel={onWheel}
        // ---- Drag events ----
        onDrag={onDrag}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        // ---- Touch events ----
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
        // ---- Pointer events ----
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerCancel={onPointerCancel}
        onGotPointerCapture={onGotPointerCapture}
        onLostPointerCapture={onLostPointerCapture}
        // ---- Animation / Transition events ----
        onAnimationStart={onAnimationStart}
        onAnimationEnd={onAnimationEnd}
        onAnimationIteration={onAnimationIteration}
        onTransitionEnd={onTransitionEnd}
        // ---- FormattedNumberInput-specific props ----
        maxDecimalPlaces={2}
        decimalRoundingMode="displayAndOutput"
        formatDisplay={(n) => `$${n.toFixed(2)}`}
        showCommasWhileEditing
      />
    </>
  );
}
