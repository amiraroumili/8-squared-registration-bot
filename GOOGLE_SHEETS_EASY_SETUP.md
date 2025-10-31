# Google Sheets Setup (Easiest Solution - No Environment Issues!)

## Why Google Sheets?
- No environment configuration needed
- Works immediately
- Free and reliable
- Can still export to Excel anytime

## Setup Steps (15 minutes)

### PART 1: Create Google Sheet (5 minutes)

1. **Go to Google Sheets**: https://sheets.google.com
2. Click **+ Blank** to create a new sheet
3. Name it: `8-Squared Registrations`
4. **Add these headers in Row 1** (A1 to H1):
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
5. Keep this tab open

### PART 2: Create Google Apps Script (5 minutes)

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete everything in the editor
3. **Copy and paste this code**:

```javascript
function doPost(e) {
  try {
    // Get the spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    
    // If you renamed your sheet, change 'Sheet1' above to your sheet name
    
    // Parse the data
    var data = JSON.parse(e.postData.contents);
    
    // Create the row
    var row = [
      data.Timestamp || new Date().toISOString(),
      data.first_name || '',
      data.last_name || '',
      data.email || '',
      data.experience || '',
      data.age_group || '',
      Array.isArray(data.availability) ? data.availability.join(', ') : data.availability || '',
      data.interests || ''
    ];
    
    // Add the row to the sheet
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Registration saved!'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Script is working!');
}
```

4. Click **Save** (disk icon 💾)
5. Name the project: `8-Squared Registration Handler`

### PART 3: Deploy the Script (3 minutes)

1. Click **Deploy** → **New deployment**
2. Click the ⚙️ gear icon next to "Select type"
3. Choose **Web app**
4. Fill in:
   - **Description**: Registration API
   - **Execute as**: Me
   - **Who has access**: Anyone ⚠️ (Important! Must be "Anyone")
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to 8-Squared Registration Handler (unsafe)**
9. Click **Allow**
10. **COPY THE WEB APP URL** (looks like: `https://script.google.com/macros/s/...../exec`)
11. Click **Done**

### PART 4: Update Your Code (2 minutes)

1. Open `src/App.jsx` in VS Code
2. Find line 46 (around there):
```javascript
const POWER_AUTOMATE_URL = 'YOUR_POWER_AUTOMATE_URL_HERE';
```

3. Replace it with:
```javascript
const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_COPIED_URL_HERE';
```

4. Also change line 48 from:
```javascript
if (POWER_AUTOMATE_URL !== 'YOUR_POWER_AUTOMATE_URL_HERE') {
```
to:
```javascript
if (GOOGLE_SCRIPT_URL !== 'PASTE_YOUR_COPIED_URL_HERE') {
```

5. And change line 49 from:
```javascript
const response = await fetch(POWER_AUTOMATE_URL, {
```
to:
```javascript
const response = await fetch(GOOGLE_SCRIPT_URL, {
```

6. Save the file

### PART 5: Test! (2 minutes)

1. Make sure your dev server is running (`npm run dev`)
2. Register a test user on your website
3. Check your Google Sheet - the data should appear!

## Export to Excel Anytime

To get your data as Excel:
1. Open your Google Sheet
2. Click **File** → **Download** → **Microsoft Excel (.xlsx)**
3. Done!

## Or Copy to Your SharePoint

You can also:
1. Download from Google Sheets as Excel
2. Upload to your SharePoint
3. All your data is there!

## Benefits
✅ No environment configuration issues
✅ Works immediately
✅ All users save to same sheet
✅ Can export to Excel anytime
✅ Can access from anywhere
✅ Free forever

## Troubleshooting

**Data not appearing?**
- Make sure deployment is set to "Anyone" can access
- Check sheet name matches in the code (default is 'Sheet1')
- Look at browser console for errors (F12)

**Authorization error?**
- You must click "Advanced" and "Allow" during deployment
- This is normal - Google warns you about your own script

**Still having issues?**
- Share your Google Sheet URL with me
- Tell me what error you see
- I'll help you debug!
