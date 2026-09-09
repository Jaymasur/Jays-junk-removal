(() => {
  const config = window.JJR_CONFIG || {};
  const pricingTiers = [
    {
      id: 'quarter',
      label: '1/4 Trailer',
      shortLabel: '1/4',
      fill: 25,
      price: '$275',
      volume: 'Approximately 5 cubic yards',
      weight: 'Approximately 1,000 lb included',
      example: 'A small cleanout, a couch and chair with bags and boxes, a mattress set, or several miscellaneous household items.'
    },
    {
      id: 'third',
      label: '1/3 Trailer',
      shortLabel: '1/3',
      fill: 33,
      price: '$350',
      volume: 'Approximately 6.7 cubic yards',
      weight: 'Approximately 1,300 lb included',
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
      volume: 'Approximately 13.3 cubic yards',
      weight: 'Approximately 2,650 lb included',
      example: 'A substantial garage or basement cleanout, or several rooms of household items.'
    },
    {
      id: 'threequarters',
      label: '3/4 Trailer',
      shortLabel: '3/4',
      fill: 75,
      price: '$775',
      volume: '15 cubic yards',
      weight: '1.5 tons / 3,000 lb included',
      example: 'A large cleanout with furniture, appliances, boxes, bags, and mixed junk.'
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
    if (!isConfigured(config.gaMeasurementId) || window.gtag) return;

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
      if (!href || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http') || href.startsWith('//') || href.startsWith('#')) return;
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
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 18);
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

    document.querySelectorAll('[data-service-area-name]').forEach((el) => {
      const trackArea = () => {
        trackEvent('service_area_click', {
          location_name: el.dataset.serviceAreaName || ''
        });
      };
      el.addEventListener('click', trackArea);
      el.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') trackArea();
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
    const buttons = Array.from(controls.querySelectorAll('button[data-tier]'));

    function applyTier(id) {
      const tier = pricingTiers.find((item) => item.id === id) || pricingTiers[2];
      buttons.forEach((button) => {
        const active = button.dataset.tier === tier.id;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
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
      if (button) applyTier(button.dataset.tier);
    });

    controls.addEventListener('keydown', (event) => {
      const currentIndex = buttons.findIndex((button) => button.classList.contains('is-active'));
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (currentIndex + direction + buttons.length) % buttons.length;
      buttons[nextIndex].focus();
      applyTier(buttons[nextIndex].dataset.tier);
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

  function createPreviewCard(file) {
    const card = document.createElement('div');
    card.className = 'preview-card';
    const image = document.createElement('img');
    const previewUrl = URL.createObjectURL(file);
    const safePreviewUrl = new URL(previewUrl, window.location.href);
    if (safePreviewUrl.protocol !== 'blob:') {
      URL.revokeObjectURL(previewUrl);
      return card;
    }
    image.src = safePreviewUrl.href;
    image.alt = file.name;
    const label = document.createElement('span');
    label.textContent = file.name;
    image.addEventListener('load', () => {
      URL.revokeObjectURL(previewUrl);
    }, { once: true });
    card.append(image, label);
    return card;
  }

  async function compressImage(file) {
    if (!file.type.startsWith('image/') || file.size < 2_000_000 || typeof createImageBitmap !== 'function') return file;
    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const maxDimension = 1600;
    const scale = Math.min(1, maxDimension / Math.max(imageBitmap.width, imageBitmap.height));
    canvas.width = Math.round(imageBitmap.width * scale);
    canvas.height = Math.round(imageBitmap.height * scale);
    const context = canvas.getContext('2d');
    if (!context) return file;
    context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82));
    return blob ? new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }) : file;
  }

  function setupReviews() {
    const reviewSection = document.querySelector('[data-reviews-section]');
    if (!reviewSection) return;

    const reviewButtons = reviewSection.querySelectorAll('[data-google-reviews-link]');
    const reviewGrid = reviewSection.querySelector('[data-review-grid]');
    const reviewFeature = reviewSection.querySelector('[data-review-feature]');
    const reviewCtaCard = reviewSection.querySelector('[data-review-cta-card]');
    const featuredReviews = (config.featuredReviews || []).filter((review) => review.quote && review.reviewer);
    const hasReviewsUrl = isConfigured(config.googleReviewsUrl);

    if (!hasReviewsUrl && !featuredReviews.length) return;

    reviewSection.classList.remove('hidden');

    if (hasReviewsUrl) {
      reviewButtons.forEach((link) => {
        link.classList.remove('hidden');
        link.setAttribute('href', config.googleReviewsUrl);
      });
    }

    if (featuredReviews.length && reviewGrid && reviewFeature) {
      reviewFeature.classList.remove('hidden');
      const [first, ...rest] = featuredReviews;
      const featureText = reviewFeature.querySelector('[data-featured-review-text]');
      const featureReviewer = reviewFeature.querySelector('[data-featured-reviewer]');
      if (featureText) featureText.textContent = first.quote;
      if (featureReviewer) featureReviewer.textContent = `${first.reviewer}${first.location ? ` • ${first.location}` : ''}`;
      rest.slice(0, 2).forEach((review) => {
        const card = document.createElement('article');
        card.className = 'review-card';
        const body = document.createElement('div');
        body.className = 'review-body';
        const stars = document.createElement('div');
        stars.className = 'stars';
        stars.setAttribute('aria-label', 'Five star review');
        stars.textContent = '★★★★★';
        const quote = document.createElement('p');
        quote.textContent = `“${review.quote}”`;
        const reviewer = document.createElement('strong');
        reviewer.textContent = review.reviewer;
        const location = document.createElement('p');
        location.textContent = review.location || 'Verified customer';
        body.append(stars, quote, reviewer, location);
        card.appendChild(body);
        reviewGrid.appendChild(card);
      });
    } else if (reviewCtaCard) {
      reviewCtaCard.classList.remove('hidden');
    }
  }

  function setupBeforeAfter() {
    const section = document.querySelector('[data-before-after-section]');
    if (!section) return;
    const stage = section.querySelector('[data-before-after-stage]');
    const beforeImage = section.querySelector('[data-before-image]');
    const afterImage = section.querySelector('[data-after-image]');
    const range = section.querySelector('[data-before-after-range]');
    const title = section.querySelector('[data-before-after-title]');
    const copy = section.querySelector('[data-before-after-copy]');
    const servicesLink = section.querySelector('[data-before-after-service-link]');
    const locationText = section.querySelector('[data-before-after-location]');
    const divider = stage ? stage.querySelector('[data-before-after-divider]') : null;
    const handle = stage ? stage.querySelector('[data-before-after-handle]') : null;
    const pair = (config.beforeAfterProjects || [])[0];
    if (!pair || !pair.beforeImage || !pair.afterImage || !stage || !beforeImage || !afterImage || !range || !divider || !handle) return;

    section.classList.remove('hidden');
    beforeImage.src = pair.beforeImage;
    afterImage.src = pair.afterImage;
    beforeImage.alt = pair.beforeAlt || 'Before junk removal photo';
    afterImage.alt = pair.afterAlt || 'After junk removal photo';
    if (title) title.textContent = pair.title || 'Before & After';
    if (copy) copy.textContent = pair.description || 'A real before-and-after project from Jay’s Junk Removal.';
    if (locationText) locationText.textContent = pair.location || '';
    if (servicesLink && pair.serviceUrl) {
      servicesLink.href = pair.serviceUrl;
      servicesLink.classList.remove('hidden');
    }

    const updateSplit = (value) => {
      const percent = `${value}%`;
      stage.style.setProperty('--before-after-position', percent);
      afterImage.style.clipPath = `inset(0 0 0 ${percent})`;
      divider.style.left = percent;
      handle.style.left = percent;
    };

    updateSplit(range.value || 50);
    const track = () => trackEvent('before_after_interaction', {
      service_name: pair.serviceName || '',
      location_name: pair.location || ''
    });
    range.addEventListener('input', (event) => updateSplit(event.target.value));
    range.addEventListener('change', track);
    range.addEventListener('pointerup', track);
  }

  function setupPhotoQuote() {
    const form = document.querySelector('[data-photo-quote-form]');
    if (!form) return;

    const endpointNotice = document.querySelector('[data-photo-endpoint-notice]');
    const fileInput = form.querySelector('input[type="file"]');
    const previewGrid = form.querySelector('[data-preview-grid]');
    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('button[type="submit"]');

    if (!isConfigured(config.photoQuoteEndpoint) && endpointNotice) endpointNotice.classList.remove('hidden');

    if (fileInput && previewGrid) {
      fileInput.addEventListener('change', () => {
        previewGrid.innerHTML = '';
        Array.from(fileInput.files || []).slice(0, 6).forEach((file) => {
          previewGrid.appendChild(createPreviewCard(file));
        });
        if ((fileInput.files || []).length) trackEvent('photo_quote_start', { cta_location: 'photo-quote-form' });
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
          if (key !== 'photos' && value) payload.append(key, value);
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
        previewGrid.innerHTML = '';
        status.textContent = config.photoQuoteSuccessMessage || 'Thanks for sending your photos.';
        trackEvent('photo_quote_submit', { cta_location: 'photo-quote-form' });
      } catch (error) {
        status.textContent = 'There was a problem sending the request. Please call Jay or try again after the upload endpoint is configured.';
      } finally {
        submit.disabled = false;
        submit.textContent = 'Send Photos';
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
    setupReviews();
    setupBeforeAfter();
    setupPhotoQuote();

    document.querySelectorAll('[data-email]').forEach((el) => {
      const emailValue = config.email || 'jaysjunkremoval7@gmail.com';
      if (!el.textContent.trim() || el.textContent.includes('@')) el.textContent = emailValue;
      el.setAttribute('href', config.emailHref || `mailto:${emailValue}`);
    });

    document.querySelectorAll('[data-phone]').forEach((el) => {
      el.textContent = config.phoneDisplay || '(570) 846-7988';
      el.setAttribute('href', config.phoneHref || 'tel:+15708467988');
    });
  });
})();
