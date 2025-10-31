# SharePoint Excel Integration Setup

## Using Microsoft Power Automate (Recommended)

### Step 1: Prepare Your Excel File

1. Open your Excel file in SharePoint/OneDrive:
   https://ensiadz-my.sharepoint.com/:x:/g/personal/amira_roumili_ensia_edu_dz/ESHqNC32DnxClqUOk38Di0wB-102JB0zsEypFovtOfC4XQ?e=nSfr2h

2. Add headers in Row 1 (A1 to H1):
   - **A1**: Timestamp
   - **B1**: First Name
   - **C1**: Last Name
   - **D1**: Email
   - **E1**: Experience
   - **F1**: Age Group
   - **G1**: Availability
   - **H1**: Interests

3. Select the entire first row with headers (A1:H1)

4. Go to **Insert** → **Table** (or press Ctrl+T)

5. Make sure "My table has headers" is checked

6. Click **OK**

7. Name your table (click on the table, go to **Table Design** → **Table Name**): `RegistrationsTable`

8. **Save** the file

### Step 2: Create Power Automate Flow

1. Go to [Power Automate](https://make.powerautomate.com)

2. Click **+ Create** → **Automated cloud flow**

3. Name it: "8-Squared Registration Handler"

4. Search for trigger: **When a HTTP request is received**

5. Click **Create**

### Step 3: Configure the HTTP Trigger

1. In the trigger, click **Generate from sample**

2. Paste this JSON sample:
```json
{
  "Timestamp": "2025-10-31T12:00:00.000Z",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "experience": "Intermediate",
  "age_group": "18-25",
  "availability": "Monday, Wednesday, Friday",
  "interests": "Learning new strategies"
}
```

3. Click **Done**

### Step 4: Add Excel Action

1. Click **+ New step**

2. Search for: **Add a row into a table**

3. Select **Excel Online (Business)**

4. Sign in if prompted

5. Configure the action:
   - **Location**: OneDrive for Business
   - **Document Library**: OneDrive
   - **File**: Click folder icon and navigate to your Excel file
   - **Table**: Select `RegistrationsTable`

6. Map the fields:
   - **Timestamp**: Click "Add dynamic content" → Select `Timestamp`
   - **First Name**: Select `first_name`
   - **Last Name**: Select `last_name`
   - **Email**: Select `email`
   - **Experience**: Select `experience`
   - **Age Group**: Select `age_group`
   - **Availability**: Select `availability`
   - **Interests**: Select `interests`

### Step 5: Add Response Action

1. Click **+ New step**

2. Search for: **Response**

3. Configure:
   - **Status Code**: 200
   - **Body**: 
   ```json
   {
     "result": "success",
     "message": "Registration saved successfully"
   }
   ```

4. Click **Save** (top right)

### Step 6: Get Your URL

1. Go back to the **When a HTTP request is received** trigger

2. Click to expand it

3. Copy the **HTTP POST URL** (it will appear after saving)
   - It looks like: `https://prod-xx.eastus.logic.azure.com:443/workflows/...`

### Step 7: Update Your React App

1. Open `src/App.jsx`

2. Find this line:
```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

3. Replace it with:
```javascript
const POWER_AUTOMATE_URL = 'YOUR_POWER_AUTOMATE_URL_HERE';
```

4. Update the fetch call in saveToFile function - find:
```javascript
if (GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
  const response = await fetch(GOOGLE_SCRIPT_URL, {
```

5. Replace with:
```javascript
if (POWER_AUTOMATE_URL !== 'YOUR_POWER_AUTOMATE_URL_HERE') {
  const response = await fetch(POWER_AUTOMATE_URL, {
```

### Step 8: Test

1. Save your changes
2. Restart your dev server
3. Register a test user
4. Check your SharePoint Excel file - the data should appear in a new row!

## Troubleshooting

### Data not appearing:
- Make sure your Excel file is saved and has a Table (not just headers)
- Verify the table name matches exactly: `RegistrationsTable`
- Check that Power Automate flow is turned **ON**
- Look at the flow's run history for errors

### CORS errors:
- Use `mode: 'no-cors'` in the fetch call (already configured)
- Power Automate handles CORS automatically

### Excel file locked:
- Close the Excel file if you have it open while testing
- SharePoint can handle multiple users, but not if the file is locked for editing

## Benefits of This Approach

✅ All registrations save to your SharePoint Excel file  
✅ Multiple users can register simultaneously  
✅ You can access the data from anywhere  
✅ Automatic version history and backup  
✅ Can share the file with your team  
✅ Free with Microsoft 365 account  
✅ No coding required in Power Automate

## Optional: Email Notifications

To get email notifications for each registration:

1. In Power Automate, click **+ New step** after the Excel action
2. Search for: **Send an email (V2)**
3. Configure:
   - **To**: your-email@example.com
   - **Subject**: `New Registration: ` (add dynamic content: first_name + last_name)
   - **Body**: 
   ```
   New registration received!
   
   Name: [first_name] [last_name]
   Email: [email]
   Experience: [experience]
   Age Group: [age_group]
   Availability: [availability]
   Interests: [interests]
   ```
4. Save the flow

Now you'll get an email every time someone registers!
