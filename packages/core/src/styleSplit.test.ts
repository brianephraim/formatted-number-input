import { describe, expect, it } from 'vitest';

import { splitNumberInputStyle } from './styleSplit';

describe('splitNumberInputStyle', () => {
  it('puts typography + padding props into inputTextStyle', () => {
    const { containerStyle, inputTextStyle } = splitNumberInputStyle({
      color: 'red',
      fontSize: 20,
      textAlign: 'right',
      paddingHorizontal: 12,
      paddingVertical: 8,

      // box/layout props should remain on container
      borderWidth: 2,
      borderRadius: 10,
      backgroundColor: 'black',
      marginTop: 5,
      width: 300
    });

    expect(inputTextStyle).toMatchObject({
      color: 'red',
      fontSize: 20,
      textAlign: 'right',
      paddingHorizontal: 12,
      paddingVertical: 8
    });

    expect(containerStyle).toMatchObject({
      borderWidth: 2,
      borderRadius: 10,
      backgroundColor: 'black',
      marginTop: 5,
      width: 300
    });
  });

  it('does not include undefined values', () => {
    const { inputTextStyle } = splitNumberInputStyle({
      color: undefined,
      padding: undefined
    });

    expect(Object.prototype.hasOwnProperty.call(inputTextStyle, 'color')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(inputTextStyle, 'padding')).toBe(false);
  });
});
