# Validation & Image Upload Features

## ✅ What's Been Added

### 1. Backend Validation (express-validator)

All API endpoints now have comprehensive validation:

#### Auth Routes (`/api/auth`)
- **Register**: Name (2-50 chars), valid email, password (min 6 chars)
- **Login**: Valid email format, password required
- **Update Profile**: Optional fields with proper validation

#### Product Routes (`/api/products`)
- **Add Review**: Rating (1-5), comment (10-500 chars)

#### Order Routes (`/api/orders`)
- **Place Order**: 
  - Items array validation
  - Shipping address (all fields required, proper lengths)
  - Phone number format validation
  - Payment method validation (COD/UPI/Card)

#### Admin Routes (`/api/admin`)
- **Product CRUD**:
  - Name: 3-200 characters
  - Description: 10-2000 characters
  - Price: Must be positive number
  - Original price: Must be >= price
  - Category: 2-50 characters
  - Stock: Non-negative integer
  - Tags: String or array
  - Featured: Boolean

### 2. Image Upload System

#### Backend Features:
- **Multer Configuration**:
  - Accepts: JPEG, JPG, PNG, GIF, WebP
  - Max file size: 5MB per image
  - Max images: 5 per product
  - Auto-creates uploads directory
  - Unique filenames with timestamp

- **File Validation**:
  - Type checking (images only)
  - Size validation
  - Error handling with cleanup

- **Image Management**:
  - Automatic deletion of old images when product is deleted
  - Cleanup on failed uploads
  - Multiple image support

#### Frontend Features:
- **Drag & Drop UI**:
  - Click to upload interface
  - Multiple file selection
  - Image previews before upload
  - Remove individual images
  - Visual feedback

- **Client-side Validation**:
  - File type checking
  - Size validation (5MB limit)
  - Max 5 images warning
  - Real-time error messages

### 3. Form Validation (Frontend)

All forms now have client-side validation:

#### Product Form:
- Name: Min 3 characters
- Description: Min 10 characters
- Price: Must be > 0
- Original price: Must be >= price
- Category: Required, min 2 chars
- Stock: Must be >= 0
- Images: At least 1 required for new products

#### Visual Feedback:
- Red border on invalid fields
- Error messages below fields
- Prevents submission until valid
- Clears errors on input change

## 📦 Installation

```bash
cd backend
npm install
```

This will install the new dependency: `express-validator`

## 🚀 Usage

### Adding a Product with Images:

1. Go to Admin Panel → Products
2. Click "Add Product"
3. Fill in all required fields (marked with *)
4. Click the upload area to select images
5. Preview images before saving
6. Remove unwanted images with X button
7. Click "Save Product"

### Validation Errors:

If validation fails, you'll see:
- **Backend**: JSON response with error details
- **Frontend**: Red borders and error messages under fields

### Example Error Response:

```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "Name must be between 3-200 characters" },
    { "field": "price", "message": "Price must be a positive number" }
  ]
}
```

## 📁 File Structure

```
backend/
├── middleware/
│   └── validation.js          # All validation rules
├── routes/
│   ├── auth.js               # With validation
│   ├── products.js           # With validation
│   ├── orders.js             # With validation
│   └── admin.js              # With image upload
└── uploads/                  # Product images stored here

frontend/
└── src/
    └── admin/
        ├── AdminProducts.jsx  # Image upload UI
        └── Admin.css         # Upload styles
```

## 🔒 Security Features

1. **File Type Validation**: Only images allowed
2. **Size Limits**: 5MB per file
3. **Quantity Limits**: Max 5 images
4. **Input Sanitization**: Trim and normalize inputs
5. **Error Handling**: Cleanup on failures
6. **Admin Only**: Protected routes

## 🎨 UI Features

- Drag & drop upload area
- Image previews with thumbnails
- Remove button on each preview
- Visual validation feedback
- Loading states
- Toast notifications
- Responsive design

## 🧪 Testing

### Test Image Upload:
1. Login as admin
2. Add product with images
3. Verify images appear in product list
4. Check `/uploads` folder for files
5. Edit product and change images
6. Delete product and verify cleanup

### Test Validation:
1. Try submitting empty forms
2. Enter invalid data (negative prices, etc.)
3. Upload non-image files
4. Upload files > 5MB
5. Try uploading > 5 images

## 📝 Notes

- Images are stored in `backend/uploads/` directory
- Filenames are auto-generated with timestamps
- Old images are deleted when product is removed
- Frontend shows existing images when editing
- Supports both file upload and URL input
