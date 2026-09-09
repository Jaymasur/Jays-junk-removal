# Jay's Junk Removal – Website

This repository contains the source for the official Jay's Junk Removal website.

## Stack

- Static HTML
- Shared CSS in `assets/css/styles.css`
- Vanilla JavaScript in `assets/js/site.js`
- GitHub Pages deployment with `CNAME`

## Page structure

- `/` – junk-removal-first lead-generation homepage
- `/junk-removal/` – primary service pillar
- `/house-cleanouts/` – supporting cleanout page
- `/yard-cleanup/` – secondary outdoor cleanup and material services page
- `/resources/` – article/resource page
- `/terms/` – terms and conditions

## Content and business rules

- The public street address is intentionally omitted from the site.
- Junk removal is the primary business and SEO focus.
- Service-area positioning focuses on Wilkes-Barre, Luzerne County, Lackawanna County, and Northeastern Pennsylvania.
- Real photography from `/images` is reused throughout the site.
- Existing Terms & Conditions and article content are preserved, with service-area/address updates required by the redesign brief.
- Outdoor services remain secondary and include yard debris cleanup, brush cleanup, mulch, and decorative stone support.
- The site should not position the business as providing lawn mowing, grass cutting, weekly lawn service, or routine lawn maintenance.

## Required configuration

Update `assets/js/site-config.js` before launch:

- `gaMeasurementId` – Google Analytics 4 Measurement ID
- `googleReviewsUrl` – direct Google reviews/profile URL
- `featuredReviews` – approved review quote objects for the reviews section
- `beforeAfterProjects` – approved before/after image pair data for the optional comparison component
- `photoQuoteEndpoint` – secure multipart upload endpoint for the photo quote form
- add any Google Search Console verification tag or verification file directly in the published HTML/root files when provided

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
- `location_cta_click`
- `before_after_interaction`
- `email_click`

Do not send customer names, phone numbers, email addresses, descriptions, or photo contents to analytics.
