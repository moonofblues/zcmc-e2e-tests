import { test } from '@playwright/test';
import { TERMINAL_EMPLOYEE_ID, TERMINAL_PIN } from '../support/petty-cash';
import {
  authorizeWithPin, openPettyCashTerminal, searchEmployee, selectTransactions, terminalPanel,
} from '../support/terminal';

// The end user brings filed requests to the OMCC and submits them at the terminal.
// Uses requests already filed in the sandbox; the filing test (tests/requests) creates them.
test.describe('OMCC terminal: petty cash submission', () => {
  test.skip(!TERMINAL_EMPLOYEE_ID || !TERMINAL_PIN, 'Set TEST_USER_EMPLOYEE_ID and TEST_USER_PIN in e2e/.env');

  test('end user submits filed petty cash requests at the terminal', async ({ page }) => {
    // "Submission of Petty Cash to OMCC Terminal" is the left-hand panel.
    await openPettyCashTerminal(page);
    await searchEmployee(page, 'submission', TERMINAL_EMPLOYEE_ID!);

    // One request listed -> select it. Several -> select 2 to 4. Then Confirm.
    const selected = await selectTransactions(page);
    test.skip(selected === 0, 'No filed requests to submit. Run the filing test (tests/requests) first.');
    console.log(`Submitting ${selected} request(s)`);

    // Authorize with the PIN; the terminal reports success.
    await terminalPanel(page, 'submission').proceedWithPin.click();
    await authorizeWithPin(page, TERMINAL_PIN!);
  });
});
