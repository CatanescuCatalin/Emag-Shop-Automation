import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const records = parse(fs.readFileSync(path.join(__dirname, 'words.csv')), {
  columns: true,
  skip_empty_lines: true
});


test.describe('EMAG Shop Test Suite', () => {


  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.emag.ro/');
  });

  for (const record of records) {
    test('go to emag for word: ' + record.word ,async ({page, browser}) => {
    
      
      const searchBox = await page.getByPlaceholder('Începe o nouă căutare');
      await searchBox.fill(record.word);
      await searchBox.press('Enter');
  
  
      const firstProduct = await page.locator('.card-v2').first();
      const titleHomeText = await firstProduct.locator('.card-v2-title').textContent();
      await expect(titleHomeText , 'Title should not be null or empty').not.toBeNull();
      const priceHomeText = await firstProduct.locator('.product-new-price').textContent();
      await expect(priceHomeText, 'Price should not be null or empty').not.toBeNull();
      await firstProduct.locator('.card-v2-title-wrapper > a').click();
  
      const detailPagePriceText = await page.locator('.main-product-form .product-new-price').textContent();
      await expect(detailPagePriceText, 'Price should not be null or empty').not.toBeNull();
      const detailPageTitleText = await page.locator('.page-title').textContent();
      await expect(detailPageTitleText, 'Title should not be null or empty').not.toBeNull();
    
  
      await expect(detailPagePriceText).not.toBeNull();
      expect(priceHomeText, 'Prices should match between search results and product page').toEqual(expect.stringMatching(detailPagePriceText!));
  
      expect(titleHomeText!.trim(), 'Titles should match between search results and product page').toEqual(expect.stringMatching(detailPageTitleText!.trim()));
  })}

  test.afterAll(async ({ browser }) => {
    await browser.close();
  });

})




