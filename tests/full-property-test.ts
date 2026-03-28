/**
 * Full Property Test - 20 photos, check all 8 pages of each template
 * Screenshots page 1 (cover), page 2 (overview), page 4 (accommodation), page 6 (outside)
 * Run: npx tsx tests/full-property-test.ts
 */

import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots', 'full-property');
const TEMPLATES = [
  'framed-gallery', 'split-screen', 'sidebar-panel', 'editorial-magazine',
];

// 20 real property photos from Unsplash - varied rooms
const PHOTOS = [
  // Exteriors
  { id: 'ext1', blobUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop', roomType: 'exterior_front', caption: 'Front elevation with period facade', features: ['bay windows', 'front garden', 'brick facade'], quality: 'high' },
  { id: 'ext2', blobUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop', roomType: 'exterior_rear', caption: 'Rear elevation and garden access', features: ['patio doors', 'extension'], quality: 'high' },
  { id: 'aerial', blobUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop', roomType: 'aerial', caption: 'Aerial view of the property', features: ['large plot', 'mature trees'], quality: 'high' },
  // Kitchen
  { id: 'kit1', blobUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop', roomType: 'kitchen', caption: 'Modern fitted kitchen with island', features: ['granite worktops', 'island unit', 'integrated Miele appliances'], quality: 'high' },
  { id: 'kit2', blobUrl: 'https://images.unsplash.com/photo-1556185781-a47769abb7ee?w=1200&h=800&fit=crop', roomType: 'kitchen', caption: 'Kitchen breakfast area', features: ['breakfast bar', 'pendant lighting'], quality: 'medium' },
  // Living
  { id: 'liv1', blobUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop', roomType: 'living_room', caption: 'Principal reception room', features: ['marble fireplace', 'bay window', 'cornicing'], quality: 'high' },
  { id: 'liv2', blobUrl: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&h=800&fit=crop', roomType: 'living_room', caption: 'Second reception room', features: ['wooden flooring', 'French doors'], quality: 'high' },
  // Dining
  { id: 'din1', blobUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop', roomType: 'dining_room', caption: 'Formal dining room', features: ['period cornicing', 'sash windows', 'chandelier'], quality: 'high' },
  // Bedrooms
  { id: 'bed1', blobUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=800&fit=crop', roomType: 'bedroom', caption: 'Principal bedroom suite', features: ['fitted wardrobes', 'en-suite access'], quality: 'high' },
  { id: 'bed2', blobUrl: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=1200&h=800&fit=crop', roomType: 'bedroom', caption: 'Second bedroom with garden views', features: ['built-in storage', 'garden views'], quality: 'high' },
  { id: 'bed3', blobUrl: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&h=800&fit=crop', roomType: 'bedroom', caption: 'Third bedroom', features: ['fitted carpet', 'double aspect'], quality: 'medium' },
  { id: 'bed4', blobUrl: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&h=800&fit=crop', roomType: 'bedroom', caption: 'Fourth bedroom / home office', features: ['built-in desk', 'bookshelves'], quality: 'medium' },
  // Bathrooms
  { id: 'bath1', blobUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop', roomType: 'bathroom', caption: 'Family bathroom with freestanding bath', features: ['freestanding bath', 'rain shower', 'marble tiles'], quality: 'high' },
  { id: 'bath2', blobUrl: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=1200&h=800&fit=crop', roomType: 'bathroom', caption: 'En-suite shower room', features: ['walk-in shower', 'heated towel rail'], quality: 'high' },
  // Garden
  { id: 'gard1', blobUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop', roomType: 'garden', caption: 'South-facing rear garden', features: ['York stone patio', 'lawn', 'mature borders'], quality: 'high' },
  { id: 'gard2', blobUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&h=800&fit=crop', roomType: 'garden', caption: 'Garden terrace with seating area', features: ['outdoor dining', 'planting beds'], quality: 'high' },
  // Hallway
  { id: 'hall1', blobUrl: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop', roomType: 'hallway', caption: 'Entrance hall with original tiling', features: ['encaustic tiles', 'staircase', 'period details'], quality: 'high' },
  // Study
  { id: 'study1', blobUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=800&fit=crop', roomType: 'study', caption: 'Home study with built-in shelving', features: ['built-in bookshelves', 'desk area'], quality: 'medium' },
  // Street
  { id: 'street1', blobUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop', roomType: 'street', caption: 'Tree-lined residential square', features: ['communal gardens', 'period properties'], quality: 'high' },
  // Utility
  { id: 'util1', blobUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&h=800&fit=crop', roomType: 'utility', caption: 'Utility room', features: ['plumbing for washer', 'dryer', 'storage'], quality: 'medium' },
].map(p => ({ ...p, filename: p.id + '.jpg', lighting: 'natural' as const, suggestedPage: 0 }));

const PROPERTY = {
  address: { line1: '14 Elm Park Gardens', line2: 'Chelsea', city: 'London', county: 'Greater London', postcode: 'SW3 6PE' },
  price: 3750000, priceQualifier: 'guide_price', bedrooms: 4, bathrooms: 3, receptions: 2,
  propertyType: 'Terraced House', tenure: 'freehold', councilTaxBand: 'H', epcRating: 'C', sqft: 3200,
  agentName: 'Sarah Mitchell', agentPhone: '020 7861 1000', agentEmail: 'sarah@doorstepit.co.uk',
};

const TEXT = {
  coverTagline: "A distinguished period residence in the heart of Chelsea",
  overviewIntro: "This handsome four bedroom terraced house occupies a prime position on one of Chelsea\u2019s most desirable garden squares. Extending to approximately 3,200 sq ft across four floors, the property has been thoughtfully updated while retaining many original features including working fireplaces, decorative cornicing, and encaustic tiled flooring.",
  keyFeatures: [
    "Four double bedrooms, three bathrooms",
    "Two elegant reception rooms with fireplaces",
    "Modern kitchen with Miele appliances and granite island",
    "South-facing mature garden, approximately 40ft",
    "Original period features throughout",
    "Entrance hall with encaustic tiled flooring",
    "Home study with built-in shelving",
    "Council Tax Band H, EPC Rating C",
  ],
  situation: "Elm Park Gardens is a quiet, tree-lined residential square situated between the Fulham Road and the King\u2019s Road in the heart of Chelsea. South Kensington Underground station (Piccadilly, Circle, and District lines) is a seven-minute walk. Fulham Broadway (District line) is also nearby. The immediate area offers independent shops, restaurants, and cafes along both the King\u2019s Road and Fulham Road. Notable schools within the catchment include Hill House, The Oratory, and Redcliffe School. Chelsea and Westminster Hospital is a short walk away. The communal gardens of Elm Park Gardens provide an additional green space for residents.",
  accommodation1: "The front door opens to a generous entrance hall with original encaustic tiled flooring and a staircase rising to the upper floors. The principal reception room at the front of the house features a working marble fireplace, deep bay window overlooking the square, and a ceiling height of 3.2 metres with decorative cornicing and ceiling rose. To the rear, a second reception room has French doors opening directly to the garden. The kitchen-dining room on the lower ground floor has been refitted with Carrara marble worktops, a central island with breakfast bar, and fully integrated Miele appliances including an induction hob, combination steam oven, and wine cooler. A separate utility room provides additional storage and plumbing.",
  accommodation2: "The first floor contains the principal bedroom with fitted wardrobes across one wall and an en-suite shower room with Porcelanosa tiling and heated towel rail. A second double bedroom on this floor has views over the rear garden. The second floor provides two further bedrooms: one currently arranged as a home office with built-in bookshelves, the other a double bedroom served by the family bathroom. The family bathroom features a freestanding Victoria + Albert bath, separate walk-in rain shower with frameless glass screen, and Carrara marble flooring. All bedrooms have been fitted with engineered oak flooring.",
  outside: "The south-facing rear garden measures approximately 40 feet in length. Immediately outside the kitchen, a York stone patio provides space for outdoor dining with room for a table seating eight. Beyond the patio, a well-maintained lawn is bordered by established planting including mature hydrangeas, climbing roses, a Japanese maple, and several lavender bushes. The garden boundaries are formed by London stock brick walls approximately six feet high, providing excellent privacy. A timber garden shed with power supply is located at the rear. The front of the property has a small planted area behind original iron railings.",
  roomCaptions: {},
};

// Pages to screenshot: cover, overview, accommodation, outside
const PAGES_TO_CAPTURE = [
  { index: 0, name: 'cover' },
  { index: 1, name: 'overview' },
  { index: 3, name: 'accommodation' },
  { index: 5, name: 'outside' },
];

let driver: WebDriver;

async function run() {
  console.log("\n\u{1F3E0} Full Property Test - 20 photos across 4 templates\n");

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
      await driver.sleep(3000); // Extra time for 20 images to load

      // Remove dev overlay
      await driver.executeScript(`document.querySelectorAll('nextjs-portal').forEach(el => el.remove());`);

      // Zoom out
      await driver.executeScript(`
        const zoomOut = Array.from(document.querySelectorAll('button')).find(b => {
          const next = b.nextElementSibling;
          return next && next.textContent && next.textContent.includes('%');
        });
        if (zoomOut) { for (let i = 0; i < 5; i++) zoomOut.click(); }
      `);
      await driver.sleep(800);

      for (const page of PAGES_TO_CAPTURE) {
        await driver.executeScript(`
          const buttons = document.querySelectorAll('[data-testid="page-navigator"] button');
          if (buttons[${page.index}]) buttons[${page.index}].click();
        `);
        await driver.sleep(2000);

        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync(path.join(SCREENSHOT_DIR, `${templateId}-${page.name}.png`), screenshot, 'base64');
        console.log(`    \u2713 ${page.name}`);
      }
    } catch (err) {
      console.log(`    \u2717 ${(err as Error).message.slice(0, 100)}`);
    }
  }

  await driver.quit();
  console.log(`\nDone. ${TEMPLATES.length * PAGES_TO_CAPTURE.length} screenshots in tests/screenshots/full-property/\n`);
}

run();
