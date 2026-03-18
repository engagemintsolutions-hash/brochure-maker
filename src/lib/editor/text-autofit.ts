import * as fabric from 'fabric';

/**
 * Shrinks a Textbox's fontSize until its content fits within maxHeight.
 * Call after text content is set and canvas is rendered.
 */
export function autoFitText(textbox: fabric.Textbox, maxHeight: number): void {
  let fontSize = textbox.fontSize || 14;
  const minFontSize = 8;

  while (fontSize > minFontSize) {
    textbox.set('fontSize', fontSize);
    textbox.initDimensions();
    const actualHeight = textbox.calcTextHeight();
    if (actualHeight <= maxHeight) break;
    fontSize -= 0.5;
  }
}
