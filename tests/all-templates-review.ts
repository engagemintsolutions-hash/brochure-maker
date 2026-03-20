/**
 * Screenshot all 30 templates - cover page only
 * Run: npx tsx tests/all-templates-review.ts
 */

import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots', 'all-30');

const MOCK = {
  propertyDetails: {
    address: { line1: 'Blackdown', line2: '', city: 'Haslemere', county: 'Surrey', postcode: 'GU27 3BT' },
    price: 1850000, priceQualifier: 'guide_price', bedrooms: 5, bathrooms: 3, receptions: 3,
    propertyType: 'Detached House', tenure: 'freehold', councilTaxBand: 'G', epcRating: 'D', sqft: 4500,
    agentName: 'The House Partnership', agentPhone: '01428 770055', agentEmail: 'info@thp.co.uk',
  },
  photos: [
    { id: 'r1', blobUrl: 'http://localhost:3000/test-photos/photo_90.jpg', roomType: 'exterior_front', caption: 'Front', features: [], lighting: 'natural', quality: 'high', suggestedPage: 0 },
    { id: 'r2', blobUrl: 'http://localhost:3000/test-photos/photo_56.jpg', roomType: 'living_room', caption: 'Living', features: [], lighting: 'natural', quality: 'high', suggestedPage: 3 },
    { id: 'r3', blobUrl: 'http://localhost:3000/test-photos/photo_95.jpg', roomType: 'kitchen', caption: 'Kitchen', features: [], lighting: 'natural', quality: 'high', suggestedPage: 3 },
    { id: 'r4', blobUrl: 'http://localhost:3000/test-photos/photo_03.jpg', roomType: 'dining_room', caption: 'Dining', features: [], lighting: 'natural', quality: 'high', suggestedPage: 3 },
    { id: 'r5', blobUrl: 'http://localhost:3000/test-photos/photo_23.jpg', roomType: 'living_room', caption: 'Sitting', features: [], lighting: 'natural', quality: 'high', suggestedPage: 3 },
    { id: 'r6', blobUrl: 'http://localhost:3000/test-photos/photo_65.jpg', roomType: 'bedroom', caption: 'Bedroom 1', features: [], lighting: 'natural', quality: 'high', suggestedPage: 4 },
    { id: 'r7', blobUrl: 'http://localhost:3000/test-photos/photo_70.jpg', roomType: 'bedroom', caption: 'Bedroom 2', features: [], lighting: 'natural', quality: 'high', suggestedPage: 4 },
    { id: 'r8', blobUrl: 'http://localhost:3000/test-photos/photo_40.jpg', roomType: 'bathroom', caption: 'Bathroom', features: [], lighting: 'natural', quality: 'high', suggestedPage: 4 },
    { id: 'r9', blobUrl: 'http://localhost:3000/test-photos/photo_74.jpg', roomType: 'garden', caption: 'Garden', features: [], lighting: 'natural', quality: 'high', suggestedPage: 5 },
    { id: 'r10', blobUrl: 'http://localhost:3000/test-photos/photo_71.jpg', roomType: 'garden', caption: 'Garden 2', features: [], lighting: 'natural', quality: 'high', suggestedPage: 5 },
    { id: 'r11', blobUrl: 'http://localhost:3000/test-photos/photo_21.jpg', roomType: 'exterior_rear', caption: 'Rear', features: [], lighting: 'natural', quality: 'high', suggestedPage: 5 },
    { id: 'r12', blobUrl: 'http://localhost:3000/test-photos/photo_94.jpg', roomType: 'aerial', caption: 'Aerial', features: [], lighting: 'natural', quality: 'high', suggestedPage: 7 },
    { id: 'r13', blobUrl: 'http://localhost:3000/test-photos/photo_54.jpg', roomType: 'hallway', caption: 'Hall', features: [], lighting: 'natural', quality: 'high', suggestedPage: 1 },
    { id: 'r14', blobUrl: 'http://localhost:3000/test-photos/photo_19.jpg', roomType: 'street', caption: 'Street', features: [], lighting: 'natural', quality: 'high', suggestedPage: 7 },
  ].map(p => ({ ...p, filename: p.id + '.jpg', suggestedPage: 0 })),
  generatedText: {
    coverTagline: "An exceptional country house in a stunning rural setting",
    overviewIntro: "A beautifully presented five bedroom detached country house set in approximately 1.5 acres of mature gardens with far reaching views across the Surrey Hills.",
    keyFeatures: ["Five bedrooms, three bathrooms", "Three reception rooms", "Kitchen/breakfast room", "Landscaped gardens, approx 1.5 acres", "Double garage with studio", "Far reaching views", "Energy rating D", "Council Tax Band G"],
    situation: "Blackdown is a sought-after hamlet on the Surrey/Sussex border within the Surrey Hills AONB. Haslemere is approximately 2 miles away with shops, restaurants, and a mainline station to Waterloo in 55 minutes.",
    accommodation1: "The front door opens to a reception hall with flagstone flooring. The drawing room has an inglenook fireplace and French doors to the terrace. The kitchen has hand-painted cabinetry and an AGA.",
    accommodation2: "The principal bedroom has fitted wardrobes and an en-suite with freestanding bath. Four further bedrooms are served by two bathrooms.",
    outside: "The gardens extend to approximately 1.5 acres with a south-facing terrace, formal lawns, herbaceous borders, and a paddock. A detached double garage has a studio above.",
    roomCaptions: {},
  },
};

const TEMPLATES = [
  'full-bleed-cinematic', 'swiss-grid', 'kinfolk-minimalist', 'split-screen',
  'editorial-magazine', 'horizontal-bands', 'framed-gallery', 'sidebar-panel',
  'dark-luxury', 'photo-mosaic', 'classic-two-column', 'panoramic-strip',
  'card-stack', 'corner-accent', 'savills-structured', 'hamptons-warm',
  'sothebys-auction', 'foxtons-bold', 'country-estate', 'townhouse-narrow',
  'penthouse-dramatic', 'cottage-rustic', 'new-build-clean', 'art-deco',
  'scandinavian-light', 'brutalist-raw', 'japanese-zen', 'coastal-breezy',
  'victorian-heritage', 'loft-industrial',
];

let driver: WebDriver;

async function run() {
  console.log("\n\u{1F4F8} All 30 Templates Review\n");

  const options = new ChromeOptions();
  options.addArguments('--window-size=1920,1200');
  driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  await driver.manage().setTimeouts({ implicit: 5000 });

  if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  for (const id of TEMPLATES) {
    try {
      await driver.get(BASE_URL);
      await driver.executeScript(`sessionStorage.setItem('brochure-${id}', JSON.stringify(${JSON.stringify({ ...MOCK, id, accentColor: '#4A1420', templateId: id })}));`);
      await driver.get(`${BASE_URL}/brochure/${id}`);
      await driver.wait(until.elementLocated(By.css('canvas')), 15000);
      await driver.sleep(3000);
      await driver.executeScript(`document.querySelectorAll('nextjs-portal').forEach(el => el.remove());`);
      // Zoom out
      await driver.executeScript(`
        const zo = Array.from(document.querySelectorAll('button')).find(b => {
          const n = b.nextElementSibling; return n && n.textContent && n.textContent.includes('%');
        }); if (zo) { for (let i = 0; i < 5; i++) zo.click(); }
      `);
      await driver.sleep(800);
      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync(path.join(SCREENSHOT_DIR, `${id}.png`), screenshot, 'base64');
      console.log(`  \u2713 ${id}`);
    } catch (err) {
      console.log(`  \u2717 ${id}: ${(err as Error).message.slice(0, 80)}`);
    }
  }

  await driver.quit();
  console.log(`\nDone. ${TEMPLATES.length} screenshots in tests/screenshots/all-30/\n`);
}

run();
