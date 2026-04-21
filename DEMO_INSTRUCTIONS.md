# Payment System Demo Instructions

## 🎯 How to Test the Payment System

### 1. **Start the Application**
```bash
npm run dev
```
The application will be available at `http://localhost:3003`

### 2. **Test Customer Payment Flow**

#### Option A: Zelle Payment
1. Visit the main page at `http://localhost:3003`
2. Click on any "Register Now" button or the main registration button
3. In the payment modal, click "Pay with Cash (Zelle)"
4. Fill out the form:
   - **Name**: John Doe
   - **Phone**: (555) 123-4567
   - **Reference Number**: ZL123456789
   - **Screenshot**: Upload any image file (optional)
5. Click "Confirm Zelle Payment"
6. You'll see a success confirmation

#### Option B: Card Payment
1. Click "Pay by Card (Stripe)" in the payment modal
2. This will open the Stripe link in a new tab
3. The modal will close automatically

### 3. **Test Admin Dashboard**

#### Access Admin Panel
1. Navigate to `http://localhost:3003/admin`
2. Click on the "Payments" section in the sidebar

#### Review Payments
1. You'll see the payment statistics dashboard
2. View the submitted Zelle payment in the table
3. Click "View Details" to open the payment modal

#### Manage Payment Status
1. In the payment detail modal:
   - View customer information
   - See the uploaded screenshot (if any)
   - Add notes about the payment
   - Click "Verify Payment" to approve
   - Or click "Reject Payment" and provide a reason

#### Filter and Search
1. Use the status filter dropdown to view:
   - All Payments
   - Pending only
   - Verified only
   - Rejected only

### 4. **Test File Upload**

#### Upload Payment Screenshot
1. In the Zelle payment form, click "Upload Zelle Screenshot"
2. Select an image file (JPEG, PNG, or WebP)
3. Maximum file size: 5MB
4. Watch the upload progress indicator
5. See confirmation when upload completes

#### View Screenshots in Admin
1. Go to admin payments dashboard
2. Click "View Details" on a payment with a screenshot
3. The screenshot will be displayed in the modal
4. Click on the image to view it full-size

## 🔧 Technical Testing

### API Endpoints Testing

#### Create a Payment (POST)
```bash
curl -X POST http://localhost:3003/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "courseName": "Adults Book Club",
    "customerName": "Jane Smith",
    "phoneNumber": "(555) 987-6543",
    "referenceNumber": "ZL987654321",
    "amount": "$160"
  }'
```

#### Get All Payments (GET)
```bash
curl http://localhost:3003/api/payments
```

#### Get Pending Payments Only
```bash
curl http://localhost:3003/api/payments?status=pending
```

#### Update Payment Status (PATCH)
```bash
curl -X PATCH http://localhost:3003/api/payments/[payment_id] \
  -H "Content-Type: application/json" \
  -d '{
    "status": "verified",
    "notes": "Payment confirmed in bank records",
    "verifiedBy": "admin"
  }'
```

### File Upload Testing
```bash
curl -X POST http://localhost:3003/api/upload \
  -F "file=@/path/to/your/image.jpg"
```

## 🎨 UI Features to Test

### Payment Modal Features
- [ ] Responsive design on different screen sizes
- [ ] Clear price comparison (Cash vs Card with 4% fee)
- [ ] Form validation (required fields)
- [ ] File upload with progress indicator
- [ ] Success/error message display
- [ ] Modal close functionality

### Admin Dashboard Features
- [ ] Statistics cards update with new payments
- [ ] Payment table sorting and filtering
- [ ] Payment detail modal functionality
- [ ] Screenshot viewing capability
- [ ] Status update actions
- [ ] Notes functionality
- [ ] Responsive design on mobile

## 🔍 What to Look For

### Customer Experience
- **Intuitive payment selection** with clear pricing
- **Smooth form completion** with helpful validation
- **File upload feedback** with progress indicators
- **Clear confirmation messages** after submission

### Admin Experience
- **Comprehensive payment overview** with statistics
- **Efficient payment review process** with all details visible
- **Quick status updates** with audit trail
- **Mobile-friendly admin interface** for on-the-go management

### Technical Functionality
- **Secure file uploads** with proper validation
- **Database integration** with MongoDB
- **API error handling** with user-friendly messages
- **Real-time updates** without page refreshes

## 🚨 Error Scenarios to Test

### File Upload Errors
1. Try uploading a file larger than 5MB
2. Try uploading a non-image file (PDF, DOC, etc.)
3. Test upload with no internet connection

### Form Validation
1. Submit Zelle form with empty required fields
2. Test with invalid phone number formats
3. Test with very long reference numbers

### Admin Actions
1. Try to verify an already verified payment
2. Test rejection without providing a reason
3. Test with very long notes

## 📊 Expected Results

### Successful Payment Submission
- Payment appears in admin dashboard immediately
- Status shows as "Pending"
- All customer details are captured correctly
- Screenshot (if uploaded) is accessible in admin view

### Successful Admin Management
- Status updates reflect immediately in the dashboard
- Timestamps are recorded for all actions
- Notes are saved and displayed correctly
- Statistics update in real-time

### File Upload Success
- Files are stored in `/public/uploads/payments/`
- Unique filenames prevent conflicts
- Images are viewable in admin dashboard
- File validation prevents invalid uploads

This demo covers all major features of the payment system and provides a comprehensive testing framework for both customer-facing and administrative functionality.