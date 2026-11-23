# ZCMC end-to-end tests

Playwright tests for ZCMC systems. **One branch per system**: pick the branch of the system you want to test.

| Branch | System | Sandbox |
| --- | --- | --- |
| `pr-tracking-system` | PR Tracking System | https://sandbox-pr.zcmc.online |
| `recruitment-system` | Recruitment System | https://recruitment.zcmc.online (live site, no sandbox: read the branch README rules first) |
| `human-milk-bank-tracker` | Human Milk Bank Tracker | http://192.168.36.164:8000/ (private ZCMC network address, no login, mock data: read the branch README rules first) |

## Use a system's tests on a PC

```bash
git clone -b pr-tracking-system https://github.com/moonofblues/zcmc-e2e-tests.git
cd zcmc-e2e-tests
npm install
npx playwright install chromium
```

Then follow the README on that branch (secrets such as `.env` and `.auth/state.json` are not in the repo).

## Adding another system

Create a new branch named after the system (lowercase, dashes), put that system's tests at the root of the branch, and add a row to the table above.
