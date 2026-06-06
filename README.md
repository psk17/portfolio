# Portfolio Website with Contact Email Forwarding

This repository contains a personal portfolio website built with static HTML/CSS/JavaScript and a serverless contact form API for Vercel.

## Project Overview

- `index.html` - main portfolio landing page
- `style.css` - site styling and layout
- `app.js` - page interactions, cursor effects, reveal animations, and form submission logic
- `api/contact.js` - Vercel serverless function that receives contact form submissions and forwards them via email using Nodemailer
- `package.json` - project dependencies for Vercel deployment
- `.gitignore` - common files to ignore for this project

## Features

- custom cursor and scroll reveal animations
- contact form with floating labels
- serverless contact form backend for Vercel
- email forwarding of submitted messages to `kkpavank121@gmail.com`

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run locally using a static server or Vercel preview.

   If you only want to preview the site locally:

   - Open `index.html` directly in the browser
   - or use a static server such as `live-server` or `python -m http.server`

## Vercel Deployment

This site is ready to deploy on Vercel. The serverless contact API route is located in `api/contact.js`.

### Required Environment Variables

Create these environment variables in your Vercel project settings:

- `EMAIL_USER` - SMTP username (typically your Gmail address)
- `EMAIL_PASS` - SMTP password, or Gmail app password
- `EMAIL_SERVICE` - optional, defaults to `gmail`
- `EMAIL_FROM` - optional sender email address (defaults to `EMAIL_USER`)
- `EMAIL_TO` - optional recipient email address (defaults to `kkpavank121@gmail.com`)

> For Gmail, using an app password is recommended. Standard Gmail account passwords may not work unless SMTP access is configured properly.

## Contact Form Behavior

- The contact form submits via JavaScript to `/api/contact`.
- The API validates `name`, `email`, and `message`.
- When valid, it sends an email with the form contents.
- It returns JSON success or error responses.

## Notes

- This project does not store submissions in a database.
- Email forwarding depends on valid SMTP credentials.
- For production use, secure your environment variables and consider adding spam protection.

## License

This project is provided as-is.
