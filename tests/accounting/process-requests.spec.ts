import { test } from '@playwright/test';
import { processFirstRequestInQueue } from '../support/queue';

const PIN = process.env.TEST_USER_PIN; // same PIN as the end user, like the custodian

// Works on requests Budget already processed (they appear in Accounting's queue).
test.describe('Accounting: process a request in my queue', () => {
  test.skip(!PIN, 'Set TEST_USER_PIN in e2e/.env');

  test('process: removed from my queue, success shown, Accounting is the latest office on the timeline', async ({ page }) => {
    const code = await processFirstRequestInQueue(page, {
      user: 'Accounting - Mark, Joseph tubo',
      office: 'Accounting',
      pin: PIN!,
    });
    test.skip(code === undefined, 'Accounting has nothing in the queue. Run the budget process test first.');
  });
});
