import { test } from '@playwright/test';
import { processFirstRequestInQueue } from '../support/queue';

const PIN = process.env.TEST_USER_PIN; // same PIN as the end user, like the custodian

// Works on requests the Custodian already processed (they appear in Budget's queue).
test.describe('Budget: process a request in my queue', () => {
  test.skip(!PIN, 'Set TEST_USER_PIN in e2e/.env');

  test('process: removed from my queue, success shown, Budget is the latest office on the timeline', async ({ page }) => {
    const code = await processFirstRequestInQueue(page, { user: 'Budget', office: 'Budget', pin: PIN! });
    test.skip(code === undefined, 'Budget has nothing in the queue. Run the custodian process test first.');
  });
});
