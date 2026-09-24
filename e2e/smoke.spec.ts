import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('o app carrega e o axe roda sem violações', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#root')).toBeAttached();
  // O showcase ainda é um esqueleto (lote 4): sem landmark `main` até lá.
  const results = await new AxeBuilder({ page })
    .disableRules(['landmark-one-main', 'region'])
    .analyze();
  expect(results.violations).toEqual([]);
});
