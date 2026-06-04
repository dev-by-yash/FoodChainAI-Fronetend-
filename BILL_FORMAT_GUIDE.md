# 📄 Bill Format Guide for OCR

## Recommended Bill Format

Your bill should contain these fields for best OCR extraction:

### **Required Fields** (Must Have)
1. **Type of Food** - The food item name
2. **Quantity of Food** - Amount purchased (number)

### **Optional Fields** (Recommended)
3. **Event Type** - Type of event (Corporate, Wedding, Party, etc.)
4. **Location** - Geographical location
5. **Wastage Food Amount** - Amount wasted (number)
6. **Price** - Price information
7. **Bill No** - Bill number for reference
8. **Date** - Purchase date

---

## 📋 Perfect Bill Format Example

```
------------------------------------
    FOOD PLAZA RESTAURANT
------------------------------------

Bill No: 1024
Date: 12-04-2026

Event Type: Corporate
Location: India

------------------------------------

Type of Food : Rice Plate
Quantity of Food : 200

------------------------------------

Total Quantity: 200
Wastage Food Amount: 41

Price: high

------------------------------------
Thank You!
------------------------------------
```

---

## What the System Extracts

| Bill Field | Extracted To | Database Column |
|------------|--------------|-----------------|
| **Event Type: Corporate** | Event Type | "Event Type" |
| **Location: India** | Location | "Geographical Location" |
| **Type of Food : Rice Plate** | Food Name | "Purchase History" |
| **Quantity of Food : 200** | Quantity | "Quantity of Food" |
| **Wastage Food Amount: 41** | Wastage | "Wastage Food Amount" |
| **Price: high** | Price | "Pricing" |
| **Bill No: 1024** | Bill Info | "Storage Conditions" |
| **Date: 12-04-2026** | Date | "Seasonality" |

---

## ✍️ Format Rules

### **1. Use Clear Labels**
✅ Good:
```
Type of Food : Rice Plate
Quantity of Food : 200
Event Type: Corporate
```

❌ Bad:
```
Food: Rice Plate (unclear label)
Qty: 200 (abbreviated)
```

### **2. Use Colons or Dashes**
✅ Good:
```
Type of Food : Rice Plate
Type of Food - Rice Plate
Type of Food: Rice Plate
```

### **3. Keep Numbers Clear**
✅ Good:
```
Quantity of Food : 200
Wastage Food Amount: 41
```

❌ Bad:
```
Quantity: Two Hundred (use numbers, not words)
```

### **4. One Item Per Line**
✅ Good:
```
Type of Food : Rice Plate
Quantity of Food : 200
```

❌ Bad:
```
Type of Food : Rice Plate, Quantity: 200 (mixed on one line)
```

---

## 📝 Minimal Bill Format (Simplest)

If you want the simplest format, just include:

```
Type of Food : Rice Plate
Quantity of Food : 200
```

The system will fill other fields with "N/A".

---

## 🍽️ Multiple Food Items Format

For bills with multiple items:

```
------------------------------------
    RESTAURANT BILL
------------------------------------

Bill No: 2045
Date: 15-04-2026
Event Type: Wedding
Location: Mumbai

------------------------------------

Type of Food : Rice Plate
Quantity of Food : 200

Type of Food : Chicken Curry
Quantity of Food : 150

Type of Food : Naan Bread
Quantity of Food : 300

------------------------------------

Total Quantity: 650
Wastage Food Amount: 85

Price: medium
------------------------------------
```

**Note**: Currently, the system saves one record per bill. For multiple items, upload separate bills or we can enhance it to handle multiple items.

---

## 🖼️ Image Quality Tips

### **For Best OCR Results:**

1. **Resolution**: Use at least 300 DPI
2. **Format**: PNG or JPG
3. **Size**: Under 5MB
4. **Lighting**: Good contrast, no shadows
5. **Orientation**: Horizontal, not tilted
6. **Text**: Clear, printed (not handwritten)
7. **Background**: White or light colored

### **Good Image Example:**
- Clear text
- High contrast
- No blur
- Straight alignment

### **Bad Image Example:**
- Blurry text
- Low contrast
- Tilted/rotated
- Handwritten

---

## 🔤 Supported Text Formats

### **Event Types:**
- Corporate
- Wedding
- Party
- Birthday
- Conference
- Restaurant
- Catering

### **Locations:**
- City names (Mumbai, Delhi, India, etc.)
- Any text after "Location:"

### **Food Names:**
- Single word: Rice, Chicken, Fish
- Multi-word: Rice Plate, Chicken Curry, Naan Bread

### **Quantities:**
- Numbers only: 200, 150, 50
- With units: 200kg, 150L (system extracts the number)

### **Prices:**
- Text: high, medium, low
- Numbers: 500, 1000, 2500
- Currency: ₹500, $100

---

## Field Mapping Reference

| Your Bill Label | System Searches For | Example |
|----------------|---------------------|---------|
| Event Type | "Event Type:" | Corporate |
| Location | "Location:" | India |
| Type of Food | "Type of Food:" | Rice Plate |
| Quantity of Food | "Quantity of Food:" | 200 |
| Total Quantity | "Total Quantity:" | 200 |
| Wastage Food Amount | "Wastage Food Amount:" | 41 |
| Price | "Price:" | high |
| Bill No | "Bill No:" | 1024 |
| Date | "Date:" | 12-04-2026 |

---

## 🧪 Test Your Bill Format

### **Step 1: Create Test Bill**
Use the perfect format example above

### **Step 2: Convert to Image**
- Type in Word/Notepad
- Take screenshot
- Or use online text-to-image converter

### **Step 3: Upload & Test**
1. Go to http://localhost:5173/scan
2. Upload your test bill
3. Click "Scan Bill"
4. Check extracted data
5. Click "Save to Database"
6. Verify on dashboard

---

## Create Bill Template

### **Using Microsoft Word:**

1. Open Word
2. Use Courier New or Consolas font (monospace)
3. Font size: 14-16pt
4. Copy the perfect format
5. Save as PDF or take screenshot

### **Using Online Tools:**

1. Go to: https://www.text2image.com
2. Paste the bill format
3. Choose monospace font
4. Download as PNG

### **Using Paint/Photoshop:**

1. Create 800x1000px white canvas
2. Add text in black
3. Use clear, readable font
4. Save as PNG

---

## ❓ FAQ

### **Q: Can I use handwritten bills?**
A: OCR works best with printed text. Handwritten text has lower accuracy.

### **Q: What if my bill has different labels?**
A: The system looks for keywords. Use labels like "Type of Food", "Quantity", "Event Type", etc.

### **Q: Can I upload photos of physical bills?**
A: Yes! Just ensure good lighting, focus, and no shadows.

### **Q: What if OCR extracts wrong data?**
A: Check "View Raw OCR Text" to see what was read. Improve image quality or adjust bill format.

### **Q: Can I edit extracted data before saving?**
A: Currently no, but this can be added. For now, ensure bill format is correct before uploading.

---

## Quick Start Template

Copy this template and fill in your data:

```
------------------------------------
    [YOUR RESTAURANT NAME]
------------------------------------

Bill No: [NUMBER]
Date: [DD-MM-YYYY]

Event Type: [Corporate/Wedding/Party]
Location: [City/Country]

------------------------------------

Type of Food : [FOOD NAME]
Quantity of Food : [NUMBER]

------------------------------------

Total Quantity: [NUMBER]
Wastage Food Amount: [NUMBER]

Price: [high/medium/low or amount]

------------------------------------
Thank You!
------------------------------------
```

---

## Checklist Before Upload

- [ ] Bill has "Type of Food" label
- [ ] Bill has "Quantity of Food" label
- [ ] Numbers are clear and readable
- [ ] Image is not blurry
- [ ] Image is properly oriented
- [ ] Text has good contrast
- [ ] File size is under 5MB
- [ ] Format is PNG or JPG

---

## 📞 Need Help?

If OCR is not extracting correctly:

1. Check "View Raw OCR Text" to see what was read
2. Compare with your bill format
3. Adjust bill format to match examples
4. Ensure image quality is good
5. Try the perfect format example first

---

**Happy Scanning! 📸**
