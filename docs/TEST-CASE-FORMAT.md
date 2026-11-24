# Test case document format

Test cases are written as CSV files (one per module, in `test-cases/`) using these columns, in this order:

| # | Column | Description |
|---|--------|-------------|
| 1 | Test case ID | Unique ID, format `TC-XXX-nnn` (for example `TC-DON-001`). The same ID goes in the Playwright test title. |
| 2 | Title | Short summary of what is verified. |
| 3 | Description | What the test covers and why. |
| 4 | Pre-conditions | State the system or data must be in before the test starts. |
| 5 | Test steps | Numbered steps to perform. |
| 6 | Expected results | What should happen if the system is correct. |
| 7 | Status | Result of the latest run (see values below). Blank if not run. |
| 8 | Actual results | What really happened. Fill in when Status is Failed or Blocked. |
| 9 | Bug Status | State of the linked bug (see values below). Blank if no bug. |
| 10 | Severity | Impact of the bug (see values below). Blank if no bug. |
| 11 | Notes | Anything else: bug link, environment, workaround, retest date. |

Header row to copy:

```
Test case ID,Title,Description,Pre-conditions,Test steps,Expected results,Status,Actual results,Bug Status,Severity,Notes
```

## Allowed values

**Status**
- `Passed`
- `Failed`
- `Blocked`
- `[Retested] Passed`

**Bug Status**
- `Open`
- `Closed`
- `Fixed`

**Severity**
- `Critical`
- `Major`
- `Minor`
- `Low`

## Rules
- One row per test case. Wrap any cell that contains a comma or line break in double quotes.
- Put numbered steps in one cell, separated by line breaks.
- Use only the values listed above for Status, Bug Status and Severity.
- Test data created by a test is named "PW TEST" and deleted at the end of the test.

## Example

```
Test case ID,Title,Description,Pre-conditions,Test steps,Expected results,Status,Actual results,Bug Status,Severity,Notes
TC-DON-001,Register a new donor,Verify a donor can be registered with valid details,"App is open on the Donors module","1. Click New Donor Registration
2. Enter name ""PW TEST Donor"" and valid details
3. Submit","Donor appears in the donor list",Passed,,,,
```
