/**
 * Real Property Test - Blackdown, Haslemere with actual property photos
 * Tests how 20 real estate agent photos fit into templates
 * Run: npx tsx tests/real-property-test.ts
 */

import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots', 'real-property');
const TEMPLATES = ['framed-gallery', 'split-screen', 'editorial-magazine', 'sidebar-panel'];
const LOCAL = 'http://localhost:3000/test-photos/photo_';

const PHOTOS = [
  { id: 'r1', blobUrl: `${LOCAL}90.jpg`, roomType: 'exterior_front', caption: 'Front elevation', quality: 'high' },
  { id: 'r2', blobUrl: `${LOCAL}56.jpg`, roomType: 'living_room', caption: 'Reception room', quality: 'high' },
  { id: 'r3', blobUrl: `${LOCAL}95.jpg`, roomType: 'kitchen', caption: 'Kitchen', quality: 'high' },
  { id: 'r4', blobUrl: `${LOCAL}03.jpg`, roomType: 'dining_room', caption: 'Dining room', quality: 'high' },
  { id: 'r5', blobUrl: `${LOCAL}23.jpg`, roomType: 'living_room', caption: 'Sitting room', quality: 'high' },
  { id: 'r6', blobUrl: `${LOCAL}65.jpg`, roomType: 'bedroom', caption: 'Principal bedroom', quality: 'high' },
  { id: 'r7', blobUrl: `${LOCAL}70.jpg`, roomType: 'bedroom', caption: 'Bedroom two', quality: 'high' },
  { id: 'r8', blobUrl: `${LOCAL}40.jpg`, roomType: 'bathroom', caption: 'Bathroom', quality: 'high' },
  { id: 'r9', blobUrl: `${LOCAL}44.jpg`, roomType: 'bedroom', caption: 'Bedroom three', quality: 'high' },
  { id: 'r10', blobUrl: `${LOCAL}08.jpg`, roomType: 'kitchen', caption: 'Kitchen area', quality: 'high' },
  { id: 'r11', blobUrl: `${LOCAL}68.jpg`, roomType: 'bedroom', caption: 'Bedroom four', quality: 'high' },
  { id: 'r12', blobUrl: `${LOCAL}69.jpg`, roomType: 'bathroom', caption: 'En-suite', quality: 'high' },
  { id: 'r13', blobUrl: `${LOCAL}54.jpg`, roomType: 'hallway', caption: 'Entrance hall', quality: 'high' },
  { id: 'r14', blobUrl: `${LOCAL}41.jpg`, roomType: 'study', caption: 'Study', quality: 'medium' },
  { id: 'r15', blobUrl: `${LOCAL}74.jpg`, roomType: 'garden', caption: 'Garden', quality: 'high' },
  { id: 'r16', blobUrl: `${LOCAL}71.jpg`, roomType: 'garden', caption: 'Garden view', quality: 'high' },
  { id: 'r17', blobUrl: `${LOCAL}21.jpg`, roomType: 'exterior_rear', caption: 'Rear elevation', quality: 'high' },
  { id: 'r18', blobUrl: `${LOCAL}94.jpg`, roomType: 'aerial', caption: 'Aerial view', quality: 'high' },
  { id: 'r19', blobUrl: `${LOCAL}19.jpg`, roomType: 'street', caption: 'Street scene', quality: 'high' },
  { id: 'r20', blobUrl: `${LOCAL}80.jpg`, roomType: 'garage', caption: 'Garage', quality: 'medium' },
].map(p => ({ ...p, filename: p.id + '.jpg', features: [], lighting: 'natural' as const, suggestedPage: 0 }));

const PROPERTY = {
  address: { line1: 'Blackdown', line2: '', city: 'Haslemere', county: 'Surrey', postcode: 'GU27 3BT' },
  price: 1850000, priceQualifier: 'guide_price', bedrooms: 5, bathrooms: 3, receptions: 3,
  propertyType: 'Detached House', tenure: 'freehold', councilTaxBand: 'G', epcRating: 'D', sqft: 4500,
  agentName: 'The House Partnership', agentPhone: '01428 770055', agentEmail: 'info@thehousepartnership.co.uk',
};

const TEXT = {
  coverTagline: "An exceptional country house in a stunning rural setting",
  overviewIntro: "A beautifully presented five bedroom detached country house set in approximately 1.5 acres of mature gardens and grounds with far reaching views across the Surrey Hills.",
  keyFeatures: ["Five bedrooms, three bathrooms", "Three reception rooms", "Kitchen/breakfast room", "Landscaped gardens, approx 1.5 acres", "Double garage with studio above", "Far reaching views over Surrey Hills", "Energy rating D", "Council Tax Band G"],
  situation: "Blackdown is a sought-after hamlet on the Surrey/Sussex border, situated within the Surrey Hills Area of Outstanding Natural Beauty. Haslemere town centre is approximately 2 miles away, offering a range of independent shops, restaurants, and a mainline railway station with direct services to London Waterloo in approximately 55 minutes.",
  accommodation1: "The front door opens to a generous reception hall with flagstone flooring. The drawing room features an inglenook fireplace, exposed beams, and French doors to the garden terrace. The dining room has a bay window with views over the garden. The kitchen/breakfast room has been fitted with hand-painted cabinetry, granite worktops, and an AGA range cooker alongside modern integrated appliances.",
  accommodation2: "The principal bedroom suite occupies one wing of the first floor with fitted wardrobes, an en-suite bathroom with freestanding bath, and views across the garden to the hills beyond. Four further bedrooms are served by two additional bathrooms. Bedroom two has an en-suite shower room.",
  outside: "The property is approached via a private drive leading to a gravel turning circle. The gardens extend to approximately 1.5 acres and include a south-facing terrace, formal lawns, established herbaceous borders, a kitchen garden, and a paddock. A detached double garage has a studio/home office above.",
  roomCaptions: {},
};

const PAGES = [
  { index: 0, name: 'cover' },
  { index: 1, name: 'overview' },
  { index: 3, name: 'accommodation' },
  { index: 5, name: 'outside' },
];

let driver: WebDriver;

async function run() {
  console.log("\n\u{1F3E1} Real Property Test - Blackdown, Haslemere\n");

  const options = new ChromeOptions();
  options.addArguments('--window-size=1920,1200');
  driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  await driver.manage().setTimeouts({ implicit: 5000 });

  if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  for (const templateId of TEMPLATES) {
    console.log(`\n  ${templateId}:`);
    try {
      await driver.get(BASE_URL);
      const mockData = { id: templateId, propertyDetails: PROPERTY, photos: PHOTOS, generatedText: TEXT, accentColor: '#4A1420', templateId };
      await driver.executeScript(`sessionStorage.setItem('brochure-${templateId}', JSON.stringify(${JSON.stringify(mockData)}));`);

      await driver.get(`${BASE_URL}/brochure/${templateId}`);
      await driver.wait(until.elementLocated(By.css('canvas')), 15000);
      await driver.sleep(4000); // Extra time for real images to load

      await driver.executeScript(`document.querySelectorAll('nextjs-portal').forEach(el => el.remove());`);

      // Zoom out to see full page
      await driver.executeScript(`
        const zoomOut = Array.from(document.querySelectorAll('button')).find(b => {
          const next = b.nextElementSibling;
          return next && next.textContent && next.textContent.includes('%');
        });
        if (zoomOut) { for (let i = 0; i < 5; i++) zoomOut.click(); }
      `);
      await driver.sleep(800);

      for (const page of PAGES) {
        await driver.executeScript(`
          const buttons = document.querySelectorAll('[data-testid="page-navigator"] button');
          if (buttons[${page.index}]) buttons[${page.index}].click();
        `);
        await driver.sleep(2500);

        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync(path.join(SCREENSHOT_DIR, `${templateId}-${page.name}.png`), screenshot, 'base64');
        console.log(`    \u2713 ${page.name}`);
      }
    } catch (err) {
      console.log(`    \u2717 ${(err as Error).message.slice(0, 100)}`);
    }
  }

  await driver.quit();
  console.log(`\nDone. Screenshots in tests/screenshots/real-property/\n`);
}

run();
