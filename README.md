# Jay's Junk Removal – Website

This repository contains the source for the official Jay's Junk Removal website.

## Stack

- Static HTML
- Shared CSS in `assets/css/styles.css`
- Vanilla JavaScript in `assets/js/site.js`
- GitHub Pages deployment with `CNAME`

## Page structure

- `/` – lead-generation homepage
- `/junk-removal/` – service page
- `/house-cleanouts/` – service page
- `/resources/` – article/resource page
- `/terms/` – terms and conditions

## Content and business rules

- The public street address is intentionally omitted from the site.
- Service-area positioning focuses on Luzerne County, Lackawanna County, Wilkes-Barre, and Hanover Township.
- Real photography from `/images` is reused throughout the site.
- Existing Terms & Conditions and article content are preserved, with service-area/address updates required by the redesign brief.

## Required configuration

Update `assets/js/site-config.js` before launch:

- `gaMeasurementId` – Google Analytics 4 Measurement ID
- `googleReviewsUrl` – direct Google reviews/profile URL
- `featuredReviews` – approved review quote objects for the reviews section
- `photoQuoteEndpoint` – secure multipart upload endpoint for the photo quote form

### Photo quote endpoint expectations

The website is hosted on GitHub Pages, so file uploads need an external endpoint. The current front end expects a `POST` multipart endpoint that can accept:

- `name`
- `phone`
- `email`
- `town_or_zip`
- `description`
- one or more `photos`

Use a secure backend or hosted form service that supports multipart uploads. Do not add secrets or email credentials to public JavaScript.

## Analytics events already wired in the front end

- `call_click`
- `photo_quote_start`
- `photo_quote_submit`
- `quote_click`
- `pricing_tier_select`
- `junk_estimator_use`
- `google_reviews_click`
- `service_area_click`
- `service_cta_click`
- `email_click`

Do not send customer names, phone numbers, email addresses, descriptions, or photo contents to analytics.
