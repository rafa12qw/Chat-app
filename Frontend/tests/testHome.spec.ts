import { test, expect } from '@playwright/test';


test('go to sign In page', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  //Click in the sign In
  await page.getByRole('button', { name: 'Sign In'}).click();

  //Expects page to have title signIn
  await expect(page).toHaveURL('http://localhost:3000/signIn');
});

test('go to sign Up page', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  //Click in the sign In
  await page.getByRole('button', { name: 'Sign Up'}).click();

  //Expects page to have title signIn
  await expect(page).toHaveURL('http://localhost:3000/signUp');

});
