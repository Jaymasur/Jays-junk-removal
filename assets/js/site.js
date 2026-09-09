(() => {
  const config = window.JJR_CONFIG || {};
  const pricingTiers = [
    {
      id: 'quarter',
      label: '1/4 Trailer',
      shortLabel: '1/4',
      fill: 25,
      price: '$275',
      volume: 'About 5 cubic yards',
      weight: 'About 1,000 lb included',
      example: 'A small cleanout, a couch and chair with bags and boxes, a mattress set, or several miscellaneous household items.'
    },
    {
      id: 'third',
      label: '1/3 Trailer',
      shortLabel: '1/3',
      fill: 33,
      price: '$350',
      volume: 'About 6.7 cubic yards',
      weight: 'About 1,300 lb included',
      example: 'Several furniture pieces with boxes or bags, or a larger single-room cleanout.'
    },
    {
      id: 'half',
      label: '1/2 Trailer',
      shortLabel: '1/2',
      fill: 50,
      price: '$450',
      volume: '10 cubic yards',
      weight: '1 ton / 2,000 lb included',
      example: 'Multiple furniture pieces, appliances, and boxes, or a medium garage or basement cleanout.'
    },
    {
      id: 'twothirds',
      label: '2/3 Trailer',
      shortLabel: '2/3',
      fill: 67,
      price: '$650',
      volume: 'About 13.3 cubic yards',
      weight: 'About 2,650 lb included',
      example: 'A substantial garage or basement cleanout, or several rooms of household items.'
    },
    {
      id: 'threequarters',
      label: '3/4 Trailer',
      shortLabel: '3/4',
      fill: 75,
      price: '$775',
      volume: '15 cubic yards',
      weight: '1½ tons / 3,000 lb included',
      example: 'A large cleanout with furniture, appliances, boxes, and mixed junk.'
    },
    {
      id: 'full',
      label: 'Full Trailer',
      shortLabel: 'Full',
      fill: 100,
      price: '$1,000',
      volume: '20 cubic yards',
      weight: '2 tons / 4,000 lb included',
      example: 'A large estate or whole-house cleanout, a major basement cleanup, or significant mixed household volume.'
    }
  ];

  const estimatorTiers = {
    few: { tier: '1/4 Trailer', note: 'You may be around a 1/4 trailer.' },
    small: { tier: '1/3 Trailer', note: 'You may be around a 1/3 trailer.' },
    medium: { tier: '1/2 Trailer', note: 'You may be around a 1/2 trailer.' },
    large: { tier: '2/3 to 3/4 Trailer', note: 'You may be around a 2/3 to 3/4 trailer.' },
    estate: { tier: 'Full Trailer', note: 'You may be around a full trailer.' }
  };

  function isConfigured(value) {
    return typeof value === 'string' && value.trim() !== '';
  }

  function loadAnalytics() {
    if (!isConfigured(config.gaMeasurementId)) return;
    if (window.gtag) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.gaMeasurementId)}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', config.gaMeasurementId, { anonymize_ip: true });
  }

  function trackEvent(name, params = {}) {
    if (!window.gtag) return;
    window.gtag('event', name, {
      page_path: window.location.pathname,
      ...params
    });
  }

  function preserveQueryStrings() {
    const query = window.location.search;
    if (!query) return;
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http') || href.startsWith('//') || href.startsWith('#')) {
        return;
      }
      if (href.includes('?')) return;
      const [path, hash = ''] = href.split('#');
      link.setAttribute('href', `${path}${query}${hash ? `#${hash}` : ''}`);
    });
  }

  function setupHeader() {
    const header = document.querySelector('[data-site-header]');
    const toggle = document.querySelector('[data-menu-toggle]');
    const nav = document.querySelector('[data-site-nav]');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
      nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    const updateHeader = () => {
      if (!header) return;
      header.classList.toggle('is-scrolled', window.scrollY > 18);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  function setupTrackingLinks() {
    document.querySelectorAll('[data-track-event]').forEach((el) => {
      el.addEventListener('click', () => {
        trackEvent(el.dataset.trackEvent, {
          cta_location: el.dataset.ctaLocation || '',
          service_name: el.dataset.serviceName || '',
          location_name: el.dataset.locationName || ''
        });
      });
    });
  }

  function setupPricing() {
    const controls = document.querySelector('[data-pricing-controls]');
    if (!controls) return;

    const fill = document.querySelector('[data-trailer-fill]');
    const tierName = document.querySelector('[data-pricing-name]');
    const tierPrice = document.querySelector('[data-pricing-price]');
    const tierVolume = document.querySelector('[data-pricing-volume]');
    const tierWeight = document.querySelector('[data-pricing-weight]');
    const tierExample = document.querySelector('[data-pricing-example]');

    function applyTier(id) {
      const tier = pricingTiers.find((item) => item.id === id) || pricingTiers[2];
      controls.querySelectorAll('button').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.tier === tier.id);
        button.setAttribute('aria-pressed', String(button.dataset.tier === tier.id));
      });
      if (fill) fill.style.height = `${tier.fill}%`;
      if (tierName) tierName.textContent = tier.label;
      if (tierPrice) tierPrice.textContent = tier.price;
      if (tierVolume) tierVolume.textContent = tier.volume;
      if (tierWeight) tierWeight.textContent = tier.weight;
      if (tierExample) tierExample.textContent = tier.example;
      trackEvent('pricing_tier_select', { pricing_tier: tier.shortLabel });
    }

    controls.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-tier]');
      if (!button) return;
      applyTier(button.dataset.tier);
    });

    applyTier('half');
  }

  function setupEstimator() {
    const container = document.querySelector('[data-estimator]');
    if (!container) return;
    const result = container.querySelector('[data-estimator-result]');
    const resultTier = container.querySelector('[data-estimator-tier]');
    const resultCopy = container.querySelector('[data-estimator-copy]');

    container.addEventListener('click', (event) => {
      const button = event.target.closest('[data-estimator-choice]');
      if (!button) return;
      const key = button.dataset.estimatorChoice;
      const info = estimatorTiers[key];
      if (!info) return;
      container.querySelectorAll('[data-estimator-choice]').forEach((choice) => {
        choice.classList.toggle('is-active', choice === button);
      });
      result.classList.remove('hidden');
      resultTier.textContent = info.tier;
      resultCopy.textContent = `${info.note} Every job is different. Send Jay photos for a more accurate estimate.`;
      trackEvent('junk_estimator_use', { pricing_tier: info.tier });
    });
  }

  function createPreviewCard(file, url) {
    const card = document.createElement('div');
    card.className = 'preview-card';
    const image = document.createElement('img');
    image.src = url;
    image.alt = file.name;
    const label = document.createElement('span');
    label.textContent = file.name;
    card.append(image, label);
    return card;
  }

  async function compressImage(file) {
    if (!file.type.startsWith('image/') || file.size < 2_000_000) return file;
    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const maxDimension = 1600;
    const scale = Math.min(1, maxDimension / Math.max(imageBitmap.width, imageBitmap.height));
    canvas.width = Math.round(imageBitmap.width * scale);
    canvas.height = Math.round(imageBitmap.height * scale);
    const context = canvas.getContext('2d');
    context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82));
    return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
  }

  function setupPhotoQuote() {
    const form = document.querySelector('[data-photo-quote-form]');
    if (!form) return;

    const endpointNotice = document.querySelector('[data-photo-endpoint-notice]');
    const reviewsLinks = document.querySelectorAll('[data-google-reviews-link]');
    const fileInput = form.querySelector('input[type="file"]');
    const previewGrid = form.querySelector('[data-preview-grid]');
    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('button[type="submit"]');
    const note = document.querySelector('[data-review-note]');
    const reviewSections = document.querySelectorAll('[data-reviews-section]');
    const reviewGrid = document.querySelector('[data-review-grid]');
    const reviewFeature = document.querySelector('[data-review-feature]');
    const featuredReview = (config.featuredReviews || []).filter((review) => review.quote && review.reviewer);

    if (!isConfigured(config.photoQuoteEndpoint) && endpointNotice) {
      endpointNotice.classList.remove('hidden');
    }

    if (isConfigured(config.googleReviewsUrl)) {
      reviewsLinks.forEach((link) => link.setAttribute('href', config.googleReviewsUrl));
    } else {
      reviewsLinks.forEach((link) => link.classList.add('hidden'));
      if (note) note.classList.add('is-visible');
    }

    if (featuredReview.length && reviewGrid && reviewFeature) {
      reviewFeature.classList.remove('hidden');
      const [first, ...rest] = featuredReview;
      const featureText = reviewFeature.querySelector('[data-featured-review-text]');
      const featureReviewer = reviewFeature.querySelector('[data-featured-reviewer]');
      if (featureText) featureText.textContent = first.quote;
      if (featureReviewer) featureReviewer.textContent = `${first.reviewer}${first.location ? ` • ${first.location}` : ''}`;
      rest.slice(0, 2).forEach((review) => {
        const card = document.createElement('article');
        card.className = 'review-card';
        card.innerHTML = `<div class="review-body"><div class="stars" aria-label="Five star review">★★★★★</div><p>“${review.quote}”</p><strong>${review.reviewer}</strong><p>${review.location || 'Verified customer'}</p></div>`;
        reviewGrid.appendChild(card);
      });
    } else {
      reviewSections.forEach((section) => section.classList.add('hidden'));
    }

    if (fileInput && previewGrid) {
      fileInput.addEventListener('change', () => {
        previewGrid.innerHTML = '';
        Array.from(fileInput.files || []).slice(0, 6).forEach((file) => {
          const url = URL.createObjectURL(file);
          previewGrid.appendChild(createPreviewCard(file, url));
        });
        trackEvent('photo_quote_start', { cta_location: 'photo-quote-form' });
      });
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.textContent = '';
      if (!form.reportValidity()) return;

      if (!isConfigured(config.photoQuoteEndpoint)) {
        status.textContent = 'Secure photo uploads are ready in the front end, but the form endpoint still needs to be configured before visitors can submit files from the live site.';
        return;
      }

      submit.disabled = true;
      submit.textContent = 'Sending...';

      try {
        const payload = new FormData();
        const fields = new FormData(form);
        for (const [key, value] of fields.entries()) {
          if (key !== 'photos') payload.append(key, value);
        }

        const rawFiles = Array.from(fileInput.files || []).slice(0, 6);
        for (const file of rawFiles) {
          payload.append('photos', await compressImage(file));
        }

        const response = await fetch(config.photoQuoteEndpoint, {
          method: 'POST',
          body: payload
        });

        if (!response.ok) throw new Error('Upload failed');
        form.reset();
        if (previewGrid) previewGrid.innerHTML = '';
        status.textContent = config.photoQuoteSuccessMessage || 'Thanks for sending your photos.';
        trackEvent('photo_quote_submit', { cta_location: 'photo-quote-form' });
      } catch (error) {
        status.textContent = 'There was a problem sending the request. Please call Jay or try again after the upload endpoint is configured.';
      } finally {
        submit.disabled = false;
        submit.textContent = 'Send photos to Jay';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadAnalytics();
    preserveQueryStrings();
    setupHeader();
    setupTrackingLinks();
    setupPricing();
    setupEstimator();
    setupPhotoQuote();

    document.querySelectorAll('[data-email]').forEach((el) => {
      el.textContent = config.email || 'jaysjunkremoval7@gmail.com';
      el.setAttribute('href', config.emailHref || `mailto:${config.email}`);
    });
    document.querySelectorAll('[data-phone]').forEach((el) => {
      el.textContent = config.phoneDisplay || '(570) 846-7988';
      el.setAttribute('href', config.phoneHref || 'tel:+15708467988');
    });
  });
})();
