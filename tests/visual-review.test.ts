/**
 * Visual Review Test
 *
 * Generates a brochure with each template, screenshots every page,
 * and saves them for design review.
 *
 * Run: npx tsx tests/visual-review.test.ts
 * Output: tests/screenshots/{template-id}/page-{n}.png
 */

import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const TIMEOUT = 20000;
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

let driver: WebDriver;

const MOCK_PROPERTY = {
  address: { line1: '14 Elm Park Gardens', line2: 'Chelsea', city: 'London', county: 'Greater London', postcode: 'SW3 6PE' },
  price: 2500000,
  priceQualifier: 'guide_price',
  bedrooms: 4,
  bathrooms: 3,
  receptions: 2,
  propertyType: 'Terraced House',
  tenure: 'freehold',
  councilTaxBand: 'H',
  epcRating: 'C',
  sqft: 2800,
  agentName: 'Sarah Mitchell',
  agentPhone: '020 7861 1000',
  agentEmail: 'sarah@doorstepit.co.uk',
};

const MOCK_PHOTOS = [
  { id: 'p1', blobUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop', filename: 'front.jpg', roomType: 'exterior_front', caption: 'Period terraced house with bay windows', features: ['bay window', 'front garden', 'period facade'], lighting: 'natural', quality: 'high', suggestedPage: 0 },
  { id: 'p2', blobUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop', filename: 'kitchen.jpg', roomType: 'kitchen', caption: 'Modern fitted kitchen with island', features: ['granite worktop', 'kitchen island', 'integrated appliances'], lighting: 'natural', quality: 'high', suggestedPage: 3 },
  { id: 'p3', blobUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop', filename: 'living.jpg', roomType: 'living_room', caption: 'Spacious double reception room', features: ['fireplace', 'bay window', 'wooden flooring'], lighting: 'natural', quality: 'high', suggestedPage: 3 },
  { id: 'p4', blobUrl: 'https://images.unsplash.com/photo-1598928506311-c55ez633a2e4?w=1200&h=800&fit=crop', filename: 'garden.jpg', roomType: 'garden', caption: 'Mature south-facing rear garden', features: ['patio', 'lawn', 'mature planting'], lighting: 'natural', quality: 'high', suggestedPage: 5 },
  { id: 'p5', blobUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=800&fit=crop', filename: 'bedroom.jpg', roomType: 'bedroom', caption: 'Principal bedroom suite', features: ['fitted wardrobes', 'en-suite'], lighting: 'natural', quality: 'high', suggestedPage: 4 },
  { id: 'p6', blobUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop', filename: 'bathroom.jpg', roomType: 'bathroom', caption: 'Contemporary family bathroom', features: ['freestanding bath', 'rain shower', 'marble tiles'], lighting: 'artificial', quality: 'high', suggestedPage: 4 },
  { id: 'p7', blobUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop', filename: 'exterior2.jpg', roomType: 'exterior_rear', caption: 'Rear elevation and garden', features: ['patio doors', 'extension'], lighting: 'natural', quality: 'high', suggestedPage: 5 },
  { id: 'p8', blobUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop', filename: 'dining.jpg', roomType: 'dining_room', caption: 'Formal dining room', features: ['period cornicing', 'sash windows'], lighting: 'natural', quality: 'high', suggestedPage: 3 },
];

const MOCK_TEXT = {
  coverTagline: "A distinguished period residence in the heart of Chelsea",
  overviewIntro: "This handsome four bedroom terraced house occupies a prime position on one of Chelsea\u2019s most desirable garden squares. The property extends to approximately 2,800 sq ft across four floors and has been thoughtfully updated throughout.",
  keyFeatures: ["Four double bedrooms, three bathrooms", "Two elegant reception rooms", "Modern kitchen with granite island", "South-facing mature garden, 40ft", "Period features including cornicing and fireplaces", "Council Tax Band H, EPC Rating C"],
  situation: "Elm Park Gardens is a quiet, tree-lined residential square situated between the Fulham Road and the King\u2019s Road in the heart of Chelsea. South Kensington Underground station is a seven-minute walk, providing access to the Piccadilly, Circle, and District lines. Fulham Broadway, on the District line, is also within easy reach. The immediate area offers an excellent selection of independent shops, restaurants, and cafes along both the King\u2019s Road and Fulham Road. Chelsea and Westminster Hospital is nearby, as are several well-regarded schools including Hill House and The Oratory.",
  accommodation1: "The front door opens to a generous entrance hall with original encaustic tiled flooring and a staircase rising to the upper floors. The principal reception room at the front of the house features a working marble fireplace, deep bay window, and ceiling height of 3.2 metres. To the rear, a second reception room opens through glazed doors to the garden. The kitchen-dining room on the lower ground floor has been recently refitted with Carrara marble worktops, a central island with breakfast bar, and fully integrated Miele appliances including an induction hob and combination steam oven.",
  accommodation2: "The first floor contains the principal bedroom with fitted wardrobes across one wall and an en-suite shower room with Porcelanosa tiling. A second double bedroom on this floor has garden views. The second floor provides two further bedrooms, one currently used as a home office, served by the family bathroom which features a freestanding Victoria + Albert bath and a separate walk-in rain shower with frameless glass screen. All bedrooms have been fitted with engineered oak flooring.",
  outside: "The south-facing rear garden measures approximately 40 feet in length. Immediately outside the kitchen, a York stone patio provides space for outdoor dining. This gives way to a well-maintained lawn bordered by established planting including mature hydrangeas, climbing roses, and a Japanese maple. The garden boundaries are formed by London stock brick walls providing good privacy. A garden shed is tucked into the rear corner.",
  roomCaptions: {},
};

// All 30 template IDs
const TEMPLATE_IDS = [
  'sir-classic', 'glentree-prestige', 'warm-prestige', 'dark-luxury', 'ivory-gold',
  'foxtons-urban', 'geometric-grey', 'beauchamp-ultra', 'digital-forward', 'monochrome-lux',
  'dexters-magazine', 'christies-art', 'tmh-architecture', 'lifestyle-editorial', 'design-journal',
  'kf-residential', 'savills-bold', 'chestertons-purple', 'corporate-green', 'corporate-slate',
  'winkworth-illustrated', 'aston-chase-gallery', 'tk-geometric', 'artisan-craft', 'signature-teal',
  'sp-country', 'hamptons-warm', 'jackson-stops-estate', 'jdw-classic', 'country-manor',
];

async function setup() {
  const options = new ChromeOptions();
  options.addArguments('--window-size=1920,1200');
  // options.addArguments('--headless=new');

  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({ implicit: 5000 });

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
}

async function screenshotTemplate(templateId: string) {
  const dir = path.join(SCREENSHOT_DIR, templateId);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Inject mock data with this template
  await driver.get(BASE_URL);
  await driver.executeScript(`
    sessionStorage.setItem('brochure-${templateId}', JSON.stringify({
      id: '${templateId}',
      propertyDetails: ${JSON.stringify(MOCK_PROPERTY)},
      photos: ${JSON.stringify(MOCK_PHOTOS)},
      generatedText: ${JSON.stringify(MOCK_TEXT)},
      accentColor: '#4A1420',
      templateId: '${templateId}'
    }));
  `);

  // Navigate to editor
  await driver.get(`${BASE_URL}/brochure/${templateId}`);

  // Wait for canvas
  try {
    await driver.wait(until.elementLocated(By.css('canvas')), TIMEOUT);
    await driver.sleep(2000); // Let images load
  } catch {
    console.log(`  ⚠ Canvas didn't load for ${templateId}, skipping`);
    return;
  }

  // Hide Next.js dev tools overlay
  await driver.executeScript(`
    document.querySelectorAll('nextjs-portal').forEach(el => el.remove());
    const devTools = document.querySelector('[data-nextjs-dialog-overlay]');
    if (devTools) devTools.remove();
  `);

  // Screenshot each of the 8 pages
  const pageCount = await driver.executeScript(
    `return document.querySelectorAll('[data-testid="page-navigator"] button').length`
  ) as number;

  for (let i = 0; i < Math.min(pageCount, 8); i++) {
    // Use JS click to avoid overlay interception
    await driver.executeScript(`
      const buttons = document.querySelectorAll('[data-testid="page-navigator"] button');
      if (buttons[${i}]) buttons[${i}].click();
    `);
    await driver.sleep(1500); // Wait for render + image load

    // Screenshot the canvas area
    const screenshot = await driver.takeScreenshot();
    const filePath = path.join(dir, `page-${i + 1}.png`);
    fs.writeFileSync(filePath, screenshot, 'base64');
  }

  console.log(`  ✓ ${templateId}: ${pageCount} pages captured`);
}

async function generateIndex() {
  // Create an HTML index of all screenshots for easy review
  let html = `<!DOCTYPE html>
<html><head>
<title>Brochure Templates - Visual Review</title>
<style>
  body { font-family: Inter, system-ui, sans-serif; background: #f5f5f5; padding: 40px; }
  h1 { color: #4A1420; font-size: 28px; }
  h2 { color: #333; margin-top: 40px; border-bottom: 2px solid #4A1420; padding-bottom: 8px; }
  .template { margin: 20px 0; }
  .pages { display: flex; gap: 12px; overflow-x: auto; padding: 10px 0; }
  .pages img { height: 300px; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .meta { font-size: 13px; color: #666; margin-top: 4px; }
</style>
</head><body>
<h1>Brochure Templates - Visual Review</h1>
<p>Generated ${new Date().toISOString().split('T')[0]}. ${TEMPLATE_IDS.length} templates, 8 pages each.</p>
`;

  for (const id of TEMPLATE_IDS) {
    const dir = path.join(SCREENSHOT_DIR, id);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort();
    if (files.length === 0) continue;

    html += `<div class="template">
  <h2>${id}</h2>
  <div class="pages">
    ${files.map(f => `<img src="${id}/${f}" alt="${id} ${f}" loading="lazy">`).join('\n    ')}
  </div>
  <div class="meta">${files.length} pages</div>
</div>\n`;
  }

  html += '</body></html>';
  fs.writeFileSync(path.join(SCREENSHOT_DIR, 'index.html'), html);
  console.log(`\n📄 Review index: tests/screenshots/index.html`);
}

async function run() {
  console.log('\n📸 Visual Review - Capturing all 30 templates\n');

  await setup();

  let captured = 0;
  for (const templateId of TEMPLATE_IDS) {
    try {
      await screenshotTemplate(templateId);
      captured++;
    } catch (err) {
      console.log(`  ✗ ${templateId}: ${(err as Error).message}`);
    }
  }

  await generateIndex();
  await driver.quit();

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Captured: ${captured}/${TEMPLATE_IDS.length} templates`);
  console.log(`Screenshots: tests/screenshots/`);
  console.log(`Open tests/screenshots/index.html to review all templates`);
  console.log(`${'─'.repeat(50)}\n`);
}

run();
