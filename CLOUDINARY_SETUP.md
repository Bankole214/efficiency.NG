# Cloudinary Image Upload Setup Guide

This guide will help you set up Cloudinary for image uploads in FurniShop.

## Step 1: Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a **free account**
3. Verify your email

## Step 2: Get Your Credentials

1. After signing in, go to your **Dashboard**
2. You'll see your **Cloud Name** at the top (looks like `dxxxxxxx`)
3. Copy this value

## Step 3: Create an Upload Preset

1. Click on **Settings** (⚙️ gear icon in top right)
2. Go to the **Upload** tab
3. Scroll down to **Upload presets** section
4. Click **Add upload preset**
5. Fill in:
   - **Name**: `furnishop` (or any name you prefer)
   - **Signing Mode**: Select **Unsigned** (allows uploads without a backend)
6. Click **Save**
7. Copy the preset name

## Step 4: Add Credentials to Your App

Open `src/pages/Admin.jsx` and replace these lines (around line 8-9):

```javascript
const CLOUDINARY_CLOUD_NAME = "YOUR_CLOUD_NAME";
const CLOUDINARY_UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";
```

With your actual values:

```javascript
const CLOUDINARY_CLOUD_NAME = "#"; // Example: replace with your cloud name
const CLOUDINARY_UPLOAD_PRESET = "#"; // Example: replace with your preset name
```

## Step 5: Test It

1. Go to the Admin Panel
2. Try uploading an image
3. If successful, the image URL will appear in the preview

## Troubleshooting

**Upload says "Failed to upload image"?**

- Check that you replaced `YOUR_CLOUD_NAME` and `YOUR_UPLOAD_PRESET` with your actual values
- Make sure the preset is set to **Unsigned**
- Check browser console for error messages (F12 → Console)

**Image not showing in preview?**

- Wait a moment after upload completes
- Refresh the page and try again

## Notes

- Free Cloudinary accounts get 25GB storage per month
- Images upload directly from your browser (no backend needed)
- Uploads are instant and URLs are permanent
- Your images are stored in Cloudinary's CDN (fast delivery worldwide)
