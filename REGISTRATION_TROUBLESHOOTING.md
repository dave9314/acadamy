# Registration Troubleshooting Guide

## ✅ System Status
- ✅ Registration API is properly configured
- ✅ Database connection is working
- ✅ 5 departments are available for selection
- ✅ File upload system is ready
- ✅ Payment system is integrated

## 🔧 If Registration Still Fails

### Step 1: Check Browser Console
1. Open your browser (Chrome/Firefox/Edge)
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Try registering again
5. Look for any red error messages

### Step 2: Check Network Requests
1. In Developer Tools, go to **Network** tab
2. Try registering again
3. Look for the `/api/auth/register` request
4. Click on it to see the response
5. Check if it shows a specific error message

### Step 3: Verify Required Fields
Make sure you fill in ALL required fields:

**Step 1 - Basic Information:**
- ✅ Full Name (required)
- ✅ Email Address (required)
- ✅ Password (required)
- ✅ Phone Number (required)
- ✅ Either Telegram username OR WhatsApp number (required)
- ✅ Department selection (required)

**Step 2 - Payment:**
- ✅ Payment method selection (CBE or Telebirr)
- ✅ Payment screenshot upload (required)

### Step 4: Check Server Logs
1. Look at your terminal where `npm run dev` is running
2. Try registering again
3. Check for any error messages in the server console

## 🎯 Common Issues & Solutions

### Issue 1: "Registration failed" with no specific error
**Solution:** Check server console for detailed error logs

### Issue 2: File upload fails
**Solution:** 
- Make sure the image is less than 5MB
- Use common image formats (JPG, PNG, GIF)
- Check if `public/uploads` folder exists

### Issue 3: "Invalid department selected"
**Solution:** 
- Refresh the page to reload departments
- Make sure you select a department from the dropdown

### Issue 4: Contact validation error
**Solution:**
- Telegram username must be at least 3 characters
- WhatsApp number must be at least 8 digits
- You need at least ONE of these (not both required)

### Issue 5: Database connection error
**Solution:**
- Check your `.env` file has correct `DATABASE_URL`
- Run: `node setup-database.js`

## 🚀 Test Registration Flow

### Test Data You Can Use:
```
Name: John Doe
Email: john.doe@example.com
Password: password123
Phone: +251911234567
Telegram: @johndoe
WhatsApp: 251911234567
Department: Computer Science
Payment Method: CBE
```

### Account Numbers for Testing:
- **CBE Bank:** 1000472733617
- **Telebirr:** 0922486497

## 📞 Still Having Issues?

If registration still fails after following these steps:

1. **Check the exact error message** in browser console
2. **Check server terminal** for detailed error logs
3. **Try with different data** to isolate the issue
4. **Restart the development server** (`npm run dev`)
5. **Clear browser cache** and try again

## ✅ Expected Success Flow

1. Fill Step 1 form → Click "Continue to Payment"
2. Select payment method → Account number appears
3. Upload payment screenshot → Preview shows
4. Click "Complete Registration"
5. Success message: "Registration successful! Please wait for admin approval..."
6. Redirect to sign-in page

## 🎉 After Successful Registration

1. Admin can see your registration in the admin dashboard
2. Admin can view your payment screenshot
3. Admin approves your payment
4. You can then sign in to your account

---

**Your assignment platform is fully functional!** 🚀