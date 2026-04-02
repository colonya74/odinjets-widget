/*!
 * OdinJets Empty Legs Widget v1.0.0
 * Héberger ce fichier sur GitHub → CDN jsDelivr
 * Usage : <script src="CDN_URL/widget.js" data-supabase-url="..." data-supabase-key="..." data-formspree-id="..."></script>
 */
(function () {
  'use strict';

  const script = document.currentScript;
  if (!script) { console.error('[OdinJets] Script tag introuvable.'); return; }

  const CFG = {
    supabaseUrl: (script.getAttribute('data-supabase-url') || '').replace(/\/$/, ''),
    supabaseKey: script.getAttribute('data-supabase-key') || '',
    formspreeId: script.getAttribute('data-formspree-id') || '',
    containerId: script.getAttribute('data-container') || 'oj-empty-legs',
  };

  // ─────────────────────────────────────────────
  // CSS (scopé sur #oj-empty-legs)
  // ─────────────────────────────────────────────
  const CSS = `
  #oj-empty-legs *, #oj-empty-legs *::before, #oj-empty-legs *::after { box-sizing: border-box; }
  #oj-empty-legs {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    width: 100%;
    max-width: 2000px;
    margin: 0 auto;
    padding: 20px;
    overflow: hidden;
    position: relative;
  }
  .oj-header { text-align: center; margin-bottom: 40px; animation: ojSlideDown 0.6s ease; }
  .oj-header h2 { font-size: 32px; font-weight: 700; margin: 0 0 12px; letter-spacing: -0.5px; color: white; }
  .oj-header p  { font-size: 16px; color: rgba(255,255,255,0.7); margin: 0; }

  /* Galerie desktop */
  .oj-gallery-desktop {
    display: flex; gap: 20px; overflow-x: auto;
    padding: 20px 40px; scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent;
    justify-content: center;
  }
  .oj-gallery-desktop::-webkit-scrollbar { height: 6px; }
  .oj-gallery-desktop::-webkit-scrollbar-track { background: transparent; }
  .oj-gallery-desktop::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }

  /* Carousel mobile */
  .oj-carousel { display: none; flex-direction: column; gap: 12px; }
  .oj-carousel-wrapper {
    display: flex; overflow-x: scroll; scroll-snap-type: x mandatory;
    scroll-behavior: smooth; -webkit-overflow-scrolling: touch;
    gap: 16px; padding: 0 8px; scrollbar-width: none;
  }
  .oj-carousel-wrapper::-webkit-scrollbar { display: none; }
  .oj-carousel-slide {
    flex: 0 0 calc(100% - 16px);
    scroll-snap-align: center; scroll-snap-stop: always;
  }
  .oj-carousel-controls {
    display: flex; justify-content: space-between; align-items: center;
    gap: 12px; padding: 0 10px;
  }
  .oj-carousel-btn {
    background: rgba(13,59,102,0.7); color: white; border: none;
    width: 44px; height: 44px; border-radius: 50%; cursor: pointer;
    font-size: 18px; transition: all 0.3s; display: flex;
    align-items: center; justify-content: center; flex-shrink: 0;
  }
  .oj-carousel-btn:hover  { background: rgba(13,59,102,1); transform: scale(1.1); }
  .oj-carousel-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: scale(1); }
  .oj-carousel-dots { display: flex; justify-content: center; gap: 8px; margin-top: 8px; }
  .oj-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: rgba(13,59,102,0.2); cursor: pointer; transition: all 0.3s;
    border: none; padding: 0;
  }
  .oj-dot.active { background: #0D3B66; width: 24px; border-radius: 4px; }

  /* Carte vol */
  .oj-flight-card {
    flex: 0 0 320px; background: #F5F3F0; border-radius: 22px; padding: 20px;
    border: 1px solid rgba(13,59,102,0.08); display: flex; flex-direction: column;
    gap: 16px; transition: all 0.3s; cursor: default;
    box-shadow: 0 2px 8px rgba(13,59,102,0.06);
  }
  .oj-flight-card:hover {
    background: #FAFAF8; border-color: rgba(237,176,26,0.2);
    transform: translateY(-8px); box-shadow: 0 12px 32px rgba(13,59,102,0.12);
  }
  .oj-aircraft-header {
    width: 100%; padding-bottom: 8px;
    border-bottom: 1px solid rgba(13,59,102,0.1); text-align: center;
  }
  .oj-aircraft-link {
    color: #EDB01A; text-decoration: none; font-weight: 700; font-size: 14px;
    letter-spacing: 0.3px; transition: color 0.3s;
  }
  .oj-aircraft-link:hover { color: #D69C00; text-decoration: underline; }
  .oj-flight-thumb {
    width: 100%; height: 180px; border-radius: 16px;
    object-fit: cover; background: #ccc; display: block;
  }
  .oj-flight-route {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 20px; font-weight: 700; gap: 12px;
  }
  .oj-route-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .oj-route-code { font-size: 18px; font-weight: 700; color: #0D3B66; }
  .oj-route-city { font-size: 12px; color: rgba(13,59,102,0.6); }
  .oj-arrow { color: rgba(13,59,102,0.3); font-size: 16px; }
  .oj-flight-info {
    display: flex; flex-direction: column; gap: 12px; padding: 12px 0;
    border-top: 1px solid rgba(13,59,102,0.08); border-bottom: 1px solid rgba(13,59,102,0.08);
  }
  .oj-info-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
  .oj-info-label { color: rgba(13,59,102,0.6); display: flex; align-items: center; gap: 6px; }
  .oj-info-value { font-weight: 600; color: #0D3B66; }
  .oj-flight-price { font-size: 28px; font-weight: 700; color: #0D3B66; text-align: center; margin: 8px 0; }
  .oj-book-btn {
    background: #0D3B66; color: white; border: none; border-radius: 10px;
    padding: 12px 20px; font-weight: 700; font-size: 14px; cursor: pointer;
    transition: all 0.3s; width: 100%; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .oj-book-btn:hover { background: #0a2e4d; box-shadow: 0 4px 16px rgba(13,59,102,0.4); transform: translateY(-2px); }
  .oj-book-btn:active { transform: translateY(0); }

  /* Overlay (formulaire + remerciement) */
  .oj-overlay {
    display: none; position: absolute; top: 0; left: 0;
    width: 100%; min-height: 100%; opacity: 0;
    transition: opacity 0.5s; z-index: 10; overflow-y: auto;
  }
  .oj-overlay.active { display: flex; opacity: 1; }
  .oj-overlay-wrapper {
    display: flex; align-items: center; justify-content: center;
    min-height: 100%; width: 100%; padding: 20px;
  }

  /* Formulaire */
  .oj-form-box {
    width: 100%; max-width: 600px; background: #F5F3F0; border-radius: 22px;
    padding: 40px; border: 1px solid rgba(13,59,102,0.08);
    box-shadow: 0 8px 32px rgba(13,59,102,0.08); animation: ojSlideRight 0.5s ease;
    position: relative;
  }
  .oj-form-close {
    position: absolute; top: 20px; right: 20px;
    background: rgba(13,59,102,0.1); color: #0D3B66; border: none;
    width: 40px; height: 40px; border-radius: 50%; font-size: 20px;
    cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s;
  }
  .oj-form-close:hover { background: rgba(13,59,102,0.2); }
  .oj-form-header { text-align: center; margin-bottom: 30px; }
  .oj-form-header h3 { font-size: 28px; font-weight: 700; margin: 0 0 8px; color: #0D3B66; }
  .oj-form-header p  { font-size: 14px; color: rgba(13,59,102,0.6); margin: 0; }
  .oj-flight-summary {
    background: rgba(237,176,26,0.08); border: 1px solid rgba(237,176,26,0.25);
    border-radius: 12px; padding: 12px; margin-bottom: 20px;
    font-size: 13px; text-align: center; color: #0D3B66;
  }
  .oj-flight-summary strong { color: #D69C00; }
  .oj-form-group { margin-bottom: 16px; display: flex; flex-direction: column; gap: 6px; }
  .oj-form-label { font-size: 13px; font-weight: 600; color: #0D3B66; text-transform: uppercase; letter-spacing: 0.5px; }
  .oj-form-input, .oj-form-textarea {
    background: rgba(13,59,102,0.04); border: 1px solid rgba(13,59,102,0.15);
    border-radius: 10px; padding: 12px; color: #0D3B66;
    font-family: inherit; font-size: 14px; transition: all 0.3s;
  }
  .oj-form-input::placeholder, .oj-form-textarea::placeholder { color: rgba(13,59,102,0.4); }
  .oj-form-input:focus, .oj-form-textarea:focus {
    outline: none; background: rgba(13,59,102,0.08);
    border-color: rgba(13,59,102,0.3); box-shadow: 0 0 0 3px rgba(237,176,26,0.1);
  }
  .oj-form-textarea { resize: vertical; min-height: 100px; font-family: inherit; }
  .oj-form-disclaimer {
    font-size: 11px; color: rgba(13,59,102,0.5);
    text-align: center; margin-top: 16px; line-height: 1.5;
  }
  .oj-form-buttons {
    display: flex; gap: 12px; margin-top: 24px;
    align-items: center; justify-content: space-between;
  }
  .oj-form-buttons button {
    flex: 1; padding: 0 20px; border-radius: 10px; font-weight: 700;
    font-size: 13px; cursor: pointer; transition: all 0.3s; border: none;
    text-transform: uppercase; letter-spacing: 0.5px; height: 48px;
    display: flex; align-items: center; justify-content: center;
  }
  .oj-btn-submit { background: #0D3B66; color: white; }
  .oj-btn-submit:hover { background: #0a2e4d; box-shadow: 0 4px 16px rgba(13,59,102,0.4); }
  .oj-btn-back  { background: rgba(13,59,102,0.1); color: #0D3B66; }
  .oj-btn-back:hover { background: rgba(13,59,102,0.15); }

  /* Page remerciement */
  .oj-thanks-box {
    width: 100%; max-width: 500px; background: #F5F3F0; border-radius: 22px;
    padding: 60px 40px; border: 1px solid rgba(13,59,102,0.08);
    box-shadow: 0 8px 32px rgba(13,59,102,0.08); text-align: center;
    animation: ojSlideUp 0.5s ease;
  }
  .oj-thanks-icon { font-size: 64px; color: #EDB01A; margin-bottom: 20px; }
  .oj-thanks-box h3 { font-size: 32px; font-weight: 700; margin: 0 0 12px; color: #0D3B66; }
  .oj-thanks-box p  { font-size: 15px; color: rgba(13,59,102,0.7); line-height: 1.6; margin: 0 0 30px; }
  .oj-btn-home {
    background: #0D3B66; color: white; border: none; border-radius: 10px;
    padding: 12px 30px; font-weight: 700; font-size: 14px; cursor: pointer;
    transition: all 0.3s; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .oj-btn-home:hover { background: #0a2e4d; box-shadow: 0 4px 16px rgba(13,59,102,0.4); }

  /* Animations */
  @keyframes ojSlideDown  { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ojSlideRight { from { opacity:0; transform:translateX(30px);  } to { opacity:1; transform:translateX(0); } }
  @keyframes ojSlideUp    { from { opacity:0; transform:translateY(20px);  } to { opacity:1; transform:translateY(0); } }

  /* Responsive */
  @media (max-width: 768px) {
    #oj-empty-legs { padding: 10px; }
    .oj-header h2 { font-size: 24px; }
    .oj-flight-card { flex: 0 0 280px; padding: 16px; }
    .oj-form-box { padding: 30px 20px; }
    .oj-thanks-box { padding: 40px 20px; }
  }
  @media (max-width: 480px) {
    .oj-gallery-wrapper { display: none !important; }
    .oj-carousel        { display: flex !important; }
    .oj-header h2 { font-size: 20px; }
    .oj-header p  { font-size: 14px; }
    .oj-carousel-slide .oj-flight-thumb  { height: 160px; border-radius: 14px; }
    .oj-carousel-slide .oj-flight-price  { font-size: 18px; }
    .oj-carousel-slide .oj-book-btn      { font-size: 12px; }
    .oj-form-box { padding: 25px 16px; border-radius: 16px; }
    .oj-form-header h3 { font-size: 24px; }
    .oj-form-input, .oj-form-textarea { font-size: 16px; }
    .oj-form-buttons button { height: 44px; font-size: 12px; }
    .oj-thanks-icon { font-size: 48px; }
    .oj-thanks-box h3 { font-size: 24px; }
    .oj-thanks-box p  { font-size: 14px; }
  }
  `;

  // ─────────────────────────────────────────────
  // Traductions
  // ─────────────────────────────────────────────
  const TRANS = {
    fr: { name:'Nom *', name_ph:'Votre nom complet', email:'E-mail *', email_ph:'votre@email.com',
          phone:'Téléphone *', phone_ph:'+41 XX XXX XX XX', msg:'Message', msg_ph:'Informations supplémentaires...',
          submit:'Envoyer', back:'Retour', duration:'Durée', seats:'Sièges', book:'Réserver ce vol',
          title:'Vols Empty Legs', subtitle:'Offres promotionnelles de la semaine',
          form_title:'Réserver votre vol', form_sub:'Complétez vos informations',
          thanks_title:'Merci !', thanks_msg:'Votre demande a été reçue. Notre équipe vous contactera dans les 24h.',
          back_home:'Retour à l\'accueil' },
    en: { name:'Name *', name_ph:'Your full name', email:'Email *', email_ph:'your@email.com',
          phone:'Phone *', phone_ph:'+41 XX XXX XX XX', msg:'Message', msg_ph:'Additional information...',
          submit:'Send', back:'Back', duration:'Duration', seats:'Seats', book:'Book this flight',
          title:'Empty Leg Flights', subtitle:'Weekly promotional offers',
          form_title:'Book your flight', form_sub:'Complete your details',
          thanks_title:'Thank you!', thanks_msg:'Your request has been received. Our team will contact you within 24 hours.',
          back_home:'Back to home' },
    de: { name:'Name *', name_ph:'Ihr vollständiger Name', email:'E-Mail *', email_ph:'ihre@email.com',
          phone:'Telefon *', phone_ph:'+41 XX XXX XX XX', msg:'Nachricht', msg_ph:'Zusätzliche Informationen...',
          submit:'Senden', back:'Zurück', duration:'Dauer', seats:'Sitze', book:'Diesen Flug buchen',
          title:'Empty Leg Flüge', subtitle:'Wöchentliche Sonderangebote',
          form_title:'Flug buchen', form_sub:'Bitte Angaben vervollständigen',
          thanks_title:'Danke!', thanks_msg:'Ihre Anfrage wurde erhalten. Unser Team kontaktiert Sie innerhalb von 24 Stunden.',
          back_home:'Zurück zur Startseite' },
    es: { name:'Nombre *', name_ph:'Tu nombre completo', email:'Correo *', email_ph:'tu@email.com',
          phone:'Teléfono *', phone_ph:'+41 XX XXX XX XX', msg:'Mensaje', msg_ph:'Información adicional...',
          submit:'Enviar', back:'Atrás', duration:'Duración', seats:'Asientos', book:'Reservar este vuelo',
          title:'Vuelos Empty Leg', subtitle:'Ofertas de la semana',
          form_title:'Reservar vuelo', form_sub:'Complete sus datos',
          thanks_title:'¡Gracias!', thanks_msg:'Su solicitud ha sido recibida. Nuestro equipo le contactará en 24 horas.',
          back_home:'Volver al inicio' },
  };

  function getLang() {
    try {
      if (typeof Weglot !== 'undefined' && Weglot.getCurrentLang) return Weglot.getCurrentLang().split('-')[0].toLowerCase();
    } catch(e) {}
    return (document.documentElement.lang || 'fr').split('-')[0].toLowerCase();
  }

  function t(key) {
    const lang = getLang();
    return (TRANS[lang] || TRANS.fr)[key] || TRANS.fr[key] || key;
  }

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────
  function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect fill='%23e0ddd8' width='320' height='180'/%3E%3Ctext x='50%25' y='50%25' fill='%23aaa' text-anchor='middle' dy='.3em' font-size='14' font-family='sans-serif'%3EPhoto manquante%3C/text%3E%3C/svg%3E";

  // ─────────────────────────────────────────────
  // Supabase REST API (lecture seule, anon key)
  // ─────────────────────────────────────────────
  async function fetchFlights() {
    const url = `${CFG.supabaseUrl}/rest/v1/flights?select=*&active=eq.true&order=sort_order.asc,id.asc`;
    const res = await fetch(url, {
      headers: {
        'apikey': CFG.supabaseKey,
        'Authorization': `Bearer ${CFG.supabaseKey}`,
      }
    });
    if (!res.ok) throw new Error(`Supabase ${res.status}`);
    return res.json();
  }

  // ─────────────────────────────────────────────
  // Génération HTML d'une carte
  // ─────────────────────────────────────────────
  function buildCard(flight, extraClass) {
    const cls = extraClass ? ` ${extraClass}` : '';
    return `
      <div class="oj-flight-card${cls}">
        <div class="oj-aircraft-header">
          <a href="${esc(flight.aircraft_url || '#')}" class="oj-aircraft-link">${esc(flight.aircraft || '')}</a>
        </div>
        <img class="oj-flight-thumb"
          src="${esc(flight.image || PLACEHOLDER_IMG)}"
          alt="${esc(flight.from)} → ${esc(flight.to)}"
          onerror="this.src='${PLACEHOLDER_IMG}'">
        <div class="oj-flight-route">
          <div class="oj-route-item">
            <div class="oj-route-code">${esc(flight.from)}</div>
            <div class="oj-route-city">${esc(flight.from_city)}</div>
          </div>
          <div class="oj-arrow">✈️</div>
          <div class="oj-route-item">
            <div class="oj-route-code">${esc(flight.to)}</div>
            <div class="oj-route-city">${esc(flight.to_city)}</div>
          </div>
        </div>
        <div class="oj-flight-info">
          <div class="oj-info-row">
            <span class="oj-info-label"><i class="fas fa-clock"></i> ${t('duration')}</span>
            <span class="oj-info-value">${esc(flight.duration || '')}</span>
          </div>
          <div class="oj-info-row">
            <span class="oj-info-label"><i class="fas fa-users"></i> ${t('seats')}</span>
            <span class="oj-info-value">${flight.seats || ''}</span>
          </div>
        </div>
        <div class="oj-flight-price">${Number(flight.price || 0).toLocaleString()} ${esc(flight.currency || 'CHF')}</div>
        <button class="oj-book-btn" data-id="${flight.id}">${t('book')}</button>
      </div>`;
  }

  // ─────────────────────────────────────────────
  // Skeleton HTML du widget
  // ─────────────────────────────────────────────
  function buildSkeleton() {
    return `
      <!-- Galerie section -->
      <div id="oj-gallery-section">
        <div class="oj-header">
          <h2>${t('title')}</h2>
          <p>${t('subtitle')}</p>
        </div>
        <div class="oj-gallery-wrapper" id="oj-gallery-wrapper">
          <div class="oj-gallery-desktop" id="oj-gallery-desktop"></div>
        </div>
        <div class="oj-carousel" id="oj-carousel">
          <div class="oj-carousel-wrapper" id="oj-carousel-wrapper"></div>
          <div class="oj-carousel-controls">
            <button class="oj-carousel-btn" id="oj-prev" title="Précédent"><i class="fas fa-chevron-left"></i></button>
            <div class="oj-carousel-dots" id="oj-carousel-dots"></div>
            <button class="oj-carousel-btn" id="oj-next" title="Suivant"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>

      <!-- Formulaire de contact -->
      <div class="oj-overlay" id="oj-form-section">
        <div class="oj-overlay-wrapper">
          <div class="oj-form-box">
            <button class="oj-form-close" id="oj-close-form">&times;</button>
            <div class="oj-form-header">
              <h3>${t('form_title')}</h3>
              <p>${t('form_sub')}</p>
            </div>
            <div class="oj-flight-summary" id="oj-flight-summary"></div>
            <form id="oj-contact-form">
              <div class="oj-form-group">
                <label class="oj-form-label">${t('name')}</label>
                <input type="text" name="name" class="oj-form-input" required placeholder="${t('name_ph')}">
              </div>
              <div class="oj-form-group">
                <label class="oj-form-label">${t('email')}</label>
                <input type="email" name="email" class="oj-form-input" required placeholder="${t('email_ph')}">
              </div>
              <div class="oj-form-group">
                <label class="oj-form-label">${t('phone')}</label>
                <input type="tel" name="phone" class="oj-form-input" required placeholder="${t('phone_ph')}">
              </div>
              <div class="oj-form-group">
                <label class="oj-form-label">${t('msg')}</label>
                <textarea name="message" class="oj-form-textarea" placeholder="${t('msg_ph')}"></textarea>
              </div>
              <input type="hidden" name="flight_info" id="oj-flight-hidden">
              <p class="oj-form-disclaimer">
                This empty leg flight is subject to availability. Confirmation will be provided within 24 hours.
              </p>
              <div class="oj-form-buttons">
                <button type="submit" class="oj-btn-submit">${t('submit')}</button>
                <button type="button" class="oj-btn-back" id="oj-back-btn">${t('back')}</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Remerciement -->
      <div class="oj-overlay" id="oj-thanks-section">
        <div class="oj-overlay-wrapper">
          <div class="oj-thanks-box">
            <div class="oj-thanks-icon">✈️</div>
            <h3>${t('thanks_title')}</h3>
            <p>${t('thanks_msg')}</p>
            <button class="oj-btn-home" id="oj-home-btn">${t('back_home')}</button>
          </div>
        </div>
      </div>`;
  }

  // ─────────────────────────────────────────────
  // Rendu galerie + carousel
  // ─────────────────────────────────────────────
  let flights = [];

  function renderDesktop() {
    const gallery = document.getElementById('oj-gallery-desktop');
    if (!gallery) return;
    gallery.innerHTML = flights.map(f => buildCard(f)).join('');
    gallery.querySelectorAll('.oj-book-btn').forEach(btn => {
      btn.addEventListener('click', () => openForm(getFlight(btn.dataset.id)));
    });
  }

  function renderCarousel() {
    const wrapper = document.getElementById('oj-carousel-wrapper');
    const dots    = document.getElementById('oj-carousel-dots');
    if (!wrapper) return;
    wrapper.innerHTML = flights.map(f => `<div class="oj-carousel-slide">${buildCard(f)}</div>`).join('');
    wrapper.querySelectorAll('.oj-book-btn').forEach(btn => {
      btn.addEventListener('click', () => openForm(getFlight(btn.dataset.id)));
    });
    if (dots) {
      dots.innerHTML = flights.map((_, i) =>
        `<button class="oj-dot${i===0?' active':''}" data-i="${i}"></button>`
      ).join('');
      dots.querySelectorAll('.oj-dot').forEach(dot => {
        dot.addEventListener('click', () => scrollCarouselTo(parseInt(dot.dataset.i)));
      });
    }
    const prev = document.getElementById('oj-prev');
    const next = document.getElementById('oj-next');
    if (prev) prev.addEventListener('click', () => {
      const cw = slideWidth(); wrapper.scrollBy({ left: -cw, behavior: 'smooth' });
    });
    if (next) next.addEventListener('click', () => {
      const cw = slideWidth(); wrapper.scrollBy({ left: cw, behavior: 'smooth' });
    });
    wrapper.addEventListener('scroll', updateDots);
  }

  function slideWidth() {
    const slide = document.querySelector('#oj-carousel-wrapper .oj-carousel-slide');
    return slide ? slide.offsetWidth + 16 : 320;
  }

  function scrollCarouselTo(i) {
    const wrapper = document.getElementById('oj-carousel-wrapper');
    if (wrapper) wrapper.scrollTo({ left: i * slideWidth(), behavior: 'smooth' });
  }

  function updateDots() {
    const wrapper = document.getElementById('oj-carousel-wrapper');
    if (!wrapper) return;
    const i = Math.round(wrapper.scrollLeft / slideWidth());
    document.querySelectorAll('#oj-carousel-dots .oj-dot').forEach((d, idx) => {
      d.classList.toggle('active', idx === i);
    });
    const prev = document.getElementById('oj-prev');
    const next = document.getElementById('oj-next');
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === flights.length - 1;
  }

  function updateLayout() {
    const isMobile = window.innerWidth <= 480;
    const wrapper   = document.getElementById('oj-gallery-wrapper');
    const carousel  = document.getElementById('oj-carousel');
    if (wrapper) wrapper.style.display = isMobile ? 'none' : '';
    if (carousel) carousel.style.display = isMobile ? 'flex' : 'none';
  }

  // ─────────────────────────────────────────────
  // Formulaire
  // ─────────────────────────────────────────────
  function getFlight(id) {
    return flights.find(f => String(f.id) === String(id));
  }

  function showGallery() {
    const gallery = document.getElementById('oj-gallery-section');
    const form    = document.getElementById('oj-form-section');
    const thanks  = document.getElementById('oj-thanks-section');
    if (gallery) { gallery.style.opacity='1'; gallery.style.transform='translateX(0)'; }
    if (form)   form.classList.remove('active');
    if (thanks) thanks.classList.remove('active');
    document.getElementById('oj-contact-form')?.reset();
  }

  function openForm(flight) {
    if (!flight) return;
    const summary = document.getElementById('oj-flight-summary');
    const hidden  = document.getElementById('oj-flight-hidden');
    const gallery = document.getElementById('oj-gallery-section');
    if (summary) summary.innerHTML =
      `<strong>${esc(flight.from)} → ${esc(flight.to)}</strong> | ${esc(flight.duration)} | ${esc(flight.aircraft)}`;
    if (hidden) hidden.value = `${flight.from} - ${flight.to} | ${flight.aircraft} | ${flight.price} ${flight.currency}`;
    if (gallery) {
      gallery.style.transition = 'all 0.5s ease';
      gallery.style.opacity    = '0';
      gallery.style.transform  = 'translateX(-100%)';
    }
    document.getElementById('oj-form-section')?.classList.add('active');
  }

  function attachFormListeners() {
    document.getElementById('oj-close-form')?.addEventListener('click', showGallery);
    document.getElementById('oj-back-btn')?.addEventListener('click', showGallery);
    document.getElementById('oj-home-btn')?.addEventListener('click', showGallery);

    document.getElementById('oj-contact-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('.oj-btn-submit');
      if (btn) { btn.disabled = true; btn.textContent = '...'; }

      const fd = new FormData(e.target);
      const data = {
        name: fd.get('name'), email: fd.get('email'),
        phone: fd.get('phone'), message: fd.get('message'),
        flight_info: fd.get('flight_info'),
      };

      try {
        const endpoint = CFG.formspreeId
          ? `https://formspree.io/f/${CFG.formspreeId}`
          : null;
        if (!endpoint) throw new Error('No Formspree ID configured');

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        document.getElementById('oj-form-section')?.classList.remove('active');
        document.getElementById('oj-thanks-section')?.classList.add('active');
      } catch (err) {
        console.error('[OdinJets] Form error:', err);
        alert('Erreur lors de l\'envoi. Veuillez réessayer.');
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = t('submit'); }
      }
    });
  }

  // ─────────────────────────────────────────────
  // Init
  // ─────────────────────────────────────────────
  function injectCSS() {
    if (document.getElementById('oj-widget-styles')) return;
    const style = document.createElement('style');
    style.id = 'oj-widget-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  async function init() {
    injectCSS();
    const container = document.getElementById(CFG.containerId);
    if (!container) {
      console.error(`[OdinJets] Conteneur #${CFG.containerId} introuvable dans la page.`);
      return;
    }
    container.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:40px">Chargement...</p>';

    try {
      flights = await fetchFlights();
    } catch (err) {
      console.error('[OdinJets] Erreur Supabase:', err);
      container.innerHTML = '<p style="color:rgba(255,255,255,0.4);text-align:center;padding:40px">Vols temporairement indisponibles.</p>';
      return;
    }

    container.innerHTML = buildSkeleton();
    renderDesktop();
    renderCarousel();
    attachFormListeners();
    updateLayout();
    window.addEventListener('resize', updateLayout);

    if (typeof Weglot !== 'undefined') {
      document.addEventListener('weglot:language_changed', () => {
        setTimeout(() => {
          container.innerHTML = buildSkeleton();
          renderDesktop();
          renderCarousel();
          attachFormListeners();
          updateLayout();
        }, 150);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
