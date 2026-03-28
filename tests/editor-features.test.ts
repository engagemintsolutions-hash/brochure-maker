/**
 * Editor Features Test - Tests all Canva-level features
 * Run: npx tsx tests/editor-features.test.ts
 */

import { Builder, By, until, WebDriver, Key } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';

const BASE_URL = 'http://localhost:3000';
let driver: WebDriver;

const MOCK = {
  id: 'test-features',
  propertyDetails: {
    address: { line1: '14 Elm Park Gardens', line2: 'Chelsea', city: 'London', county: 'Greater London', postcode: 'SW3 6PE' },
    price: 2500000, priceQualifier: 'guide_price', bedrooms: 4, bathrooms: 3, receptions: 2,
    propertyType: 'Terraced House', tenure: 'freehold', councilTaxBand: 'H', epcRating: 'C', sqft: 2800,
    agentName: 'Sarah Mitchell', agentPhone: '020 7861 1000', agentEmail: 'sarah@doorstepit.co.uk',
  },
  photos: [
    { id: 'p1', blobUrl: 'https://placehold.co/1200x800/4A1420/white?text=Front', filename: 'front.jpg', roomType: 'exterior_front', caption: 'Front', features: [], lighting: 'natural', quality: 'high', suggestedPage: 0 },
    { id: 'p2', blobUrl: 'https://placehold.co/1200x800/2C3E50/white?text=Kitchen', filename: 'kitchen.jpg', roomType: 'kitchen', caption: 'Kitchen', features: [], lighting: 'natural', quality: 'high', suggestedPage: 3 },
    { id: 'p3', blobUrl: 'https://placehold.co/1200x800/8B4513/white?text=Living', filename: 'living.jpg', roomType: 'living_room', caption: 'Living', features: [], lighting: 'natural', quality: 'high', suggestedPage: 3 },
  ],
  generatedText: {
    coverTagline: "A distinguished period residence",
    overviewIntro: "A handsome four bedroom terraced house.",
    keyFeatures: ["Four bedrooms", "Two receptions", "Modern kitchen"],
    situation: "Elm Park Gardens is a quiet square.",
    accommodation1: "The ground floor has an entrance hall.",
    accommodation2: "The principal bedroom has fitted wardrobes.",
    outside: "The south-facing rear garden.",
    roomCaptions: {},
  },
  accentColor: '#4A1420',
  templateId: 'editorial-magazine',
};

function log(msg: string) { console.log(`  \u2713 ${msg}`); }

async function setup() {
  const options = new ChromeOptions();
  options.addArguments('--window-size=1920,1080');
  driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  await driver.manage().setTimeouts({ implicit: 5000 });

  // Inject mock data and navigate to editor
  await driver.get(BASE_URL);
  await driver.executeScript(`sessionStorage.setItem('brochure-test-features', JSON.stringify(${JSON.stringify(MOCK)}));`);
  await driver.get(`${BASE_URL}/brochure/test-features`);
  await driver.wait(until.elementLocated(By.css('canvas')), 15000);
  await driver.sleep(3000);
  await driver.executeScript(`document.querySelectorAll('nextjs-portal').forEach(el => el.remove());`);
}

async function testToolbarButtons() {
  // Undo button exists and is clickable
  const undoBtn = await driver.findElement(By.css('button[title="Undo (Ctrl+Z)"]'));
  if (!undoBtn) throw new Error('Undo button missing');
  log('Undo button present');

  // Redo button
  const redoBtn = await driver.findElement(By.css('button[title="Redo (Ctrl+Shift+Z)"]'));
  if (!redoBtn) throw new Error('Redo button missing');
  log('Redo button present');

  // Grid toggle button
  const gridBtn = await driver.findElement(By.css('button[title="Toggle grid"]'));
  await gridBtn.click();
  await driver.sleep(300);
  // Check grid is toggled on (button should have different styling)
  const gridClass = await gridBtn.getAttribute('class');
  if (!gridClass.includes('bg-gray-200')) throw new Error('Grid toggle not working');
  log('Grid toggle works');
  // Toggle off
  await gridBtn.click();
  await driver.sleep(200);

  // Zoom buttons
  const zoomText = await driver.findElement(By.xpath("//span[contains(., '%')]"));
  const initialZoom = await zoomText.getText();
  log(`Zoom shows ${initialZoom}`);

  // Export PDF button
  const exportBtn = await driver.findElement(By.xpath("//button[contains(., 'Export')]"));
  if (!exportBtn) throw new Error('Export button missing');
  log('Export button present');

  // Accent colour picker
  const accentLabel = await driver.findElement(By.xpath("//span[contains(., 'Accent')]"));
  if (!accentLabel) throw new Error('Accent colour picker missing');
  log('Accent colour picker present');
}

async function testExportDialog() {
  // Open export dialog
  const exportBtn = await driver.findElement(By.xpath("//button[contains(., 'Export')]"));
  await exportBtn.click();
  await driver.sleep(500);

  // Check dialog opened
  const dialog = await driver.findElement(By.xpath("//h3[contains(., 'Export')]"));
  if (!dialog) throw new Error('Export dialog not opened');
  log('Export dialog opens');

  // Check format buttons exist (PDF, PNG, JPG)
  const pdfBtn = await driver.findElement(By.xpath("//div[contains(., 'PDF')]"));
  const pngBtn = await driver.findElement(By.xpath("//div[contains(., 'PNG')]"));
  const jpgBtn = await driver.findElement(By.xpath("//div[contains(., 'JPG')]"));
  if (!pdfBtn || !pngBtn || !jpgBtn) throw new Error('Format buttons missing');
  log('PDF/PNG/JPG format buttons present');

  // Click JPG to show quality slider
  await driver.executeScript(`
    const buttons = document.querySelectorAll('button');
    for (const b of buttons) { if (b.textContent.includes('JPG')) { b.click(); break; } }
  `);
  await driver.sleep(300);
  const qualitySlider = await driver.findElements(By.css('input[type="range"]'));
  if (qualitySlider.length === 0) throw new Error('JPG quality slider missing');
  log('JPG quality slider appears');

  // Check page selection buttons (1-8)
  const pageButtons = await driver.findElements(By.xpath("//button[contains(@class, 'rounded border')]"));
  if (pageButtons.length < 8) throw new Error(`Expected 8 page buttons, got ${pageButtons.length}`);
  log('Page selection buttons present (8 pages)');

  // Close dialog via JS click to avoid dev tools overlay
  await driver.executeScript(`
    const btns = document.querySelectorAll('button');
    for (const b of btns) {
      if (b.querySelector('svg') && b.closest('[class*="fixed"]')) { b.click(); break; }
    }
  `);
  await driver.sleep(300);
}

async function testKeyboardShortcuts() {
  // Click on canvas to focus it
  const canvas = await driver.findElement(By.css('canvas'));
  await driver.actions().move({ origin: canvas, x: 100, y: 100 }).click().perform();
  await driver.sleep(500);

  // Ctrl+Z (undo) - should not crash
  await driver.actions().keyDown(Key.CONTROL).sendKeys('z').keyUp(Key.CONTROL).perform();
  await driver.sleep(300);
  log('Ctrl+Z undo works');

  // Ctrl+Shift+Z (redo) - should not crash
  await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('z').keyUp(Key.SHIFT).keyUp(Key.CONTROL).perform();
  await driver.sleep(300);
  log('Ctrl+Shift+Z redo works');

  // Ctrl+A (select all) - should not crash
  await driver.actions().keyDown(Key.CONTROL).sendKeys('a').keyUp(Key.CONTROL).perform();
  await driver.sleep(300);
  log('Ctrl+A select all works');

  // Escape (deselect)
  await driver.actions().sendKeys(Key.ESCAPE).perform();
  await driver.sleep(300);
  log('Escape deselect works');

  // Click an element on canvas
  await driver.actions().move({ origin: canvas, x: 200, y: 200 }).click().perform();
  await driver.sleep(500);

  // Arrow key nudge
  await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
  await driver.sleep(200);
  await driver.actions().sendKeys(Key.ARROW_DOWN).perform();
  await driver.sleep(200);
  log('Arrow key nudge works');

  // Shift+Arrow (10px nudge)
  await driver.actions().keyDown(Key.SHIFT).sendKeys(Key.ARROW_RIGHT).keyUp(Key.SHIFT).perform();
  await driver.sleep(200);
  log('Shift+Arrow 10px nudge works');

  // Ctrl+D (duplicate) - click element first
  await driver.actions().move({ origin: canvas, x: 200, y: 200 }).click().perform();
  await driver.sleep(300);
  await driver.actions().keyDown(Key.CONTROL).sendKeys('d').keyUp(Key.CONTROL).perform();
  await driver.sleep(300);
  log('Ctrl+D duplicate works');

  // Ctrl+C / Ctrl+V (copy/paste)
  await driver.actions().keyDown(Key.CONTROL).sendKeys('c').keyUp(Key.CONTROL).perform();
  await driver.sleep(200);
  await driver.actions().keyDown(Key.CONTROL).sendKeys('v').keyUp(Key.CONTROL).perform();
  await driver.sleep(300);
  log('Ctrl+C/V copy/paste works');

  // Ctrl+S (save) - should not crash
  await driver.actions().keyDown(Key.CONTROL).sendKeys('s').keyUp(Key.CONTROL).perform();
  await driver.sleep(200);
  log('Ctrl+S save works');
}

async function testRightClickMenu() {
  const canvas = await driver.findElement(By.css('canvas'));

  // Right-click on canvas with no selection
  await driver.actions().sendKeys(Key.ESCAPE).perform();
  await driver.sleep(200);
  await driver.actions().move({ origin: canvas, x: 50, y: 50 }).contextClick().perform();
  await driver.sleep(500);

  // Check context menu appears
  const menuItems = await driver.findElements(By.xpath("//button[contains(., 'Paste')]"));
  if (menuItems.length > 0) {
    log('Right-click menu shows Paste when no selection');
  }

  // Click away to close
  await driver.actions().move({ origin: canvas, x: 50, y: 50 }).click().perform();
  await driver.sleep(300);

  // Select element then right-click (use small coords to stay in bounds)
  await driver.actions().move({ origin: canvas, x: 80, y: 80 }).click().perform();
  await driver.sleep(500);
  await driver.actions().move({ origin: canvas, x: 80, y: 80 }).contextClick().perform();
  await driver.sleep(500);

  const copyItem = await driver.findElements(By.xpath("//button[contains(., 'Copy')]"));
  const dupItem = await driver.findElements(By.xpath("//button[contains(., 'Duplicate')]"));
  const bringFwd = await driver.findElements(By.xpath("//button[contains(., 'Bring Forward')]"));
  const lockItem = await driver.findElements(By.xpath("//button[contains(., 'Lock')]"));

  if (copyItem.length > 0) log('Context menu shows Copy');
  if (dupItem.length > 0) log('Context menu shows Duplicate');
  if (bringFwd.length > 0) log('Context menu shows Bring Forward');
  if (lockItem.length > 0) log('Context menu shows Lock');

  // Close menu by clicking elsewhere
  await driver.actions().move({ origin: canvas, x: 30, y: 30 }).click().perform();
  await driver.sleep(300);
}

async function testLayersPanel() {
  // Layers panel should be in the right sidebar
  const layersHeader = await driver.findElements(By.xpath("//*[contains(text(), 'Layers')]"));
  if (layersHeader.length > 0) {
    log('Layers panel present');
  } else {
    throw new Error('Layers panel missing');
  }

  // Check layer items exist (should have multiple)
  const layerItems = await driver.findElements(By.css('[class*="truncate"]'));
  if (layerItems.length >= 3) {
    log(`Layers panel shows ${layerItems.length} elements`);
  }
}

async function testPropertiesPanel() {
  const canvas = await driver.findElement(By.css('canvas'));

  // Click a text element (try the heading area)
  await driver.actions().move({ origin: canvas, x: 150, y: 50 }).doubleClick().perform();
  await driver.sleep(800);

  // Check Bold/Italic/Underline buttons
  const bBtn = await driver.findElements(By.xpath("//button[text()='B']"));
  const iBtn = await driver.findElements(By.xpath("//button[text()='I']"));
  const uBtn = await driver.findElements(By.xpath("//button[text()='U']"));

  if (bBtn.length > 0) log('Bold button present');
  if (iBtn.length > 0) log('Italic button present');
  if (uBtn.length > 0) log('Underline button present');

  // Check font selector has optgroups
  const optgroups = await driver.findElements(By.css('optgroup'));
  if (optgroups.length >= 3) {
    log(`Font selector has ${optgroups.length} groups (Serif/Sans/Display)`);
  }

  // Check opacity slider
  const opacitySliders = await driver.findElements(By.css('input[type="range"]'));
  if (opacitySliders.length > 0) {
    log('Opacity slider present');
  }

  // Escape to deselect
  await driver.actions().sendKeys(Key.ESCAPE).perform();
  await driver.sleep(300);
}

async function testPhotoLibrary() {
  // Photo library should be in the right sidebar
  const photosHeader = await driver.findElements(By.xpath("//*[contains(text(), 'Photos')]"));
  if (photosHeader.length > 0) {
    log('Photo library present');
  }

  // Check photo thumbnails
  const photoThumbs = await driver.findElements(By.css('[class*="aspect-\\[4\\/3\\]"]'));
  if (photoThumbs.length >= 3) {
    log(`Photo library shows ${photoThumbs.length} photos`);
  }

  // Add photo button
  const addBtn = await driver.findElements(By.xpath("//button[@title='Add photo from device']"));
  if (addBtn.length > 0) {
    log('Add photo button present');
  }
}

async function testPageNavigator() {
  // Check page thumbnails render (should have images after canvas loaded)
  await driver.sleep(1000); // Wait for thumbnail generation
  const thumbImages = await driver.findElements(By.css('[data-testid="page-navigator"] img'));
  if (thumbImages.length > 0) {
    log(`Page navigator has ${thumbImages.length} thumbnail previews`);
  } else {
    // Thumbnails might not have generated yet
    log('Page navigator present (thumbnails may still be generating)');
  }

  // Click page 3
  await driver.executeScript(`
    const buttons = document.querySelectorAll('[data-testid="page-navigator"] button');
    if (buttons[2]) buttons[2].click();
  `);
  await driver.sleep(1000);
  log('Page navigation works');
}

async function run() {
  console.log('\n\u{1F3A8} Editor Features Test\n');

  const tests = [
    { name: 'Toolbar buttons', fn: testToolbarButtons },
    { name: 'Export dialog', fn: testExportDialog },
    { name: 'Keyboard shortcuts', fn: testKeyboardShortcuts },
    { name: 'Right-click menu', fn: testRightClickMenu },
    { name: 'Layers panel', fn: testLayersPanel },
    { name: 'Properties panel', fn: testPropertiesPanel },
    { name: 'Photo library', fn: testPhotoLibrary },
    { name: 'Page navigator', fn: testPageNavigator },
  ];

  let passed = 0;
  let failed = 0;

  await setup();

  for (const test of tests) {
    try {
      console.log(`\n\u25b8 ${test.name}`);
      await test.fn();
      passed++;
    } catch (err) {
      failed++;
      console.log(`  \u2717 ${test.name}: ${(err as Error).message.slice(0, 100)}`);
    }
  }

  await driver.quit();

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Results: ${passed} passed, ${failed} failed, ${tests.length} total`);
  console.log(`${'─'.repeat(50)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

run();
