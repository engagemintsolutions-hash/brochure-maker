/**
 * Screenshot rounded corner templates - cover + accommodation page
 * Run: npx tsx tests/rounded-review.ts
 */
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots', 'rounded');
const TEMPLATES = [
  'card-stack', 'foxtons-bold', 'japanese-zen', 'coastal-breezy',
  'scandinavian-light', 'cottage-rustic', 'photo-mosaic', 'new-build-clean',
  'hamptons-warm', 'townhouse-narrow',
];

const MOCK = {
  propertyDetails: {
    address: { line1: 'Blackdown', line2: '', city: 'Haslemere', county: 'Surrey', postcode: 'GU27 3BT' },
    price: 1850000, priceQualifier: 'guide_price', bedrooms: 5, bathrooms: 3, receptions: 3,
    propertyType: 'Detached House', tenure: 'freehold', councilTaxBand: 'G', epcRating: 'D', sqft: 4500,
    agentName: 'The House Partnership', agentPhone: '01428 770055', agentEmail: 'info@thp.co.uk',
  },
  photos: [
    { id: 'r1', blobUrl: 'http://localhost:3000/test-photos/photo_90.jpg', roomType: 'exterior_front', caption: 'Front', features: [], lighting: 'natural', quality: 'high' },
    { id: 'r2', blobUrl: 'http://localhost:3000/test-photos/photo_56.jpg', roomType: 'living_room', caption: 'Living', features: [], lighting: 'natural', quality: 'high' },
    { id: 'r3', blobUrl: 'http://localhost:3000/test-photos/photo_95.jpg', roomType: 'kitchen', caption: 'Kitchen', features: [], lighting: 'natural', quality: 'high' },
    { id: 'r4', blobUrl: 'http://localhost:3000/test-photos/photo_03.jpg', roomType: 'dining_room', caption: 'Dining', features: [], lighting: 'natural', quality: 'high' },
    { id: 'r5', blobUrl: 'http://localhost:3000/test-photos/photo_65.jpg', roomType: 'bedroom', caption: 'Bed 1', features: [], lighting: 'natural', quality: 'high' },
    { id: 'r6', blobUrl: 'http://localhost:3000/test-photos/photo_70.jpg', roomType: 'bedroom', caption: 'Bed 2', features: [], lighting: 'natural', quality: 'high' },
    { id: 'r7', blobUrl: 'http://localhost:3000/test-photos/photo_40.jpg', roomType: 'bathroom', caption: 'Bath', features: [], lighting: 'natural', quality: 'high' },
    { id: 'r8', blobUrl: 'http://localhost:3000/test-photos/photo_74.jpg', roomType: 'garden', caption: 'Garden', features: [], lighting: 'natural', quality: 'high' },
    { id: 'r9', blobUrl: 'http://localhost:3000/test-photos/photo_71.jpg', roomType: 'garden', caption: 'Garden 2', features: [], lighting: 'natural', quality: 'high' },
    { id: 'r10', blobUrl: 'http://localhost:3000/test-photos/photo_21.jpg', roomType: 'exterior_rear', caption: 'Rear', features: [], lighting: 'natural', quality: 'high' },
    { id: 'r11', blobUrl: 'http://localhost:3000/test-photos/photo_54.jpg', roomType: 'hallway', caption: 'Hall', features: [], lighting: 'natural', quality: 'high' },
    { id: 'r12', blobUrl: 'http://localhost:3000/test-photos/photo_94.jpg', roomType: 'aerial', caption: 'Aerial', features: [], lighting: 'natural', quality: 'high' },
  ].map(p => ({ ...p, filename: p.id + '.jpg', suggestedPage: 0 })),
  generatedText: {
    coverTagline: "An exceptional country house in a stunning rural setting",
    overviewIntro: "A beautifully presented five bedroom detached country house set in approximately 1.5 acres.",
    keyFeatures: ["Five bedrooms", "Three bathrooms", "Three reception rooms", "1.5 acres", "Double garage", "Surrey Hills views", "EPC D", "Band G"],
    situation: "Blackdown is a sought-after hamlet within the Surrey Hills AONB. Haslemere is 2 miles away.",
    accommodation1: "The front door opens to a reception hall with flagstone flooring. The drawing room has an inglenook fireplace. The kitchen has hand-painted cabinetry and an AGA.",
    accommodation2: "The principal bedroom has fitted wardrobes and an en-suite. Four further bedrooms are served by two bathrooms.",
    outside: "The gardens extend to 1.5 acres with a south-facing terrace, lawns, herbaceous borders, and a paddock.",
    roomCaptions: {},
  },
};

let driver: WebDriver;

async function run() {
  console.log("\n\u{1F4F8} Rounded Corners Review\n");
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
      await driver.executeScript(`
        const zo = Array.from(document.querySelectorAll('button')).find(b => {
          const n = b.nextElementSibling; return n && n.textContent && n.textContent.includes('%');
        }); if (zo) { for (let i = 0; i < 5; i++) zo.click(); }
      `);
      await driver.sleep(800);

      // Cover
      let ss = await driver.takeScreenshot();
      fs.writeFileSync(path.join(SCREENSHOT_DIR, `${id}-cover.png`), ss, 'base64');

      // Accommodation (page 4)
      await driver.executeScript(`
        const btns = document.querySelectorAll('[data-testid="page-navigator"] button');
        if (btns[3]) btns[3].click();
      `);
      await driver.sleep(2000);
      ss = await driver.takeScreenshot();
      fs.writeFileSync(path.join(SCREENSHOT_DIR, `${id}-accom.png`), ss, 'base64');

      console.log(`  \u2713 ${id}`);
    } catch (err) {
      console.log(`  \u2717 ${id}: ${(err as Error).message.slice(0, 80)}`);
    }
  }

  await driver.quit();
  console.log(`\nDone. ${TEMPLATES.length * 2} screenshots in tests/screenshots/rounded/\n`);
}

run();
