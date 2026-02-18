# GeoSolutions CMS Admin User Guide

Welcome to the GeoSolutions Content Management System! This guide will help you manage your website content with confidence. No technical knowledge required.

---

## 1. Getting Started

### Accessing the Admin Panel

Your Strapi admin panel is available at:

**URL:** `https://your-domain.com/admin`

[Screenshot: Strapi login page]

### Login Process

1. Navigate to the admin panel URL
2. Enter your email address
3. Enter your password
4. Click **"Login"**

**Note:** If you've forgotten your password, contact your system administrator to reset it.

### Dashboard Overview

After logging in, you'll see the main dashboard with:

- **Content Manager** - Where you edit all website content
- **Media Library** - Where you manage images and files
- **Content-Type Builder** - (Admin only - creates new content types)
- **Settings** - User management and general settings

[Screenshot: Strapi dashboard]

### Navigation Explained

The left sidebar contains all your main tools:

| Section             | What It Does                             |
| ------------------- | ---------------------------------------- |
| **Content Manager** | Edit pages, projects, team members, etc. |
| **Media Library**   | View and upload images/documents         |
| **Plugins**         | Additional features (if installed)       |
| **Settings**        | System configuration                     |

---

## 2. Content Types Overview

Your website content is organized into these sections:

### Announcement Banner

**Purpose:** Display promotional messages, holiday closures, or important notices at the top of the website

**Contains:**

- Enabled toggle (on/off switch)
- Message text (the announcement content)
- Optional link text and URL (e.g., "Learn more")
- Background color (info/blue, warning/yellow, error/red, success/green)
- Dismissible toggle (allow visitors to close the banner)

**Where it appears:** Fixed at the very top of all pages, above the navigation bar

**Tips:**

- Turn off the banner by unchecking "Enabled" when not needed
- Keep messages short and clear (1-2 sentences)
- Use appropriate colors: info (general notices), warning (alerts), error (critical), success (positive news)
- Dismissible banners stay hidden for the user's session after they close it

---

### About

**Purpose:** Controls the "About Us" section on your homepage

**Contains:**

- Rich text content with formatting
- Company history, mission, or description

**Where it appears:** Homepage about section

---

### Services Page

**Purpose:** Manages the services your company offers

**Contains:**

- Services introduction text
- List of individual service items
- Each service has a title, description, and optional icon

**Where it appears:** Services page and homepage services section

---

### Site Setting

**Purpose:** Global settings that appear throughout your website

**Contains:**

- Footer tagline
- Contact email
- Phone number
- Business address
- Social media links

**Where it appears:** Footer on every page, contact section

---

### Hero

**Purpose:** The large banner image visitors see first

**Contains:**

- Hero banner image (full-width)
- Optional heading text
- Optional subheading or call-to-action

**Where it appears:** Top of homepage

---

### Team

**Purpose:** Your staff member profiles

**Contains:**

- Name
- Job title/role
- Photo
- Bio (optional)
- Order field (controls display sequence)

**Where it appears:** Team/About page

---

### Projects

**Purpose:** Your portfolio of completed work

**Contains:**

- Project title
- Description
- Category/type
- Before photos
- After photos
- Location
- Date completed
- Order field (controls display sequence)

**Where it appears:** Projects/Portfolio page

---

### Documents

**Purpose:** Downloadable files like brochures, reports, or resources

**Contains:**

- Document title
- Description
- File upload (PDF, DOC, etc.)
- Category
- Publication date

**Where it appears:** Resources or downloads section

---

### Testimonials

**Purpose:** Client reviews and feedback

**Contains:**

- Client name
- Company name (optional)
- Quote/testimonial text
- Photo (optional)
- Order field (controls display sequence)

**Where it appears:** Homepage testimonials section

---

## 3. How to Edit Content

### Editing Text Content

1. Click **"Content Manager"** in the left sidebar
2. Select the content type you want to edit (e.g., "About")
3. Click on the entry to open it
4. Make your changes in the text fields
5. Click **"Save"** to keep as draft, or **"Publish"** to make live

[Screenshot: Content Manager interface]

---

### Uploading Images

**Step-by-step:**

1. Open the content entry you want to edit
2. Find the image field (e.g., "Photo", "Banner Image")
3. Click **"Add new assets"** or the upload area
4. Choose upload method:
   - **"From computer"** - Select from your files
   - **"From URL"** - Paste an image link
   - **"Media Library"** - Choose from previously uploaded images
5. Select your image file
6. Wait for upload to complete (you'll see a thumbnail)
7. Click **"Save"** or **"Publish"**

[Screenshot: Image upload dialog]

**Tips:**

- You can drag and drop images directly into upload areas
- Always check the preview before publishing
- Optimize images before uploading (see Image Guidelines)

---

### Reordering Items

Many content types (Team, Projects, Testimonials) have an **"Order"** field that controls their display sequence.

**How to reorder:**

1. Open the item you want to move
2. Find the **"Order"** field (usually a number)
3. Change the number:
   - Lower numbers appear first (1, 2, 3...)
   - Higher numbers appear last
4. Save your changes
5. Repeat for other items as needed

**Example:**

- To make a team member appear first, set Order to `1`
- To make a project appear last, set Order to `999`

---

### Publishing vs Saving Draft

Strapi gives you control over what's visible on your website:

| Action        | What It Does                                     |
| ------------- | ------------------------------------------------ |
| **Save**      | Saves your changes but keeps content unpublished |
| **Publish**   | Makes content live on the website immediately    |
| **Unpublish** | Hides published content from the website         |

**Best Practice:**

1. Make your edits
2. Click **"Save"** to review later
3. When everything looks good, click **"Publish"**
4. Check the live website to confirm changes

[Screenshot: Save vs Publish buttons]

---

### Using the Rich Text Editor

The rich text editor allows you to format text like a word processor:

**Available formatting:**

- **Bold** - Click the **B** button or press Ctrl+B (Cmd+B on Mac)
- _Italic_ - Click the _I_ button or press Ctrl+I (Cmd+I on Mac)
- Headings - Use the dropdown to select H1, H2, H3, etc.
- Bullet lists - Click the bullet icon
- Numbered lists - Click the numbered list icon
- Links - Highlight text, click the link icon, enter URL
- Images - Click the image icon, upload or select from library

[Screenshot: Rich text editor toolbar]

**Tips:**

- Use headings to organize long content
- Keep paragraphs short for readability
- Preview on mobile devices when possible

---

## 4. Image Guidelines

### Recommended Sizes

Use these dimensions for optimal display quality:

| Content Type | Field        | Recommended Size | Aspect Ratio |
| ------------ | ------------ | ---------------- | ------------ |
| Hero         | Banner Image | 1920 x 600px     | 16:5 (wide)  |
| Team         | Photo        | 400 x 400px      | 1:1 (square) |
| Projects     | Thumbnails   | 800 x 600px      | 4:3          |
| Projects     | Before/After | 1200 x 900px     | 4:3          |
| Testimonials | Avatar       | 200 x 200px      | 1:1 (square) |
| Services     | Icon         | 200 x 200px      | 1:1 (square) |

**Note:** These are ideal sizes. The website will automatically resize images, but starting with correct dimensions ensures best quality.

---

### File Formats

Choose the right format for your image type:

| Format   | Best For                          | Pros                               | Cons                               |
| -------- | --------------------------------- | ---------------------------------- | ---------------------------------- |
| **JPG**  | Photos, complex images            | Small file size, widely supported  | No transparency                    |
| **PNG**  | Logos, graphics with transparency | Supports transparency, sharp edges | Larger file size                   |
| **WebP** | Modern browsers                   | Best quality-to-size ratio         | Not supported on very old browsers |

**Recommendations:**

- Use **JPG** for photos (team, projects, hero)
- Use **PNG** for logos or images that need transparency
- Use **WebP** if you have conversion tools (best option)
- Avoid **GIF** for photos (outdated, large files)

---

### File Size Best Practices

Keep your website fast by optimizing image file sizes:

| Priority   | File Size       | Quality                 |
| ---------- | --------------- | ----------------------- |
| Ideal      | Under 200 KB    | Excellent for web       |
| Acceptable | 200 KB - 500 KB | Good quality            |
| Too Large  | 500 KB - 1 MB   | Slows down website      |
| Avoid      | Over 1 MB       | Will impact performance |

**Recommended Maximum:** 5 MB (Strapi will accept larger, but avoid it)

**How to reduce file size:**

1. Resize images to recommended dimensions before uploading
2. Use online tools like TinyPNG or Squoosh.app
3. Adjust quality to 80-85% (usually unnoticeable difference)
4. Convert to WebP format when possible

---

## 5. SEO Best Practices

Search Engine Optimization (SEO) helps people find your website on Google and other search engines.

### Meta Titles

The meta title appears in search results and browser tabs.

**Best practices:**

- Keep under **60 characters** (or it gets cut off)
- Include your main keyword
- Make it descriptive and compelling
- Include your company name at the end

**Examples:**

- ✅ Good: "Landscape Services in Phoenix | GeoSolutions"
- ❌ Too long: "Professional Landscape Design, Installation, and Maintenance Services for Residential and Commercial Properties in Phoenix, Arizona"
- ❌ Too generic: "Home Page"

---

### Meta Descriptions

The meta description appears below the title in search results.

**Best practices:**

- Keep under **160 characters**
- Summarize the page content
- Include a call-to-action
- Use natural, conversational language

**Examples:**

- ✅ Good: "Transform your outdoor space with GeoSolutions. Professional landscaping, irrigation, and hardscaping in Phoenix. Free consultation available."
- ❌ Too short: "We do landscaping."
- ❌ Keyword stuffing: "Landscaping Phoenix landscape design Phoenix landscapers Phoenix landscape services Phoenix landscape company Phoenix"

---

### Image Alt Text

Alt text describes images for screen readers (accessibility) and search engines.

**Best practices:**

- Describe what's in the image
- Keep it concise (under 125 characters)
- Include keywords naturally, but don't force them
- Don't start with "Image of..." (implied)

**Examples:**

- ✅ Good: "Modern desert garden with native plants and stone pathway"
- ✅ Good: "John Smith, Senior Landscape Designer at GeoSolutions"
- ❌ Too generic: "Image1" or "Photo"
- ❌ Keyword stuffing: "Phoenix landscaping landscape design landscaper desert plants"

---

## 6. Common Tasks

Quick reference guide for frequently performed actions.

### Adding a New Team Member

1. Click **"Content Manager"** → **"Team"**
2. Click **"Create new entry"** button (top right)
3. Fill in the fields:
   - **Name**: Full name of team member
   - **Role**: Job title or position
   - **Photo**: Upload square photo (400x400px recommended)
   - **Bio**: Brief description (optional)
   - **Order**: Enter a number (higher = appears later)
4. Click **"Save"** to review, or **"Publish"** to make live
5. Check the website to see the new team member

[Screenshot: Create new team member form]

---

### Adding a New Project

1. Click **"Content Manager"** → **"Projects"**
2. Click **"Create new entry"** button
3. Fill in the required fields:
   - **Title**: Project name
   - **Description**: What was done, challenges, results
   - **Category**: Type of project (residential, commercial, etc.)
   - **Location**: City or area
   - **Date**: When completed
   - **Before Photos**: Upload 1-3 images (800x600px or larger)
   - **After Photos**: Upload 1-3 images (800x600px or larger)
   - **Order**: Display sequence number
4. Add optional fields if available:
   - Client name (if allowed to share)
   - Budget range
   - Duration
5. Click **"Save"** or **"Publish"**
6. Verify the project appears in your portfolio

---

### Changing Contact Information

1. Click **"Content Manager"** → **"Site Setting"**
2. Click on the single entry (there should only be one)
3. Update the fields:
   - **Email**: Company email address
   - **Phone**: Phone number with proper formatting
   - **Address**: Full business address
   - **Footer Tagline**: Brief tagline that appears in footer
   - **Social Media Links**: Update any social media URLs
4. Click **"Publish"** to update
5. Check the footer on any page to confirm changes

**Note:** Changes to site settings affect the entire website.

---

### Adding a Testimonial

1. Click **"Content Manager"** → **"Testimonials"**
2. Click **"Create new entry"** button
3. Fill in the fields:
   - **Client Name**: First and last name
   - **Company**: Client's company (optional)
   - **Quote**: The testimonial text (keep concise)
   - **Photo**: Client photo or avatar (200x200px, optional)
   - **Order**: Display sequence number
4. Click **"Publish"** to add to homepage
5. Preview homepage to see the new testimonial

**Tips:**

- Keep quotes under 2-3 sentences for impact
- Get written permission before publishing client names
- Ask clients if they'd like their company name included

---

### Updating the Hero Image

1. Click **"Content Manager"** → **"Hero"**
2. Click on the entry to open it
3. Find the **"Banner Image"** field
4. Click to upload a new image:
   - Recommended size: 1920 x 600px
   - Wide landscape orientation
   - Eye-catching, high-quality photo
   - Shows your work or team in action
5. Optional: Update heading or subheading text
6. Click **"Publish"** to update
7. Visit homepage to see the new hero image

**Pro tip:** Choose images with important content in the center, as edges may be cropped on mobile devices.

---

## 7. Troubleshooting

### Content Not Appearing on Website

**Problem:** You edited content but don't see changes on the live website.

**Solutions:**

1. **Check publication status**
   - Open the content entry
   - Look for "Published" status at the top
   - If it says "Draft", click **"Publish"**

2. **Clear browser cache**
   - Press Ctrl+Shift+R (PC) or Cmd+Shift+R (Mac)
   - Or try viewing in an incognito/private window

3. **Check the correct page**
   - Verify you're looking at the right page where content should appear
   - Some content appears on specific pages only

4. **Wait a moment**
   - Some changes take 30-60 seconds to propagate
   - Especially true for image updates

---

### Images Not Loading

**Problem:** Images appear as broken links or don't display properly.

**Solutions:**

1. **Check file size**
   - Large files (over 5MB) may fail to upload
   - Compress or resize before uploading
   - Use tools like TinyPNG.com

2. **Check file format**
   - Use JPG, PNG, or WebP only
   - Avoid TIFF, BMP, or PSD files
   - Rename files to remove special characters

3. **Check upload completion**
   - Wait for thumbnail to appear after upload
   - Don't click away while uploading
   - Check your internet connection

4. **Clear media field and re-upload**
   - Remove the image from the field
   - Save the entry
   - Re-open and upload again

---

### Changes Not Showing After Publishing

**Problem:** You published changes but they don't appear.

**Solutions:**

1. **Hard refresh the page**
   - Windows/Linux: Ctrl+Shift+R
   - Mac: Cmd+Shift+R
   - This clears cached content

2. **Try incognito/private browsing**
   - Opens a fresh browser session
   - Rules out browser cache issues

3. **Check you published (not just saved)**
   - Open the entry in Strapi
   - Confirm status shows "Published"
   - If "Draft", click **"Publish"** again

4. **Verify correct environment**
   - Make sure you're editing the production CMS
   - Not a staging or development version
   - Check the URL in your browser

---

### Can't Upload Files

**Problem:** Upload button doesn't work or files are rejected.

**Solutions:**

1. **Check file size**
   - Maximum: 5 MB recommended
   - Very large files will be rejected
   - Compress before uploading

2. **Check permissions**
   - Your account may not have upload rights
   - Contact your administrator

3. **Try different browser**
   - Chrome, Firefox, Safari, or Edge
   - Update your browser to latest version

4. **Check file type**
   - Images: JPG, PNG, WebP, GIF
   - Documents: PDF, DOC, DOCX, XLS, XLSX
   - Avoid executable files (.exe, .dmg)

---

### Rich Text Editor Issues

**Problem:** Formatting buttons don't work or text looks wrong.

**Solutions:**

1. **Highlight text first**
   - Select the text you want to format
   - Then click formatting buttons

2. **Copy from plain text editor**
   - If pasting from Word, formatting may break
   - Paste into Notepad first
   - Then copy from Notepad into Strapi

3. **Use the "Clear Formatting" button**
   - Removes all formatting
   - Start fresh with clean text

4. **Try the HTML view**
   - Some editors have a "Source" or "HTML" view
   - Check for broken tags

---

### Forgotten Password

**Problem:** Can't remember your login password.

**Solutions:**

1. **Contact your system administrator**
   - They can reset your password
   - Provide them with your email address

2. **Check for password reset email**
   - Admin may have sent reset link
   - Check spam/junk folder

**Note:** For security reasons, there is no self-service password reset unless specifically configured.

---

### Need Additional Help?

If you're experiencing issues not covered in this guide:

1. **Document the problem**
   - Take screenshots
   - Note what you were trying to do
   - Note any error messages

2. **Contact your website administrator**
   - Provide the documentation from step 1
   - Include your username (not password!)

3. **Check for updates**
   - This guide may be updated periodically
   - Ask admin for latest version

---

## Best Practices Summary

✅ **DO:**

- Save your work frequently
- Use draft mode to preview before publishing
- Optimize images before uploading
- Use descriptive filenames for images
- Fill in alt text for accessibility
- Keep meta titles under 60 characters
- Keep meta descriptions under 160 characters
- Test changes on mobile devices

❌ **DON'T:**

- Upload unoptimized images (over 1MB)
- Use special characters in filenames
- Publish without reviewing
- Copy/paste from Word (use plain text first)
- Use all caps in titles
- Stuff keywords unnaturally
- Delete content without backing up
- Share your login credentials

---

## Glossary

**CMS:** Content Management System - software that lets you edit website content

**Content Type:** A category of content (like "Team" or "Projects")

**Entry:** A single item within a content type (like one team member)

**Media Library:** Where all uploaded images and files are stored

**Rich Text Editor:** Text box with formatting options (bold, italic, etc.)

**Slug:** URL-friendly version of a title (e.g., "about-us")

**Alt Text:** Description of an image for accessibility and SEO

**Meta Description:** Summary text that appears in search results

**Meta Title:** Page title that appears in search results and browser tabs

**Draft:** Content saved but not published to the website

**Published:** Content that is live and visible on the website

**Order Field:** Number that controls the sequence items appear

---

## Quick Reference Card

### Essential URLs

- **Admin Panel:** `https://your-domain.com/admin`
- **Website:** `https://your-domain.com`

### Common Keyboard Shortcuts

| Action               | Windows/Linux | Mac         |
| -------------------- | ------------- | ----------- |
| Save                 | Ctrl+S        | Cmd+S       |
| Bold text            | Ctrl+B        | Cmd+B       |
| Italic text          | Ctrl+I        | Cmd+I       |
| Hard refresh browser | Ctrl+Shift+R  | Cmd+Shift+R |

### Image Size Quick Reference

- Hero: 1920x600px
- Team: 400x400px
- Projects: 800x600px
- Testimonials: 200x200px
- Max file size: 5MB

### Publishing Checklist

- [ ] Content is accurate and complete
- [ ] Images are uploaded and display correctly
- [ ] Alt text is added to all images
- [ ] Meta title is under 60 characters
- [ ] Meta description is under 160 characters
- [ ] Preview looks good
- [ ] Ready to publish!

---

_This guide was created for GeoSolutions CMS administrators. Last updated: February 2026._
