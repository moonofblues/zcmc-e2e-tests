# Module inventory, risk ranking and test order

Date: 2026-11-24. Source: read-only walk through http://192.168.36.164:8000/ plus `docs/QA-STRATEGY.md`. No form was submitted, no record changed, no file downloaded. Items under "Open questions" were read on screen and not confirmed by clicking into them.

## 1. Modules and purpose

| # | Module | Purpose |
|---|---|---|
| 1 | Overview | Dashboard of the whole flow: KPIs, action queue, freezer runway, 14-day stock movement, temperature check-in status. |
| 2 | Donors | Register donors, track screening clearance (Pass, Pending, Fail, Expired), log donation sessions, renew screening. |
| 3 | Pooling & Lab | Combine cleared donors' milk into batches and track pre-culture results through to the pasteurizer queue. |
| 4 | Pasteurization | Log Holder cycles (62.5°C for 30 min, chill below 4°C) and the 48-hour post-culture result, which clears or quarantines a batch. |
| 5 | Cold-Chain Storage | Freezer inventory (map and table), 6-month expiry, FEFO dispensing, thaw tracker, AM/PM temperature log. |
| 6 | NICU Recipients & MOM | Register infants, log DHM and mother's-own-milk doses against a batch, void doses, print stickers, handle twins. |
| 7 | Chain Traceback | Trace forward or backward between donor, pool, batch and recipient, and apply a recall lock to a batch. |
| - | Audit Trail (dialog) | Append-only event log with search, category tabs and a CSV export. |
| - | Screening Rules (dialog) | Screening validity (3, 6 or 12 months), expiry warning buffer, and whether an expired donor is hard-blocked or only warned. |
| - | Export to Excel, global scan box, month filter, theme switch | Cross-cutting features. Export to Excel not opened (it downloads a file). |

"Bedside Feeding" in the top bar opens the NICU module.

## 2. Risk ranking

| Rank | Module | Why |
|---|---|---|
| 1 | Cold-Chain Storage | Last gate before an infant: dispense eligibility, FEFO order, expiry, stock counts, thaw window. |
| 2 | NICU Recipients & MOM | The dose is given here. Wrong batch, wrong infant (twins), MOM mix-ups, void and undo. |
| 3 | Pasteurization | A failed post-culture must block release. Temperature and time parameters are entered here. |
| 4 | Donors | The screening gate keeps infected, expired or deferred donors out of the chain. Heavily used, and the entry point for all data. |
| 5 | Pooling & Lab | Donor-to-batch linkage, volume sums, bottle counts. Contaminated pools must not reach the pasteurizer. |
| 6 | Chain Traceback | Mostly read-only, but it is the recall tool and its recall lock writes data. |
| 7 | Overview | Read-only aggregates. High usage, low direct harm. Its numbers must match the other modules. |

Audit Trail and Screening Rules are cross-cutting. Screening Rules is high risk because changing it alters donor blocking everywhere.

## 3. Cross-module flows

1. **Happy path:** donor registered and screened, session logged, pool created, pre-culture pass, pasteurization cycle, post-culture 0 CFU, batch authorized into the freezer, dose logged to an infant, trace shows the full chain.
2. **Failed culture:** the batch is quarantined and cannot be authorized or dispensed. Overview warning, Pasteurization, Chain Traceback and Cold-Chain must agree.
3. **Donor screening expiry or deferral:** an expired, pending or failed donor is blocked from intake and pooling. Changing Screening Rules changes this.
4. **Recall:** trace by batch, donor or infant, apply the recall lock, then the batch is blocked in Cold-Chain dispensing and NICU Log Dose. Co-exposed infants are listed.
5. **FEFO and expiry:** earliest-expiring batch offered first, 6-month expiry, Expiring Soon filter.
6. **Dose and void:** a dose reduces batch stock and bottles, raises the infant's intake total, Overview dispensed and Chain feeding counts. Void must reverse all of them.
7. **Thaw:** Log Bottle Thawed starts the 24h fridge tracker, then the bottle is used or discarded.
8. **MOM 1-to-1 and twins:** a MOM bottle goes only to its matched infant. Twin wristband verification applies.
9. **Temperature log:** AM/PM entries update the Cold-Chain "3 Due" badge and the Overview check-in count.
10. **Audit:** every write above creates an audit event, plus the CSV export.
11. **Count reconciliation (read-only):** Cold-Chain dispensed (1,750 mL) equals NICU total (1,750 mL) equals the sum of fed volumes in Chain Traceback. All matched when read.

## 4. Recommended order for test generation

1. **Donors.** Entry point, dialogs already mapped. Creates the "PW TEST" donor that later chains depend on.
2. **Pooling & Lab.** Needs the PW TEST donor and creates the PW TEST pool.
3. **Pasteurization.** Produces the PW TEST batch and covers pass and fail culture paths.
4. **Cold-Chain Storage.** Dispensing, FEFO, expiry and thaw on the PW TEST batch.
5. **NICU Recipients & MOM.** Dose, void, MOM and twins, using the PW TEST batch and a PW TEST infant.
6. **Chain Traceback.** Traces and recall lock on the PW TEST chain.
7. **Overview.** Reconciliation checks against the other modules.
8. **Cross-cutting:** Audit Trail, Screening Rules, Export to Excel, accessibility scans.

The order differs from the risk ranking on purpose. The rule is to never touch records that are not "PW TEST", so Cold-Chain and NICU tests cannot dispense from the existing mock batches. They need a PW TEST batch built through the upstream modules first.

Optional first step: read-only reconciliation checks (flow 11). They are cheap and change no data.

## 5. Open questions to settle before writing expected results

- **Quarantine status disagrees across modules.** Chain Traceback marks BATCH-20261020-05, BATCH-20261020-07 and B-2026-10-04 as Quarantined or Recall Lock. Pasteurization shows only B-2026-10-04 as failed. Cold-Chain still shows Dispense buttons on 05 and 07, marked "Not approved", and counts them in "Available freezer stock 5,600 mL". Overview shows 3,900 mL across "4 released lots". The gap is exactly those two batches (900 + 800 = 1,700 mL).
- **B-2026-10-03 bottle count.** 1,450 mL is 14 bottles of 100 mL in Pooling and Pasteurization, but 15 bottles in Cold-Chain.
- **B-2026-10-04.** Pre-culture Pass in Pooling. In Chain Traceback it reads "Quarantined" next to "Ready for Batch Dispensing". Missing from the Cold-Chain list of 7, while Chain Traceback lists 8.
- **Cleared donors.** Chain Traceback says "8 cleared mothers", Donors shows 6 Pass.
- **Escape key.** It did not close the Screening Rules dialog (seen once). Relevant to the keyboard checks.

## 6. Risks to the test approach

- **Cleanup may not be possible.** No Delete button was seen in the lists. Pooled batches show "Locked" and doses have "Void", not delete. Profile & History, Dossier and More were not opened, so "delete at the end of the test" needs checking.
- **The audit log is permanent.** Each test write adds entries that cannot be cleaned up. Assert on counts before and after, not absolute numbers.
- **Shared, changing data.** One instance, no sandbox. Assert on deltas for PW TEST records only.
- **Dates move.** Expiry countdowns depend on today's date.
- **SPA load.** The app shows "Loading Human Milk Bank records..." on first load. Tests must wait for it.
- **Not explored yet:** Create New Pool, Log Pasteurization Cycle, Authorize New Batch, Log Bottle Thawed, temperature log dialog, Dossier, Cryo-Labels, Register Recipient, Export to Excel.
