import { test } from '@playwright/test';
import { TERMINAL_EMPLOYEE_ID, TERMINAL_PIN } from '../support/petty-cash';
import {
  authorizeWithPin, openPettyCashTerminal, searchEmployee, selectTransactions, terminalPanel,
} from '../support/terminal';

// The end user collects released documents from the OMCC and receives them at the terminal.
// Needs requests already released by the OMCC (the OMCC release test produces them).
test.describe('OMCC terminal: petty cash receiving', () => {
  test.skip(!TERMINAL_EMPLOYEE_ID || !TERMINAL_PIN, 'Set TEST_USER_EMPLOYEE_ID and TEST_USER_PIN in e2e/.env');

  test('end user receives released petty cash requests at the terminal', async ({ page }) => {
    // "Receiving of Petty Cash from OMCC Terminal" is the right-hand panel.
    await openPettyCashTerminal(page);
    await searchEmployee(page, 'receiving', TERMINAL_EMPLOYEE_ID!);

    // One request listed -> select it. Several -> select 2 to 4. Then Confirm.
    const selected = await selectTransactions(page);
    test.skip(selected === 0, 'No released requests to receive. Run the OMCC release test first.');
    console.log(`Receiving ${selected} request(s)`);

    // Authorize with the PIN; the terminal reports success.
    await terminalPanel(page, 'receiving').proceedWithPin.click();
    await authorizeWithPin(page, TERMINAL_PIN!);
  });
});
