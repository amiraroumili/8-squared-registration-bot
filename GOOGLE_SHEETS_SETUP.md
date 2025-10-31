# Google Sheets Integration Setup

To have all users save their registration data to a single shared Google Sheet, follow these steps:

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "8-Squared Registrations"
3. In the first row, add these headers:
   - `Timestamp`
   - `first_name`
   - `last_name`
   - `email`
   - `experience`
   - `age_group`
   - `availability`
   - `interests`

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code and paste this:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Create row with data
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
    
    // Append the row to the sheet
    sheet.appendRow(row);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify setup
function doGet(e) {
  return ContentService.createTextOutput('Google Apps Script is working!');
}
```

3. Click **Save** (💾 icon)
4. Name your project "8-Squared Registration Handler"

## Step 3: Deploy the Script

1. Click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: "8-Squared Registration API"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone" (important!)
5. Click **Deploy**
6. **Copy the Web app URL** (it looks like: `https://script.google.com/macros/s/...../exec`)
7. Click **Done**

## Step 4: Update Your App

1. Open `src/App.jsx`
2. Find this line:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace it with your copied URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_URL/exec';
   ```

## Step 5: Test

1. Save the file
2. Restart your dev server if needed
3. Register a test user
4. Check your Google Sheet - the data should appear!

## Important Notes

- Every user's registration will now be saved to the same Google Sheet
- You can access this sheet from anywhere to see all registrations
- The sheet updates in real-time
- You can download it as Excel anytime from Google Sheets: **File** → **Download** → **Microsoft Excel**
- Keep your Google Apps Script URL private if you don't want unauthorized submissions

## Troubleshooting

If data isn't appearing in your sheet:

1. Make sure you deployed the script as "Anyone" can access
2. Check the browser console for errors
3. Verify the column headers in your sheet match the field names
4. Re-deploy the Apps Script if you made changes

## Alternative: Email Notifications

If you want to receive registrations via email instead, modify the Apps Script:

```javascript
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Save to sheet (same as above)
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
  sheet.appendRow(row);
  
  // Send email notification
  MailApp.sendEmail({
    to: 'your-email@example.com',
    subject: '🎉 New 8-Squared Registration',
    body: `New registration received!\n\nName: ${data.first_name} ${data.last_name}\nEmail: ${data.email}\nExperience: ${data.experience}\n\nCheck the full details in your Google Sheet.`
  });
  
  return ContentService.createTextOutput(JSON.stringify({'result': 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Replace `your-email@example.com` with your actual email address.
