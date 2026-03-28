/**
 * Template Review - Screenshots at 50% zoom to see full pages
 * Run: npx tsx tests/template-review.test.ts
 */

import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const TEMPLATES = [
  'full-bleed-cinematic', 'swiss-grid', 'kinfolk-minimalist', 'split-screen',
  'editorial-magazine', 'horizontal-bands', 'framed-gallery', 'sidebar-panel',
];

const MOCK = {
  propertyDetails: {
    address: { line1: '14 Elm Park Gardens', line2: 'Chelsea', city: 'London', county: 'Greater London', postcode: 'SW3 6PE' },
    price: 2500000, priceQualifier: 'guide_price', bedrooms: 4, bathrooms: 3, receptions: 2,
    propertyType: 'Terraced House', tenure: 'freehold', councilTaxBand: 'H', epcRating: 'C', sqft: 2800,
    agentName: 'Sarah Mitchell', agentPhone: '020 7861 1000', agentEmail: 'sarah@doorstepit.co.uk',
  },
  photos: [
    { id: 'p1', blobUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop', filename: 'front.jpg', roomType: 'exterior_front', caption: 'Period terraced house', features: ['bay window'], lighting: 'natural', quality: 'high', suggestedPage: 0 },
    { id: 'p2', blobUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop', filename: 'kitchen.jpg', roomType: 'kitchen', caption: 'Modern kitchen', features: ['granite worktop'], lighting: 'natural', quality: 'high', suggestedPage: 3 },
    { id: 'p3', blobUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop', filename: 'living.jpg', roomType: 'living_room', caption: 'Reception room', features: ['fireplace'], lighting: 'natural', quality: 'high', suggestedPage: 3 },
    { id: 'p4', blobUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop', filename: 'garden.jpg', roomType: 'garden', caption: 'Rear garden', features: ['patio'], lighting: 'natural', quality: 'high', suggestedPage: 5 },
    { id: 'p5', blobUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=800&fit=crop', filename: 'bedroom.jpg', roomType: 'bedroom', caption: 'Principal bedroom', features: ['fitted wardrobes'], lighting: 'natural', quality: 'high', suggestedPage: 4 },
    { id: 'p6', blobUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop', filename: 'bathroom.jpg', roomType: 'bathroom', caption: 'Family bathroom', features: ['freestanding bath'], lighting: 'artificial', quality: 'high', suggestedPage: 4 },
  ],
  generatedText: {
    coverTagline: "A distinguished period residence in the heart of Chelsea",
    overviewIntro: "This handsome four bedroom terraced house occupies a prime position on one of Chelsea\u2019s most desirable garden squares.",
    keyFeatures: ["Four bedrooms, three bathrooms", "Two reception rooms", "Modern kitchen", "South-facing garden", "Period features", "Council Tax Band H"],
    situation: "Elm Park Gardens is a quiet, tree-lined square between the Fulham Road and King\u2019s Road. South Kensington Underground is a seven-minute walk.",
    accommodation1: "The ground floor has an entrance hall with original tiled flooring, a reception room with marble fireplace and bay window, and a refitted kitchen with granite worktops and Miele appliances.",
    accommodation2: "The principal bedroom has fitted wardrobes and an en-suite shower room. Two further bedrooms on the second floor share the family bathroom with freestanding bath and rain shower.",
    outside: "The south-facing rear garden is approximately 40 feet long with a York stone patio, lawn, and mature planting along brick boundary walls.",
    roomCaptions: {},
  },
};

let driver: WebDriver;

async function run() {
  console.log("\n\u{1F4F8} Template Review (50% zoom)\n");

  const options = new ChromeOptions();
  options.addArguments('--window-size=1920,1200');
  driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  await driver.manage().setTimeouts({ implicit: 5000 });

  if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  for (const id of TEMPLATES) {
    try {
      await driver.get(BASE_URL);
      await driver.executeScript(`sessionStorage.setItem('brochure-${id}', JSON.stringify(${JSON.stringify({ id, ...MOCK, accentColor: '#4A1420', templateId: id })}));`);

      await driver.get(`${BASE_URL}/brochure/${id}`);
      await driver.wait(until.elementLocated(By.css('canvas')), 15000);
      await driver.sleep(1500);

      // Remove dev tools overlay
      await driver.executeScript(`document.querySelectorAll('nextjs-portal').forEach(el => el.remove());`);

      // Set zoom to 50% by clicking zoom out button multiple times
      for (let z = 0; z < 5; z++) {
        await driver.executeScript(`
          const buttons = document.querySelectorAll('button');
          for (const b of buttons) {
            if (b.querySelector('svg') && b.getAttribute('class')?.includes('hover:bg-gray-100')) {
              const prevSibling = b.previousElementSibling;
              if (prevSibling && prevSibling.textContent?.includes('%')) {
                b.click(); // This is the zoom out button (before the % text)
                break;
              }
            }
          }
        `);
        await driver.sleep(200);
      }

      // Alternative: directly set zoom via store
      await driver.executeScript(`
        // Find React fiber and set zoom, or use the zoom buttons
        const zoomOutButtons = Array.from(document.querySelectorAll('button'));
        const zoomOut = zoomOutButtons.find(b => {
          const next = b.nextElementSibling;
          return next && next.textContent && next.textContent.includes('%');
        });
        if (zoomOut) {
          for (let i = 0; i < 5; i++) { zoomOut.click(); }
        }
      `);
      await driver.sleep(1000);

      // Screenshot cover
      let screenshot = await driver.takeScreenshot();
      fs.writeFileSync(path.join(SCREENSHOT_DIR, `${id}-cover.png`), screenshot, 'base64');

      // Click page 2 (overview) for interior
      await driver.executeScript(`
        const buttons = document.querySelectorAll('[data-testid="page-navigator"] button');
        if (buttons[1]) buttons[1].click();
      `);
      await driver.sleep(1500);
      screenshot = await driver.takeScreenshot();
      fs.writeFileSync(path.join(SCREENSHOT_DIR, `${id}-interior.png`), screenshot, 'base64');

      console.log(`  \u2713 ${id}`);
    } catch (err) {
      console.log(`  \u2717 ${id}: ${(err as Error).message.slice(0, 80)}`);
    }
  }

  await driver.quit();
  console.log(`\nDone. Screenshots in tests/screenshots/\n`);
}

run();
