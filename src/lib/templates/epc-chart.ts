/**
 * Builds a UK EPC rating chart as Fabric.js objects.
 * 7 coloured bands A-G with an arrow pointing to the property's rating.
 */

const EPC_BANDS = [
  { band: 'A', range: '92+', color: '#008054', width: 140 },
  { band: 'B', range: '81-91', color: '#19B459', width: 170 },
  { band: 'C', range: '69-80', color: '#8DCA2F', width: 200 },
  { band: 'D', range: '55-68', color: '#FCD615', width: 230 },
  { band: 'E', range: '39-54', color: '#F4A335', width: 260 },
  { band: 'F', range: '21-38', color: '#ED6823', width: 290 },
  { band: 'G', range: '1-20', color: '#E03030', width: 320 },
];

const BAR_HEIGHT = 28;
const BAR_GAP = 4;
const CHART_HEIGHT = EPC_BANDS.length * (BAR_HEIGHT + BAR_GAP);

export function buildEpcChart(rating: string, left: number, top: number): object[] {
  const objects: object[] = [];
  const upperRating = (rating || '').toUpperCase();

  // Title
  objects.push({
    type: 'Textbox', name: 'epc_title',
    left, top, width: 350, height: 24,
    text: 'Energy Efficiency Rating',
    fontFamily: 'Inter', fontSize: 12, fontWeight: '600',
    fill: '#333333', textAlign: 'left',
    selectable: false, evented: false, hasControls: false,
    lockMovementX: true, lockMovementY: true,
  });

  const chartTop = top + 32;

  EPC_BANDS.forEach((band, i) => {
    const y = chartTop + i * (BAR_HEIGHT + BAR_GAP);
    const isActive = band.band === upperRating;

    // Coloured bar
    objects.push({
      type: 'Rect', name: `epc_bar_${band.band}`,
      left, top: y, width: band.width, height: BAR_HEIGHT,
      fill: band.color, rx: 3, ry: 3,
      opacity: isActive ? 1 : 0.6,
      selectable: false, evented: false, hasControls: false,
      lockMovementX: true, lockMovementY: true,
    });

    // Band letter + range inside the bar
    objects.push({
      type: 'Textbox', name: `epc_label_${band.band}`,
      left: left + 8, top: y + 4, width: band.width - 16, height: BAR_HEIGHT - 8,
      text: `${band.band}  (${band.range})`,
      fontFamily: 'Inter', fontSize: 11, fontWeight: isActive ? '700' : '400',
      fill: '#FFFFFF', textAlign: 'left',
      selectable: false, evented: false, hasControls: false,
      lockMovementX: true, lockMovementY: true,
    });

    // Arrow indicator for active band
    if (isActive) {
      objects.push({
        type: 'Textbox', name: 'epc_arrow',
        left: left + band.width + 8, top: y + 2, width: 40, height: BAR_HEIGHT,
        text: '◄',
        fontFamily: 'Inter', fontSize: 18, fontWeight: '700',
        fill: band.color, textAlign: 'left',
        selectable: false, evented: false, hasControls: false,
        lockMovementX: true, lockMovementY: true,
      });
    }
  });

  return objects;
}

export { CHART_HEIGHT };
