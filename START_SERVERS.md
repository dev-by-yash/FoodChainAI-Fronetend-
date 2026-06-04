# 🚀 How to Start the Servers

## Problem: Black Screen After Upload
This happens when the backend server is not running.

## Solution: Start Both Servers

### Step 1: Start Backend Server

Open a **NEW terminal** and run:

```bash
cd "foodchain-ai-advanced (1)/foodchain-ai-advanced/server"
node server.js
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### Step 2: Start Frontend Server

Open **ANOTHER terminal** and run:

```bash
cd "foodchain-ai-advanced (1)/foodchain-ai-advanced/client"
npm run dev
```

You should see:
```
VITE v8.0.4  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### Step 3: Test the Application

1. Go to http://localhost:5173/scan
2. You should see "Server connected" green banner
3. Upload a bill image
4. Click "Scan Bill"
5. Wait for OCR processing (may take 10-30 seconds)
6. View extracted items
7. Click "Save to Database"

## Troubleshooting

### Backend Not Starting

**Error: Cannot find module**
```bash
cd server
npm install
node server.js
```

**Error: MongoDB connection failed**
- Check your `.env` file has correct `MONGO_URI`
- Make sure MongoDB Atlas is accessible

### Frontend Not Starting

**Error: Cannot find module**
```bash
cd client
npm install
npm run dev
```

### OCR Taking Too Long

- Use smaller images (< 2MB)
- Use clearer images with good contrast
- Ensure text is horizontal and readable

### No Items Extracted

- Check "View Raw OCR Text" to see what was detected
- Make sure bill has format like: "Rice 50kg" or "Oil 10L"
- Try simpler text format

## Quick Test

### Test Backend is Running:
Open browser and go to:
```
http://localhost:5000/api/food
```

You should see JSON data (not an error).

### Test Frontend is Running:
Open browser and go to:
```
http://localhost:5173
```

You should see the dashboard.

## Windows PowerShell Commands

### Check if Node is running:
```powershell
Get-Process -Name node
```

### Kill all Node processes (if needed):
```powershell
Stop-Process -Name node -Force
```

### Start backend in background:
```powershell
cd server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js"
```

## Expected Behavior

✅ Backend terminal shows: "Server running on port 5000"
✅ Frontend terminal shows: "Local: http://localhost:5173/"
✅ Scan page shows: "Server connected" green banner
✅ Upload works without black screen
✅ OCR processes and shows results

## Still Having Issues?

1. **Check browser console** (F12) for errors
2. **Check backend terminal** for error messages
3. **Verify ports** 5000 and 5173 are not in use
4. **Restart both servers**
5. **Clear browser cache** and reload

## Success Indicators

When everything is working:
- ✅ Two terminals running (backend + frontend)
- ✅ Green "Server connected" banner on scan page
- ✅ No errors in browser console
- ✅ OCR completes and shows extracted items
- ✅ Save button works and shows success message
