# OCR Testing Guide

## What I've Added

### Backend (Node.js + Express)
1. **Enhanced OCR Route** (`/api/ocr/scan`)
   - Accepts image upload via multer
   - Uses Tesseract.js for OCR
   - Extracts items using regex
   - Returns raw text + extracted items

2. **Save Route** (`/api/ocr/save`)
   - Saves extracted items to MongoDB
   - Uses Material model

3. **Material Model** (`models/Material.js`)
   - Simple schema: name, quantity, source, date
   - Cleaner than Food model for OCR data

4. **Material Routes** (`/api/materials`)
   - GET: Fetch all materials
   - POST: Add material manually
   - DELETE: Remove material

### Frontend (React)
1. **OCRUpload Component**
   - File upload with preview
   - Scan button triggers OCR
   - Displays extracted items
   - Save button stores to database
   - Shows success message

2. **Updated ScanBill Page**
   - Now uses OCRUpload component

## 🧪 How to Test

### Step 1: Start Backend
```bash
cd server
npm start
```

### Step 2: Start Frontend
```bash
cd client
npm run dev
```

### Step 3: Test OCR

#### Option A: Create Test Image
Create a simple image with text like:
```
Rice 50kg
Oil 10L
Sugar 25
Flour 30kg
```

#### Option B: Use Existing Bill
Use any bill image you have

### Step 4: Upload & Scan
1. Go to http://localhost:5173/scan
2. Click "Click to upload bill image"
3. Select your test image
4. Click "🔍 Scan Bill"
5. Wait for OCR processing
6. View extracted items
7. Click "💾 Save to Database"

### Step 5: Verify Data
Check MongoDB or call:
```bash
GET http://localhost:5000/api/materials
```

## 📋 API Endpoints

### OCR Endpoints
```
POST /api/ocr/scan
- Body: FormData with 'bill' file
- Returns: { success, rawText, extractedItems, count }

POST /api/ocr/save
- Body: { items: [{ name, quantity }] }
- Returns: { success, message, savedItems }
```

### Material Endpoints
```
GET /api/materials
- Returns: Array of all materials

POST /api/materials
- Body: { name, quantity, source }
- Returns: { success, message, material }

DELETE /api/materials/:id
- Returns: { success, message }
```

## 🔍 Extraction Logic

The regex pattern extracts:
- **Pattern**: `([A-Za-z]+)\s*(\d+)\s*(kg|l|L|units?|pcs?)?`
- **Examples**:
  - "Rice 50kg" → { name: "Rice", quantity: 50 }
  - "Oil 10L" → { name: "Oil", quantity: 10 }
  - "Sugar 25" → { name: "Sugar", quantity: 25 }

## 🐛 Troubleshooting

### OCR Not Working
- Check if Tesseract.js is installed: `npm list tesseract.js`
- Check server logs for errors
- Ensure image is clear and readable

### Items Not Extracted
- Check raw OCR text in details section
- Verify text format matches pattern
- Try simpler text format

### Save Fails
- Check MongoDB connection
- Verify Material model exists
- Check server logs

## 📝 Sample Test Data

Create a text file and convert to image, or use image editor:

```
GROCERY BILL
--------------
Rice 50kg
Oil 10L
Sugar 25kg
Flour 30kg
Salt 5kg
```

## 🎯 Expected Flow

1. User uploads bill image
2. OCR extracts text
3. Regex finds items (name + quantity)
4. Display extracted items
5. User clicks save
6. Items stored in MongoDB
7. Success message shown

## Success Indicators

- File uploads successfully
- OCR processing completes
- Items extracted and displayed
- Save returns success message
- Data appears in MongoDB

## Next Steps

After testing works:
1. Improve regex patterns for more formats
2. Add manual editing of extracted items
3. Add validation before saving
4. Connect to Materials page to display saved items
5. Add usage tracking for waste calculation
