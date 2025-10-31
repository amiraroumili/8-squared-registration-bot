# Quick Setup Guide - SharePoint Excel Integration

## What You Need to Do (Simple Steps)

### PART 1: Prepare Your Excel File (5 minutes)

1. **Open your Excel file** in OneDrive/SharePoint:
   - Go to: https://ensiadz-my.sharepoint.com/:x:/g/personal/amira_roumili_ensia_edu_dz/ESHqNC32DnxClqUOk38Di0wB-102JB0zsEypFovtOfC4XQ?e=nSfr2h

2. **Add these headers in the first row** (A1 to H1):
   ```
   A1: Timestamp
   B1: First Name  
   C1: Last Name
   D1: Email
   E1: Experience
   F1: Age Group
   G1: Availability
   H1: Interests
   ```

3. **Make it a Table**:
   - Select cells A1 to H1 (all the headers)
   - Press `Ctrl + T` (or go to Insert → Table)
   - Check the box "My table has headers"
   - Click OK
   - Name the table: `RegistrationsTable`
   - Save the file

### PART 2: Create Power Automate Flow (10 minutes)

#### Step 1: Start the Flow
1. You're already in Power Automate - good!
2. Click on **"Automated cloud flow"** (the first blue box)

#### Step 2: Set Up the Trigger
1. In the popup:
   - Name: `8-Squared Registration`
   - Search for: `When a HTTP request is received`
   - Select it
   - Click **Create**

2. You'll see a box called "When a HTTP request is received"
3. Click on **"Use sample payload to generate schema"**
4. Copy and paste this:
```json
{
  "Timestamp": "2025-10-31T12:00:00.000Z",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "experience": "Intermediate",
  "age_group": "18-25",
  "availability": "Monday, Wednesday",
  "interests": "Learning chess"
}
```
5. Click **Done**

#### Step 3: Add Excel Action
1. Click **+ New step** (blue button below)
2. Search for: `Add a row into a table`
3. Select **Excel Online (Business)**
4. You might need to sign in - use your ENSIA account

5. Fill in the fields:
   - **Location**: OneDrive for Business
   - **Document Library**: OneDrive
   - **File**: Click the folder icon 📁 and find your Excel file
   - **Table**: Select `RegistrationsTable`

6. Map the data (click in each field and select from "Dynamic content"):
   - **Timestamp** → Select "Timestamp"
   - **First Name** → Select "first_name"
   - **Last Name** → Select "last_name"  
   - **Email** → Select "email"
   - **Experience** → Select "experience"
   - **Age Group** → Select "age_group"
   - **Availability** → Select "availability"
   - **Interests** → Select "interests"

#### Step 4: Add Response
1. Click **+ New step**
2. Search for: `Response`
3. Fill in:
   - **Status Code**: 200
   - **Body**: `{"result":"success"}`

4. Click **Save** (top right corner)

#### Step 5: Get Your URL
1. Click back on the first box "When a HTTP request is received"
2. You'll see **HTTP POST URL** - it appears after saving
3. Copy this entire URL (looks like: https://prod-xx.eastus.logic.azure.com/...)

### PART 3: Update Your Website Code (2 minutes)

1. Open `src/App.jsx` in VS Code
2. Find this line (around line 46):
```javascript
const POWER_AUTOMATE_URL = 'YOUR_POWER_AUTOMATE_URL_HERE';
```

3. Replace it with your copied URL:
```javascript
const POWER_AUTOMATE_URL = 'https://prod-xx.eastus.logic.azure.com/workflows/YOUR_ACTUAL_URL';
```

4. Save the file

### PART 4: Test It!

1. Go back to Power Automate
2. Make sure your flow is **ON** (toggle switch at the top)
3. Run your website (npm run dev)
4. Register a test user
5. Check your Excel file - you should see the new row!

## Troubleshooting

**Problem: Can't find my Excel file in Power Automate**
- Make sure the file is in OneDrive (not local computer)
- Try refreshing the file list
- The file must be an .xlsx file (not .xls)

**Problem: Data not appearing in Excel**
- Check if the table name is exactly `RegistrationsTable`
- Make sure the flow is turned ON
- Look at the flow run history (click on your flow → see all runs)
- Check if all columns match the headers

**Problem: URL not appearing**
- Save the flow first (top right)
- Go back to the HTTP trigger box
- Wait a few seconds and it should appear

## Need Help?

If you get stuck at any step, let me know which step number you're on and I'll help you!
