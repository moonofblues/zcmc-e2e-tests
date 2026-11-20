/**
 * Creates one test case tab per module by copying the "Test Cases" tab.
 * A script cannot copy the "Test Cases" tab because it contains a Table, so the tabs are made by hand first:
 *   1. Right-click the "Test Cases" tab > Duplicate. Do it 5 times.
 *   2. Rename the copies exactly: Landing Page, Landing Buttons, Job Browsing, Registration, Login.
 *   3. Extensions > Apps Script, paste this file, choose fillTestCaseTabs and click Run. Approve the prompt.
 * A tab whose row 10 already has data is skipped, never overwritten.
 * Generated from the CSV files on 2026-11-20.
 */
const CREATED_BY = 'Quin Ledesma';
const TEST_SUITE = 'Recruitment Portal (Applicant)';
const TEMPLATE_TAB = 'Test Cases';
const FIRST_DATA_ROW = 10; // the template header row is row 9

// Each case: [ID, Title, Description, Test steps, Expected results, Status, Actual results, Bug Status, Severity, Notes]
const MODULES = [
 {
  "tab": "Landing Page",
  "prereq": "Internet access to https://recruitment.zcmc.online/. A desktop browser (and a 375 x 812 window for the mobile case).",
  "cases": [
   [
    "TC-LAND-001",
    "Page loads with the correct title",
    "Verify the landing page opens and the browser tab title is correct",
    "1. Open https://recruitment.zcmc.online/",
    "The page loads and the browser tab title is 'ZCMC Job Portal'",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing.spec.ts"
   ],
   [
    "TC-LAND-002",
    "Hero section shows heading and subtitle",
    "Verify the hero section content is displayed",
    "1. Open the landing page\n2. Look at the top section",
    "The heading 'Build Our Future with ZCMC' is visible, with 'Zamboanga City Medical Center' and the subtitle 'Join the Zamboanga City Medical Center and make a difference in healthcare excellence'",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing.spec.ts"
   ],
   [
    "TC-LAND-003",
    "Open Positions section is displayed",
    "Verify the Open Positions section and its description appear",
    "1. Open the landing page\n2. Scroll to the Open Positions section",
    "The heading 'Open Positions' and the text 'Explore exciting career opportunities at Zamboanga City Medical Center' are visible",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing.spec.ts. No jobs are currently posted so the list under this heading is empty"
   ],
   [
    "TC-LAND-004",
    "Why Join ZCMC section shows all six benefit cards",
    "Verify all benefit cards are displayed",
    "1. Open the landing page\n2. Scroll to the Why Join ZCMC? section",
    "The six cards are visible: Healthcare Coverage, Professional Development, Career Growth, Meaningful Work, Team Environment, Additional Benefits",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing.spec.ts"
   ],
   [
    "TC-LAND-005",
    "Call-to-action section is displayed",
    "Verify the closing call-to-action section appears",
    "1. Open the landing page\n2. Scroll to the bottom section",
    "The heading 'Ready to Start Your Journey?' and the text 'Apply now and become part of ZCMC's dedicated team' are visible",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing.spec.ts"
   ],
   [
    "TC-LAND-006",
    "Footer shows address, contact details and copyright",
    "Verify the footer information is complete",
    "1. Open the landing page\n2. Scroll to the footer",
    "The footer shows the address (Dr. Evangelista St., Sta. Catalina, Zamboanga City, 7000), the telephone numbers, the email address and the copyright notice",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing.spec.ts"
   ],
   [
    "TC-LAND-007",
    "No console errors or failed requests on load",
    "Verify the page loads cleanly",
    "1. Open the landing page with browser developer tools open\n2. Check the Console and Network tabs",
    "No console errors and no failed network requests",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing.spec.ts"
   ],
   [
    "TC-LAND-008",
    "All images load",
    "Verify there are no broken images",
    "1. Open the landing page\n2. Scroll through the whole page",
    "All images are displayed and none are broken",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing.spec.ts"
   ],
   [
    "TC-LAND-009",
    "No horizontal scroll on a phone-size screen",
    "Verify the layout fits a mobile screen (375 x 812)",
    "1. Open the landing page in a 375 x 812 window or phone\n2. Try scrolling sideways",
    "The page does not scroll horizontally and the content fits the screen",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing.spec.ts"
   ]
  ]
 },
 {
  "tab": "Landing Buttons",
  "prereq": "Internet access to https://recruitment.zcmc.online/. External links are checked by address only.",
  "cases": [
   [
    "TC-BTN-001",
    "Join ZCMC button leads to the job list",
    "Verify the Join ZCMC button opens the job list",
    "1. Open the landing page\n2. Scroll to the 'Ready to Start Your Journey?' section\n3. Click 'Join ZCMC'",
    "The Browse Open Positions page (/jobs) opens",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing-buttons.spec.ts"
   ],
   [
    "TC-BTN-002",
    "Hero Browse Jobs button leads to the job list",
    "Verify the hero Browse Jobs button opens the job list",
    "1. Open the landing page\n2. Click 'Browse Jobs' in the top section",
    "The Browse Open Positions page (/jobs) opens",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing-buttons.spec.ts"
   ],
   [
    "TC-BTN-003",
    "View All Open Positions button leads to the job list",
    "Verify the button opens the job list",
    "1. Open the landing page\n2. Scroll to Open Positions\n3. Click 'View All Open Positions'",
    "The Browse Open Positions page (/jobs) opens",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing-buttons.spec.ts"
   ],
   [
    "TC-BTN-004",
    "Hero About ZCMC button opens the ZCMC profile page",
    "Verify the About ZCMC button leads to the ZCMC DOH profile page",
    "1. Open the landing page\n2. Click 'About ZCMC' in the top section",
    "The ZCMC DOH profile page (https://zcmc.doh.gov.ph/profile/) opens",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing-buttons.spec.ts. External site: only the address is checked. It may open in the same tab or a new tab"
   ],
   [
    "TC-BTN-005",
    "Header Home link returns to the landing page",
    "Verify the Home link in the header",
    "1. Open /jobs\n2. Click 'Home' in the header",
    "The landing page opens with the heading 'Build Our Future with ZCMC'",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing-buttons.spec.ts"
   ],
   [
    "TC-BTN-006",
    "Header Jobs link opens the job list",
    "Verify the Jobs link in the header",
    "1. Open the landing page\n2. Click 'Jobs' in the header",
    "The Browse Open Positions page (/jobs) opens",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing-buttons.spec.ts"
   ],
   [
    "TC-BTN-007",
    "Header Login link opens the login page",
    "Verify the Login link in the header",
    "1. Open the landing page\n2. Click 'Login' in the header",
    "The login page (/login) opens with the heading 'Welcome Back'",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing-buttons.spec.ts"
   ],
   [
    "TC-BTN-008",
    "Footer Browse Jobs link opens the job list",
    "Verify the Browse Jobs link in the footer",
    "1. Open the landing page\n2. Scroll to the footer\n3. Click 'Browse Jobs' under Quick Links",
    "The Browse Open Positions page opens",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing-buttons.spec.ts. The link goes to /Jobs (capital J) while the header uses /jobs"
   ],
   [
    "TC-BTN-009",
    "Footer About Us and Contact Us links point to the ZCMC DOH site",
    "Verify the external link addresses",
    "1. Open the landing page\n2. Scroll to the footer\n3. Check the About Us and Contact Us links",
    "About Us points to https://zcmc.doh.gov.ph/profile/ and Contact Us points to https://zcmc.doh.gov.ph/about-us/",
    "Not run",
    "",
    "",
    "",
    "Playwright: landing-buttons.spec.ts. Only the link addresses are checked. The external pages are not opened"
   ]
  ]
 },
 {
  "tab": "Job Browsing",
  "prereq": "Internet access to https://recruitment.zcmc.online/jobs. Some cases need at least one posted job.",
  "cases": [
   [
    "TC-JOB-001",
    "Page loads with heading and search section",
    "Verify the job list page opens with its main sections",
    "1. Open https://recruitment.zcmc.online/jobs",
    "The title is 'ZCMC Job Portal'. The heading 'Browse Open Positions', the 'Search & Filter Jobs' section and the 'Available Positions' section are visible",
    "Not run",
    "",
    "",
    "",
    "Playwright: jobs.spec.ts"
   ],
   [
    "TC-JOB-002",
    "Keyword box, employment type filter, Search and Clear Filters are present",
    "Verify all search controls are displayed",
    "1. Open the job list page\n2. Look at the Search & Filter Jobs section",
    "The keyword box (placeholder 'e.g. Medical Officer, Nurse, Administrative Aide'), the Employment Type dropdown ('All Types'), and the Search and Clear Filters buttons are visible",
    "Not run",
    "",
    "",
    "",
    "Playwright: jobs.spec.ts"
   ],
   [
    "TC-JOB-003",
    "Result count is shown",
    "Verify the number of jobs found is displayed",
    "1. Open the job list page\n2. Look under Available Positions",
    "A count such as 'N jobs found' is displayed",
    "Not run",
    "",
    "",
    "",
    "Playwright: jobs.spec.ts"
   ],
   [
    "TC-JOB-004",
    "Search for a keyword that does not exist shows the empty state",
    "Verify the no-results message",
    "1. Open the job list page\n2. Type 'zzzz-no-such-job-zzzz' in the keyword box\n3. Click Search",
    "'0 jobs found' and 'No matching jobs found' are shown",
    "Not run",
    "",
    "",
    "",
    "Playwright: jobs.spec.ts"
   ],
   [
    "TC-JOB-005",
    "Clear Filters resets the keyword box",
    "Verify Clear Filters empties the search",
    "1. Open the job list page\n2. Type 'Nurse' in the keyword box\n3. Click Clear Filters",
    "The keyword box is empty",
    "Not run",
    "",
    "",
    "",
    "Playwright: jobs.spec.ts"
   ],
   [
    "TC-JOB-006",
    "Header and footer navigation are present",
    "Verify navigation is shown on the job list page",
    "1. Open the job list page\n2. Check the header and footer",
    "The Home and Login links are in the header, and the footer shows Zamboanga City Medical Center details",
    "Not run",
    "",
    "",
    "",
    "Playwright: jobs.spec.ts"
   ],
   [
    "TC-JOB-007",
    "Posted jobs are listed and match the count",
    "Verify posted jobs appear in the list",
    "1. Open the job list page\n2. Count the job cards and compare with the 'N jobs found' text",
    "The number of job cards equals the number shown in 'N jobs found'",
    "Not run",
    "",
    "",
    "",
    "Playwright: jobs.spec.ts. Cannot be run now: no jobs are posted on the live portal (0 jobs found). Blocked until jobs are posted"
   ],
   [
    "TC-JOB-008",
    "Searching by an existing job title returns matching jobs",
    "Verify keyword search finds a posted job",
    "1. Open the job list page\n2. Type the title of a listed job in the keyword box\n3. Click Search",
    "The job with that title is still listed",
    "Not run",
    "",
    "",
    "",
    "Playwright: jobs.spec.ts. Blocked until jobs are posted"
   ],
   [
    "TC-JOB-009",
    "Opening a job shows its details",
    "Verify a job's detail view",
    "1. Open the job list page\n2. Click a job",
    "The job details are shown (title, description, requirements and an apply option)",
    "Not run",
    "",
    "",
    "",
    "Playwright: jobs.spec.ts. Blocked until jobs are posted. Update the expected result after seeing the real details page"
   ]
  ]
 },
 {
  "tab": "Registration",
  "prereq": "A new Mailinator email address for every full registration (an email can be registered only once). Dropdown data must be loaded. Use fake data only.",
  "cases": [
   [
    "TC-REG-001",
    "Page loads on Step 1 of 7 with all seven steps in the stepper",
    "Verify the registration wizard opens on the first step",
    "1. Open https://recruitment.zcmc.online/register",
    "The heading 'Applicant Registration', 'Step 1 of 7' and '14% Completed' are shown. The stepper lists Profile, Address, Education, Eligibility, Experience, References and IPCR",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-002",
    "Step 1 shows all personal information fields",
    "Verify the personal information fields are displayed",
    "1. Open the registration page\n2. Look at Personal Information",
    "First Name, Middle Name, Last Name, Name Extension (optional), Sex, Date of Birth, Civil Status and Place of Birth are shown",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-003",
    "Step 1 shows demographics and account fields",
    "Verify the demographic and account fields are displayed",
    "1. Open the registration page\n2. Scroll to Demographics & Background and Account Credentials & Contact",
    "Blood Type, Religion, Sexual Orientation, Specific Membership, Ethnicity, Citizenship, Mobile Phone Number, Email Address and Password are shown",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-004",
    "Empty Step 1 cannot proceed to Step 2",
    "Verify required-field validation",
    "1. Open the registration page\n2. Leave all fields empty\n3. Click Next Step",
    "The form stays on Step 1 of 7 and the empty required fields are flagged",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-005",
    "Invalid email format is rejected",
    "Verify email validation",
    "1. Open the registration page\n2. Type 'not-an-email' in the Email Address field\n3. Click Next Step",
    "The email is flagged as invalid and the form does not proceed",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-006",
    "Password field hides the typed characters",
    "Verify the password is masked",
    "1. Open the registration page\n2. Type in the Password field",
    "The characters are masked",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-007",
    "Already registered Login link opens the login page",
    "Verify the Login link on the registration page",
    "1. Open the registration page\n2. Click 'Login' next to 'Already registered?'",
    "The login page (/login) opens",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-008",
    "Sync UMIS Account option is shown for ZCMC employees",
    "Verify the UMIS sync prompt",
    "1. Open the registration page\n2. Scroll to the bottom",
    "The text 'Currently employed in ZCMC?' and the link 'Click here to sync UMIS Account' are shown",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-009",
    "Dropdown options are loaded",
    "Verify the registration dropdowns have options",
    "1. Open the registration page\n2. Click the Sex dropdown\n3. Repeat for Civil Status, Blood Type, Religion, Sexual Orientation, Specific Membership and Ethnicity",
    "Each dropdown lists selectable options",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. The dropdown data was empty earlier (/api/selection-templates returned []) and is loaded now. Sex: Male/Female. Civil Status: Single/Married/Divorced/Widowed. Blood Type: A+ to O- plus Unknown/Not Sure"
   ],
   [
    "TC-REG-010",
    "Applicant completes Step 1 and proceeds to Step 2",
    "Full registration (Step 1 only for now)",
    "1. Open the registration page\n2. Fill in all required Step 1 fields with test data (email from a Mailinator inbox)\n3. Select an option in every dropdown\n4. Click Next Step",
    "Step 2 of 7 opens",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. Fills Step 1 only and clicks Next Step. Middle Name is required. TC-REG-011 to TC-REG-034 cover Steps 2 to 7 and the final submit"
   ],
   [
    "TC-REG-011",
    "Step 2 shows the residential and permanent address fields",
    "Verify the address fields are displayed",
    "1. Complete Step 1 and click Next Step\n2. Look at Step 2",
    "Step 2 of 7 'Address Details' (29% Completed) shows Residential Address and Permanent Address. Each has House / Block / Lot No.; Street; Subdivision / Village (optional); City / Municipality; Barangay; Province; Zip Code and Telephone / Contact No.",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-012",
    "Empty Step 2 cannot proceed to Step 3",
    "Verify required-field validation on the address step",
    "1. Complete Step 1 and open Step 2\n2. Leave all fields empty\n3. Click Next Step",
    "The form stays on Step 2 of 7 and the empty required fields are flagged",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-013",
    "Choosing a city loads the barangays and fills Province and Zip Code",
    "Verify the dependent address fields",
    "1. Open Step 2\n2. In City / Municipality type 'Zamboanga City' and select 'Zamboanga City (Zamboanga Del Sur)'\n3. Open the Barangay list",
    "Province shows 'Zamboanga Del Sur' and Zip Code shows 7000 automatically. The Barangay list loads (first item 'Arena Blanco') and was disabled until a city was chosen",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-014",
    "Same as residential address copies and locks the permanent address",
    "Verify the 'Same as residential address' checkbox",
    "1. Fill in the Residential Address on Step 2\n2. Tick 'Same as residential address'",
    "Every Permanent Address field shows the residential values and is disabled. Unticking the box makes them editable again",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. Unticking is to be confirmed"
   ],
   [
    "TC-REG-015",
    "Back keeps the data entered on the previous step",
    "Verify no data is lost when going back",
    "1. Complete Step 1 and open Step 2\n2. Click Back",
    "Step 1 of 7 opens and all the Step 1 values are still filled in",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-016",
    "Step 3 starts empty and Add Education Entry shows the education fields",
    "Verify the education step",
    "1. Complete Steps 1 and 2 and open Step 3\n2. Click 'Add Education Entry'",
    "Step 3 of 7 (43% Completed) shows 'No educational entries added yet'. After clicking, Education Entry #1 shows Education Level (Elementary, Secondary, Vocational/Trade Course, College, Graduate Studies), School / Institution Name, Degree / Course, Year From, Year To and Honors / Distinction Received (optional)",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. A toast reads 'Please complete your educational background.'"
   ],
   [
    "TC-REG-017",
    "Empty education entry cannot proceed",
    "Verify required-field validation in an education entry",
    "1. Open Step 3\n2. Click 'Add Education Entry'\n3. Leave the entry empty\n4. Click Next Step",
    "The form stays on Step 3 of 7 and the required fields are flagged",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. To confirm whether Next Step also blocks when no entry is added at all"
   ],
   [
    "TC-REG-018",
    "Year To earlier than Year From is rejected",
    "Verify the education year range",
    "1. Open Step 3 and add an education entry\n2. Select Year From 2025\n3. Select Year To 2021\n4. Click Next Step",
    "The range is rejected with a message and the form stays on Step 3",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. Observed: the Year To list offers years earlier than Year From. Expected behavior is to confirm"
   ],
   [
    "TC-REG-019",
    "An education entry can be removed",
    "Verify the delete button on an entry",
    "1. Open Step 3\n2. Click 'Add Education Entry'\n3. Click the red delete button on Education Entry #1",
    "The entry disappears and 'No educational entries added yet' is shown again",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. The same delete button exists on Eligibility"
   ],
   [
    "TC-REG-020",
    "Step 4 Add Eligibility Entry shows the eligibility fields",
    "Verify the eligibility step",
    "1. Open Step 4\n2. Click 'Add Eligibility Entry'",
    "Step 4 of 7 (57% Completed) 'Civil Service & Professional Eligibility' shows 'No eligibility entries added yet'. After clicking, Eligibility Entry #1 shows Civil Service Eligibility / License Title, Rating (%), Date of Examination / Conferment, Place of Examination / Conferment, Date Released (optional) and Date of Validity (optional)",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. Titles include Career Service Professional (Second Level); Career Service Sub-Professional (First Level); PRC Board Passer; Bar Exam Passer; PD 907 (Honor Graduate) and others"
   ],
   [
    "TC-REG-021",
    "Empty eligibility entry cannot proceed",
    "Verify required-field validation in an eligibility entry",
    "1. Open Step 4\n2. Click 'Add Eligibility Entry'\n3. Leave the entry empty\n4. Click Next Step",
    "The form stays on Step 4 of 7 and the required fields are flagged",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. To confirm whether an applicant with no eligibility can skip this step"
   ],
   [
    "TC-REG-022",
    "Step 5 Add Experience Entry shows the work experience fields",
    "Verify the work experience step",
    "1. Open Step 5\n2. Click 'Add Experience Entry'",
    "Step 5 of 7 (71% Completed) 'Work Experience' shows 'No work experience added yet'. After clicking, Experience Entry #1 shows Inclusive Date (From), Inclusive Date (To), 'Currently Employed here (Present)' checkbox, Position Title, Department / Agency / Company, Status of Appointment and a Government Service? switch (default 'No (Private)')",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-023",
    "Currently Employed here removes the need for an end date",
    "Verify the Present option",
    "1. Open Step 5 and add an entry\n2. Tick 'Currently Employed here (Present)'",
    "The Inclusive Date (To) field is disabled or cleared and the entry can be saved without an end date",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. Behavior to confirm"
   ],
   [
    "TC-REG-024",
    "Empty experience entry cannot proceed",
    "Verify required-field validation in an experience entry",
    "1. Open Step 5\n2. Click 'Add Experience Entry'\n3. Leave the entry empty\n4. Click Next Step",
    "The form stays on Step 5 of 7 and the required fields are flagged",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. To confirm whether this step can be skipped with no entries"
   ],
   [
    "TC-REG-025",
    "Step 6 Add Reference Entry shows the reference fields",
    "Verify the character references step",
    "1. Open Step 6\n2. Click 'Add Reference Entry'",
    "Step 6 of 7 (86% Completed) 'Character References' shows 'No character references added yet'. After clicking, Reference #1 shows Full Name, Position / Title, Email Address, Contact Number, Relationship Type (Supervisor, Subordinate, Peer) and Office / Work Address",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-026",
    "Reference with an invalid email is rejected",
    "Verify email validation on a reference",
    "1. Open Step 6 and add a reference\n2. Fill in every field but type 'not-an-email' as the Email Address\n3. Click Next Step",
    "The email is flagged as invalid and the form stays on Step 6",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-027",
    "Step 7 shows the IPCR rating field and it can be left blank",
    "Verify the IPCR step",
    "1. Open Step 7\n2. Leave the rating empty",
    "Step 7 of 7 (100% Completed) shows 'Latest IPCR Numerical Rating (1.00 - 5.00)' and the hint that it can be left empty if the applicant never worked in a government agency. The Finish Registration button is shown",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-028",
    "IPCR rating outside 1.00 to 5.00 is rejected",
    "Verify the IPCR range",
    "1. Open Step 7\n2. Type 0.5 and click Finish Registration\n3. Type 5.5 and click Finish Registration",
    "Both values are rejected and the Registration Prompt does not open",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. Behavior to confirm"
   ],
   [
    "TC-REG-029",
    "Progress bar and stepper follow the current step",
    "Verify the progress indicators",
    "1. Complete the steps one at a time\n2. Check the percentage and the stepper after each Next Step",
    "The progress shows 14%, 29%, 43%, 57%, 71%, 86% and 100% for Steps 1 to 7. Finished steps show a check mark in the stepper",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts"
   ],
   [
    "TC-REG-030",
    "Finish Registration opens the Registration Prompt",
    "Verify the pre-submit reminders",
    "1. Complete Steps 1 to 7\n2. Click Finish Registration\n3. Click Next on each tab",
    "The 'Registration Prompt' dialog opens with the tabs Credentials, Security and Recovery. The last tab has the button 'I Understand, Continue'. Cancel closes it without submitting",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. Does not create an account if the dialog is cancelled"
   ],
   [
    "TC-REG-031",
    "Legal Affirmation requires the sworn statement before finalizing",
    "Verify the Legal Affirmation dialog",
    "1. Click 'I Understand, Continue' in the Registration Prompt\n2. Look at the Confirm & Finalize button\n3. Choose a verification channel\n4. Tick 'I swear that all information provided is true, accurate, and complete.'",
    "The dialog warns about a permanent lifetime ban. Confirm & Finalize is disabled until the box is ticked. Email Address is selected by default and Mobile Number can be chosen instead",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. Cancel closes the dialog without submitting"
   ],
   [
    "TC-REG-032",
    "Submitting the registration opens the verification page",
    "Verify what happens after Confirm & Finalize",
    "1. Tick the sworn statement\n2. Click Confirm & Finalize",
    "The page opens /verify and asks the applicant to verify the email address",
    "Failed",
    "The page moved to /verify, which is completely blank. No text, form or buttons are shown, also after a reload",
    "Open",
    "High",
    "Seen manually on 2026-11-20 with Email Address as the channel. Needs a developer to check. Playwright: register.spec.ts (full-registration group)"
   ],
   [
    "TC-REG-033",
    "A verification message is sent to the email address",
    "Verify the verification email arrives",
    "1. Submit the registration with a Mailinator email address\n2. Open the Mailinator inbox",
    "A verification message from ZCMC arrives with a code or link",
    "Not run",
    "The inbox was empty a few minutes after the submit on 2026-11-20. Needs a recheck because the /verify page was blank",
    "",
    "",
    "Public inbox: use only fake data. Playwright: register.spec.ts (full-registration group)"
   ],
   [
    "TC-REG-034",
    "An email that is already registered is rejected on Step 1",
    "Verify the duplicate email check",
    "1. Open the registration page\n2. Fill in Step 1 using an email that already has an account (for example zcmc.pwtest01@mailinator.com)",
    "The message 'This email address is already registered.' is shown under the Email Address field and Next Step is disabled",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. Observed: the check happens on Step 1"
   ],
   [
    "TC-REG-035",
    "Specific Membership PWD requires a Type of Disability",
    "Verify the conditional field on Step 1",
    "1. Open the registration page\r\n2. Fill in Step 1\r\n3. Choose 'PWD (Person with Disability)' as Specific Membership",
    "A required 'Type of Disability' dropdown appears and Next Step stays disabled until a type is chosen",
    "Not run",
    "",
    "",
    "",
    "Playwright: register.spec.ts. Observed on 2026-11-20. The list of disability types is still to be recorded"
   ]
  ]
 },
 {
  "tab": "Login",
  "prereq": "An existing account for the Portal Gateway cases. An applicant-only account for the role case. Use test credentials only.",
  "cases": [
   [
    "TC-LOGIN-001",
    "Page loads with the login form",
    "Verify the login page and its fields",
    "1. Open https://recruitment.zcmc.online/login",
    "The heading 'Welcome Back', the Email Address and Password fields, the Remember me checkbox and the Log in button are shown",
    "Not run",
    "",
    "",
    "",
    "Playwright: login.spec.ts"
   ],
   [
    "TC-LOGIN-002",
    "Password field hides the typed characters",
    "Verify the password is masked",
    "1. Open the login page\n2. Type in the Password field",
    "The characters are masked",
    "Not run",
    "",
    "",
    "",
    "Playwright: login.spec.ts"
   ],
   [
    "TC-LOGIN-003",
    "Alternative sign-in options are shown",
    "Verify the other login options",
    "1. Open the login page\n2. Scroll to 'OR CONTINUE WITH'",
    "ZCMC UMIS and Google Account options are shown",
    "Not run",
    "",
    "",
    "",
    "Playwright: login.spec.ts. The options are only checked as shown. They are not clicked"
   ],
   [
    "TC-LOGIN-004",
    "Forgot password link opens the password reset page",
    "Verify the Forgot password? link",
    "1. Open the login page\n2. Click 'Forgot password?'",
    "The password reset page (/forgot-password) opens",
    "Not run",
    "",
    "",
    "",
    "Playwright: login.spec.ts"
   ],
   [
    "TC-LOGIN-005",
    "Register now link opens the registration page",
    "Verify the Register now link",
    "1. Open the login page\n2. Click 'Register now'",
    "The registration page (/register) opens",
    "Not run",
    "",
    "",
    "",
    "Playwright: login.spec.ts"
   ],
   [
    "TC-LOGIN-006",
    "Back to Home returns to the landing page",
    "Verify the Back to Home link",
    "1. Open the login page\n2. Click 'Back to Home'",
    "The landing page opens",
    "Not run",
    "",
    "",
    "",
    "Playwright: login.spec.ts"
   ],
   [
    "TC-LOGIN-007",
    "Empty form cannot be submitted",
    "Verify required-field validation",
    "1. Open the login page\n2. Leave both fields empty\n3. Click Log in",
    "The form stays on the login page and the empty fields are flagged",
    "Not run",
    "",
    "",
    "",
    "Playwright: login.spec.ts"
   ],
   [
    "TC-LOGIN-008",
    "Wrong credentials are rejected with an error",
    "Verify login fails for an unknown account",
    "1. Open the login page\n2. Enter no.such.user.pwtest@mailinator.com and password WrongPassword#123\n3. Click Log in",
    "The user stays on the login page and an error message is shown",
    "Not run",
    "",
    "",
    "",
    "Playwright: login.spec.ts. One login attempt on the live system. The exact wording of the error is still to be confirmed"
   ],
   [
    "TC-LOGIN-009",
    "Valid login opens the Portal Gateway",
    "Verify a successful login leads to the portal selection",
    "1. Open the login page\n2. Enter the email and password of an existing account\n3. Click Log in",
    "The 'Portal Gateway' page opens with the text 'Select your destination portal to proceed to your account.'",
    "Not run",
    "",
    "",
    "",
    "Playwright: login.spec.ts. Uses TEST_LOGIN_EMAIL and TEST_LOGIN_PASSWORD from .env. Skipped when they are not set. Signs in once on the live system"
   ],
   [
    "TC-LOGIN-010",
    "Portal Gateway lists the three portals",
    "Verify the portal choices",
    "1. Log in with an existing account\n2. Look at the Portal Gateway",
    "Three choices are shown: Applicant Portal (Browse job openings, apply, and track status), Admin / Staff Portal (Manage system, job applications & recruitment) and HRMPSB Board Portal (Merit selection deliberations & candidate evaluations). The footer shows 'Zamboanga City Medical Center © 2026'",
    "Not run",
    "",
    "",
    "",
    "Playwright: login.spec.ts"
   ],
   [
    "TC-LOGIN-011",
    "Back to login returns to the login page",
    "Verify the Back to login link on the Portal Gateway",
    "1. Log in with an existing account\n2. Click 'Back to login'",
    "The login page (/login) opens",
    "Not run",
    "",
    "",
    "",
    "Playwright: login.spec.ts. To confirm whether the session is also ended"
   ],
   [
    "TC-LOGIN-012",
    "Applicant Portal opens the applicant side",
    "Verify the Applicant Portal choice",
    "1. Log in with an existing account\n2. Click 'Applicant Portal'",
    "The applicant side opens where the user can browse job openings and track applications",
    "Not run",
    "",
    "",
    "",
    "Playwright: login.spec.ts. The destination address is to be confirmed"
   ],
   [
    "TC-LOGIN-013",
    "Admin / Staff Portal opens for an account with staff access",
    "Verify the Admin / Staff Portal choice",
    "1. Log in with an account that has staff access\n2. Click 'Admin / Staff Portal'",
    "The admin and staff side opens (system and application management)",
    "Not run",
    "",
    "",
    "",
    "Playwright: login.spec.ts. The destination address is to be confirmed. Needs an account with the staff role"
   ],
   [
    "TC-LOGIN-014",
    "HRMPSB Board Portal opens for an account with board access",
    "Verify the HRMPSB Board Portal choice",
    "1. Log in with an account that has board access\n2. Click 'HRMPSB Board Portal'",
    "The board side opens (merit selection and candidate evaluation)",
    "Not run",
    "",
    "",
    "",
    "Playwright: login.spec.ts. The destination address is to be confirmed. Needs an account with the board role"
   ],
   [
    "TC-LOGIN-015",
    "An account without access to a portal cannot open it",
    "Verify portal access is restricted by role",
    "1. Log in with an applicant-only account\n2. Click 'Admin / Staff Portal'\n3. Go back and click 'HRMPSB Board Portal'",
    "Access is denied with a message or the user is sent back. The applicant-only account never reaches the admin or board pages",
    "Not run",
    "",
    "",
    "",
    "Playwright: login.spec.ts. Behavior to confirm. Needs an applicant-only account"
   ],
   [
    "TC-LOGIN-016",
    "A newly registered account can log in",
    "Verify login right after registration",
    "1. Register a new account (TC-REG-032)\n2. Verify the email address\n3. Open the login page and log in with the new account",
    "The Portal Gateway opens",
    "Not run",
    "",
    "",
    "",
    "Manual. Blocked: the /verify page is blank (TC-REG-032)"
   ]
  ]
 }
];

function fillTestCaseTabs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const today = new Date();
  const log = [];

  MODULES.forEach(function (m) {
    const sh = ss.getSheetByName(m.tab);
    if (!sh) { log.push(m.tab + ': NOT FILLED, the tab was not found (duplicate "Test Cases" and rename the copy)'); return; }
    if (String(sh.getRange(FIRST_DATA_ROW, 1).getValue()) !== '') { log.push(m.tab + ': skipped, row ' + FIRST_DATA_ROW + ' already has data'); return; }

    // Each step is wrapped so a failure says exactly which part of which tab it was.
    function step(name, fn) {
      try { fn(); } catch (e) { throw new Error(m.tab + ' / ' + name + ': ' + e.message); }
    }
    try {
      // Header block
      step('prerequisites', function () { sh.getRange('G1').setValue(m.prereq); });
      step('test suite', function () { sh.getRange('B3').setValue(TEST_SUITE); });
      step('module name', function () { sh.getRange('E3').setValue(m.tab); });
      step('created by', function () { sh.getRange('B4').setValue(CREATED_BY); });
      step('created at', function () { sh.getRange('B5').setValue(today); });
      step('last updated by', function () { sh.getRange('B6').setValue(CREATED_BY); });
      step('last updated at', function () { sh.getRange('B7').setValue(today); });
      step('executed at', function () { sh.getRange('D6').clearContent(); });  // sample date in the template
      step('executed by', function () { sh.getRange('E7').clearContent(); });  // placeholder in the template

      // Test cases. Columns: A ID, B Title, C Description, D Pre-conditions (left empty), E Steps, F Expected,
      // G Status, H Actual, I Bug Status, J Severity, AC Notes.
      // No merging and no data validation: the tab is a Google Sheets Table with typed columns.
      const n = m.cases.length;
      const last = FIRST_DATA_ROW + n - 1;
      if (sh.getMaxRows() < last) sh.insertRowsAfter(sh.getMaxRows(), last - sh.getMaxRows());
      step('ID, title, description', function () {
        sh.getRange(FIRST_DATA_ROW, 1, n, 3).setValues(m.cases.map(function (c) { return [c[0], c[1], c[2]]; }));
      });
      step('steps and expected results', function () {
        sh.getRange(FIRST_DATA_ROW, 5, n, 2).setValues(m.cases.map(function (c) { return [c[3], c[4]]; }));
      });
      step('actual results', function () {
        sh.getRange(FIRST_DATA_ROW, 8, n, 1).setValues(m.cases.map(function (c) { return [c[6]]; }));
      });
      step('notes', function () {
        sh.getRange(FIRST_DATA_ROW, 29, n, 1).setValues(m.cases.map(function (c) { return [c[9]]; }));
      });
      // Typed columns (dropdowns). Written last and one by one so a rejected value is easy to find.
      step('status', function () {
        sh.getRange(FIRST_DATA_ROW, 7, n, 1).setValues(m.cases.map(function (c) { return [c[5]]; }));
      });
      step('bug status', function () {
        sh.getRange(FIRST_DATA_ROW, 9, n, 1).setValues(m.cases.map(function (c) { return [c[7]]; }));
      });
      step('severity', function () {
        sh.getRange(FIRST_DATA_ROW, 10, n, 1).setValues(m.cases.map(function (c) { return [c[8]]; }));
      });
      step('wrap text', function () {
        sh.getRange(FIRST_DATA_ROW, 1, n, 29).setWrap(true).setVerticalAlignment('top');
      });
      log.push(m.tab + ': ' + n + ' test cases added');
    } catch (e) {
      log.push('NOT FINISHED: ' + e.message);
    }
  });

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert(log.join('\n'));
}
