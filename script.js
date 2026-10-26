/* ============================================================
   FoodFinder — script.js
   Vanilla JS. No build step, no backend.
   ============================================================ */

/* ------------------------------------------------------------
   1. CATEGORY CONFIG
   One source of truth for label, icon, and color everywhere.
   ------------------------------------------------------------ */
const CATEGORIES = {
  pantry:         { label: 'Food pantry',              icon: '🥫', color: '#2f855a' },
  soup_kitchen:   { label: 'Soup kitchen / meals',     icon: '🍲', color: '#c05621' },
  fridge:         { label: 'Community fridge',         icon: '🧊', color: '#2b6cb0' },
  snap_office:    { label: 'SNAP / WIC office',        icon: '🏛️', color: '#6b46c1' },
  school_meals:   { label: 'School meals',             icon: '🎒', color: '#0d9488' },
  senior_meals:   { label: 'Senior meal delivery',     icon: '🚚', color: '#b83280' },
  farmers_market: { label: 'Farmers market (SNAP/EBT)',icon: '🧺', color: '#8a7a1f' },
  faith_food:     { label: 'Faith-based food program', icon: '⛪', color: '#4c51bf' },
  mobile_pantry:  { label: 'Mobile food pantry',       icon: '🚐', color: '#4a5568' },
};

/* ------------------------------------------------------------
   2. DATA
   ⚠️  DEMO PLACEHOLDERS. These are plausible Austin-area entries
   for building/demoing the app. VERIFY every address, phone, and
   hour against the organization's own site before you present
   this as a real directory.

   hours: array of 7 (index 0 = Sunday … 6 = Saturday).
   Each day is null (closed) or a list of [open, close] "HH:MM" 24h.
   ------------------------------------------------------------ */
const RESOURCES = [
  {
    id: 'central-tx-partner-pantry',
    name: 'Central Texas Partner Pantry',
    type: 'pantry',
    lat: 30.2621, lng: -97.7296,
    address: '6500 Manor Rd, Austin, TX 78723',
    phone: '(512) 555-0101',
    website: 'https://example.org',
    hours: [null, [['09:00','13:00']], [['09:00','13:00']], [['09:00','13:00']], [['09:00','13:00'],['17:00','19:00']], [['09:00','12:00']], [['10:00','12:00']]],
    eligibility_notes: 'Open to anyone in Travis County. No proof of income required for the first visit.',
    languages: ['English', 'Spanish'],
    requires_id: false,
    bring: 'Walk-in — no appointment. Bring a photo ID if you have one; it is not required on a first visit.',
    notes: 'Parking in the rear lot. Entrance on the east side of the building.'
  },
  {
    id: 'eastside-community-fridge',
    name: 'Eastside Community Fridge',
    type: 'fridge',
    lat: 30.2640, lng: -97.7190,
    address: '1200 E 12th St, Austin, TX 78702',
    phone: '',
    website: 'https://example.org',
    hours: [ [['00:00','23:59']], [['00:00','23:59']], [['00:00','23:59']], [['00:00','23:59']], [['00:00','23:59']], [['00:00','23:59']], [['00:00','23:59']] ],
    eligibility_notes: 'Always open, no questions asked, no paperwork. Take what you need.',
    languages: ['English', 'Spanish'],
    requires_id: false,
    bring: 'Nothing. Just bring a bag. Take what you need, leave what you can.',
    notes: 'Located on the sidewalk under the shade structure. Stocked by volunteers daily.'
  },
  {
    id: 'st-marys-soup-kitchen',
    name: "St. Mary's Soup Kitchen",
    type: 'soup_kitchen',
    lat: 30.2715, lng: -97.7400,
    address: '501 W 10th St, Austin, TX 78701',
    phone: '(512) 555-0102',
    website: 'https://example.org',
    hours: [ [['11:30','13:00']], [['11:30','13:00']], [['11:30','13:00']], [['11:30','13:00']], [['11:30','13:00']], [['11:30','13:00']], null ],
    eligibility_notes: 'Hot lunch served to anyone who comes. No registration, no income check.',
    languages: ['English', 'Spanish'],
    requires_id: false,
    bring: 'Walk-in. No ID, no appointment, no questions.',
    notes: 'Line forms on the north side of the building. Seating is indoors.'
  },
  {
    id: 'hhsc-snap-north',
    name: 'HHSC Benefits Office — North Austin',
    type: 'snap_office',
    lat: 30.3400, lng: -97.7220,
    address: '8711 Burnet Rd, Austin, TX 78757',
    phone: '(512) 555-0103',
    website: 'https://example.org',
    hours: [null, [['08:00','17:00']], [['08:00','17:00']], [['08:00','17:00']], [['08:00','17:00']], [['08:00','17:00']], null],
    eligibility_notes: 'Handles SNAP and Medicaid applications. Income-based; see the Get Help page for a plain-language overview.',
    languages: ['English', 'Spanish', 'Vietnamese'],
    requires_id: true,
    bring: 'Photo ID, proof of address, pay stubs or benefit letter, and Social Security numbers for household members. You can start an application without every document.',
    notes: 'Appointments recommended — walk-ins are seen as time allows. Interpreter available on request.'
  },
  {
    id: 'aisd-summer-meals',
    name: 'AISD Free Summer Meals',
    type: 'school_meals',
    lat: 30.2810, lng: -97.7320,
    address: '1111 W 6th St, Austin, TX 78703',
    phone: '(512) 555-0104',
    website: 'https://example.org',
    hours: [null, [['07:30','09:00'],['11:00','13:00']], [['07:30','09:00'],['11:00','13:00']], [['07:30','09:00'],['11:00','13:00']], [['07:30','09:00'],['11:00','13:00']], [['07:30','09:00'],['11:00','13:00']], null],
    eligibility_notes: 'Free for anyone 18 and under. No registration, no ID, no proof of address.',
    languages: ['English', 'Spanish'],
    requires_id: false,
    bring: 'Nothing. Kids can just show up. Adults may accompany children.',
    notes: 'Summer only — runs from early June through mid-August. Sites change yearly; confirm the current list.'
  },
  {
    id: 'meals-on-wheels',
    name: 'Meals on Wheels Central Texas',
    type: 'senior_meals',
    lat: 30.3200, lng: -97.7100,
    address: '3227 E 5th St, Austin, TX 78702',
    phone: '(512) 555-0105',
    website: 'https://example.org',
    hours: [null, [['08:00','16:00']], [['08:00','16:00']], [['08:00','16:00']], [['08:00','16:00']], [['08:00','16:00']], null],
    eligibility_notes: 'Homebound adults 60+ and adults with disabilities. A phone screening determines eligibility.',
    languages: ['English', 'Spanish'],
    requires_id: true,
    bring: 'Call to request an assessment. Have your address, date of birth, and a doctor or caseworker contact ready if possible.',
    notes: 'Delivery routes run weekdays. Some routes offer frozen weekend meals.'
  },
  {
    id: 'sfc-farmers-market',
    name: "SFC Farmers' Market — Sunset Valley",
    type: 'farmers_market',
    lat: 30.2290, lng: -97.8190,
    address: '3200 Jones Rd, Austin, TX 78745',
    phone: '(512) 555-0106',
    website: 'https://example.org',
    hours: [null, null, null, null, null, null, [['09:00','13:00']]],
    eligibility_notes: 'Accepts SNAP/EBT. Many vendors participate in Double Up Food Bucks — $1 of SNAP can become $2 of produce.',
    languages: ['English', 'Spanish'],
    requires_id: false,
    bring: 'Bring your EBT card. Stop at the info booth first to get tokens.',
    notes: 'Saturdays year-round, rain or shine. Free parking on site.'
  },
  {
    id: 'dove-springs-mobile',
    name: 'Dove Springs Mobile Pantry',
    type: 'mobile_pantry',
    lat: 30.1910, lng: -97.7610,
    address: '5801 Ainez Dr, Austin, TX 78744',
    phone: '(512) 555-0107',
    website: 'https://example.org',
    hours: [null, null, [['15:00','18:00']], null, null, null, null],
    eligibility_notes: 'Open to all. Priority given to residents of the Dove Springs area.',
    languages: ['English', 'Spanish'],
    requires_id: false,
    bring: 'Walk-in. Bring your own bags or a cart if you can — supplies are limited.',
    notes: 'The truck parks in the school lot. Arrive early; produce runs out. Schedule shifts monthly.'
  },
  {
    id: 'hope-lutheran-pantry',
    name: 'Hope Lutheran Food Pantry',
    type: 'faith_food',
    lat: 30.3050, lng: -97.7500,
    address: '3500 Portales Dr, Austin, TX 78723',
    phone: '(512) 555-0108',
    website: 'https://example.org',
    hours: [null, [['10:00','14:00']], null, [['10:00','14:00']], null, [['10:00','14:00']], [['09:00','11:00']]],
    eligibility_notes: 'Serves households in the surrounding ZIP codes. One visit per week.',
    languages: ['English'],
    requires_id: true,
    bring: 'Photo ID and proof of address (a utility bill or lease). Appointment not required.',
    notes: 'Enter through the fellowship hall doors on the east side. Volunteer-run.'
  },
  {
    id: 'south-austin-fridge',
    name: 'South Austin Community Fridge',
    type: 'fridge',
    lat: 30.2380, lng: -97.7790,
    address: '1901 Bluebonnet Ln, Austin, TX 78704',
    phone: '',
    website: 'https://example.org',
    hours: [ [['00:00','23:59']], [['00:00','23:59']], [['00:00','23:59']], [['00:00','23:59']], [['00:00','23:59']], [['00:00','23:59']], [['00:00','23:59']] ],
    eligibility_notes: 'Always open. No eligibility rules, no registration.',
    languages: ['English', 'Spanish'],
    requires_id: false,
    bring: 'Nothing. Take what you need.',
    notes: 'Two fridges plus a dry-goods shelf. Please close the door firmly.'
  },
  {
    id: 'caritas-community-kitchen',
    name: 'Caritas Community Kitchen',
    type: 'soup_kitchen',
    lat: 30.2695, lng: -97.7310,
    address: '611 Neches St, Austin, TX 78701',
    phone: '(512) 555-0109',
    website: 'https://example.org',
    hours: [ [['11:00','12:30']], [['11:00','12:30']], [['11:00','12:30']], [['11:00','12:30']], [['11:00','12:30']], [['11:00','12:30']], [['11:00','12:30']] ],
    eligibility_notes: 'Free lunch for anyone. No ID, no income requirement.',
    languages: ['English', 'Spanish'],
    requires_id: false,
    bring: 'Walk-in only.',
    notes: 'Served daily including weekends. Case management and ID services available on site.'
  },
  {
    id: 'ut-outpost',
    name: 'UT Outpost Campus Pantry',
    type: 'pantry',
    lat: 30.2849, lng: -97.7341,
    address: '100 W Dean Keeton St, Austin, TX 78712',
    phone: '(512) 555-0110',
    website: 'https://example.org',
    hours: [null, [['10:00','18:00']], [['10:00','18:00']], [['10:00','18:00']], [['10:00','18:00']], [['10:00','16:00']], null],
    eligibility_notes: 'Currently enrolled students with a UT ID. No income verification.',
    languages: ['English', 'Spanish'],
    requires_id: true,
    bring: 'Student ID. Walk-in, no appointment.',
    notes: 'Also offers a professional clothing closet. Located in the student services building, ground floor.'
  },
  {
    id: 'mueller-fridge',
    name: 'Mueller Community Fridge',
    type: 'fridge',
    lat: 30.2985, lng: -97.7050,
    address: '4550 Mueller Blvd, Austin, TX 78723',
    phone: '',
    website: 'https://example.org',
    hours: [ [['00:00','23:59']], [['00:00','23:59']], [['00:00','23:59']], [['00:00','23:59']], [['00:00','23:59']], [['00:00','23:59']], [['00:00','23:59']] ],
    eligibility_notes: 'Open to all, any time.',
    languages: ['English', 'Spanish'],
    requires_id: false,
    bring: 'Nothing. Bags recommended.',
    notes: 'Next to the park pavilion. Volunteers restock most mornings.'
  },
  {
    id: 'round-rock-serving-center',
    name: 'Round Rock Area Serving Center',
    type: 'pantry',
    lat: 30.5083, lng: -97.6789,
    address: '1099 E Main St, Round Rock, TX 78664',
    phone: '(512) 555-0111',
    website: 'https://example.org',
    hours: [null, [['09:00','15:00']], [['09:00','15:00']], [['09:00','15:00']], [['09:00','15:00']], [['09:00','15:00']], [['09:00','12:00']]],
    eligibility_notes: 'Serves Round Rock, Cedar Park, and north Travis County. One pantry visit every 30 days.',
    languages: ['English', 'Spanish'],
    requires_id: true,
    bring: 'Photo ID, proof of address, and household size information. Appointment recommended.',
    notes: 'Also operates a thrift store that funds the pantry.'
  },
  {
    id: 'wic-clinic-south',
    name: 'WIC Clinic — South Austin',
    type: 'snap_office',
    lat: 30.2295, lng: -97.7550,
    address: '2500 S 1st St, Austin, TX 78704',
    phone: '(512) 555-0112',
    website: 'https://example.org',
    hours: [null, [['08:00','16:30']], [['08:00','16:30']], [['08:00','16:30']], [['08:00','16:30']], [['08:00','16:30']], null],
    eligibility_notes: 'Pregnant and postpartum parents, infants, and children under 5. Income-based plus a nutrition assessment at the appointment.',
    languages: ['English', 'Spanish'],
    requires_id: true,
    bring: 'Photo ID, proof of address, proof of income, and bring your child if they are being enrolled.',
    notes: 'Call ahead to schedule — walk-in availability varies.'
  },
  {
    id: 'baptist-community-pantry',
    name: 'Baptist Community Pantry',
    type: 'faith_food',
    lat: 30.2500, lng: -97.7100,
    address: '901 E Cesar Chavez St, Austin, TX 78702',
    phone: '(512) 555-0113',
    website: 'https://example.org',
    hours: [null, null, [['13:00','17:00']], null, [['13:00','17:00']], null, [['09:00','12:00']]],
    eligibility_notes: 'No income requirement. Serving all of East Austin.',
    languages: ['English', 'Spanish'],
    requires_id: false,
    bring: 'Walk-in. No ID required.',
    notes: 'Fresh produce on Saturdays. Volunteers welcome.'
  }
];

/* ------------------------------------------------------------
   3. HOURS HELPERS
   ------------------------------------------------------------ */
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function fmtTime(hhmm) {
  if (hhmm === '23:59') return '11:59 PM';
  if (hhmm === '00:00') return '12:00 AM';
  let [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** Returns { state: 'open'|'closed'|'unknown', label, detail } */
function getOpenState(resource, now = new Date()) {
  if (!Array.isArray(resource.hours)) {
    return { state: 'unknown', label: 'Hours vary', detail: resource.hoursText || 'Call to confirm hours.' };
  }
  const dayIdx = now.getDay();
  const today = resource.hours[dayIdx];
  const cur = now.getHours() * 60 + now.getMinutes();

  if (!today || today.length === 0) {
    const nextDay = findNextOpenDay(resource, dayIdx);
    return {
      state: 'closed',
      label: 'Closed today',
      detail: nextDay ? `Opens ${nextDay}` : 'No regular hours listed.'
    };
  }

  for (const [open, close] of today) {
    if (cur >= toMinutes(open) && cur < toMinutes(close)) {
      return { state: 'open', label: 'Open now', detail: `Closes at ${fmtTime(close)}` };
    }
  }

  const upcoming = today.find(([open]) => toMinutes(open) > cur);
  if (upcoming) {
    return { state: 'closed', label: 'Closed now', detail: `Opens today at ${fmtTime(upcoming[0])}` };
  }

  const nextDay = findNextOpenDay(resource, dayIdx);
  return { state: 'closed', label: 'Closed now', detail: nextDay ? `Opens ${nextDay}` : 'No regular hours listed.' };
}

function findNextOpenDay(resource, fromIdx) {
  for (let i = 1; i <= 7; i++) {
    const idx = (fromIdx + i) % 7;
    const day = resource.hours[idx];
    if (day && day.length) {
      const label = i === 1 ? 'tomorrow' : DAY_NAMES[idx];
      return `${label} at ${fmtTime(day[0][0])}`;
    }
  }
  return null;
}

function formatDayHours(day) {
  if (!day || !day.length) return 'Closed';
  return day.map(([o, c]) => `${fmtTime(o)} – ${fmtTime(c)}`).join(', ');
}

/* ------------------------------------------------------------
   4. DISTANCE
   ------------------------------------------------------------ */
const DEFAULT_CENTER = [30.2672, -97.7431]; // Austin, TX

function haversineMiles(a, b) {
  const R = 3958.8;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/* ------------------------------------------------------------
   5. PERSISTENCE
   ------------------------------------------------------------ */
const STORAGE_SAVED = 'foodfinder_saved_v1';
const STORAGE_SUBMISSIONS = 'foodfinder_submissions_v1';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full / disabled */ }
}

let savedIds = new Set(readJSON(STORAGE_SAVED, []));
let submissions = readJSON(STORAGE_SUBMISSIONS, []);

function persistSaved() {
  savedIds = new Set(savedIds); // no-op safety
  writeJSON(STORAGE_SAVED, [...savedIds]);
}

function getAllResources() {
  return [...RESOURCES, ...submissions];
}

/* ------------------------------------------------------------
   6. APP STATE
   ------------------------------------------------------------ */
const state = {
  query: '',
  activeTypes: new Set(),
  openNow: false,
  savedOnly: false,
  sort: 'distance',
  mobileView: 'list',
  userPos: null,
};

/* ------------------------------------------------------------
   7. NAVIGATION
   ------------------------------------------------------------ */
const VIEW_MAP = {
  home: 'view-home',
  directory: 'view-directory',
  help: 'view-help',
  about: 'view-about',
  submit: 'view-submit',
};

function navigate(name) {
  const id = VIEW_MAP[name] ? name : 'home';
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(VIEW_MAP[id]).classList.add('active');

  document.querySelectorAll('.nav a[data-nav]').forEach(a => {
    a.classList.toggle('active', a.dataset.nav === id);
  });

  closeMobileNav();
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

  if (id === 'directory') {
    setTimeout(() => map && map.invalidateSize(), 60);
  }
}

function closeMobileNav() {
  const nav = document.getElementById('nav');
  const btn = document.getElementById('menuBtn');
  nav.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
}

window.addEventListener('hashchange', () => {
  navigate(location.hash.replace('#', ''));
});

/* ------------------------------------------------------------
   8. MAPS
   ------------------------------------------------------------ */
let map = null;
let submitMap = null;
let submitMarker = null;
const markersById = new Map();

function initMainMap() {
  map = L.map('map', { scrollWheelZoom: false }).setView(DEFAULT_CENTER, 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
}

function pinIcon(resource) {
  const cat = CATEGORIES[resource.type] || CATEGORIES.pantry;
  return L.divIcon({
    className: 'leaflet-div-icon',
    html: `<div class="pin" style="--c:${cat.color}" aria-hidden="true">${cat.icon}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

function renderMarkers(list) {
  if (!map) return;
  markersById.forEach(m => map.removeLayer(m));
  markersById.clear();

  list.forEach(res => {
    const cat = CATEGORIES[res.type] || CATEGORIES.pantry;
    const open = getOpenState(res);
    const marker = L.marker([res.lat, res.lng], { icon: pinIcon(res), title: res.name, keyboard: true })
      .addTo(map);

    marker.bindPopup(
      `<b>${escapeHTML(res.name)}</b>
       <span style="color:${cat.color};font-weight:700;font-size:.78rem;text-transform:uppercase;letter-spacing:.04em">${cat.label}</span><br>
       <span style="color:#5c6f64">${escapeHTML(res.address)}</span><br>
       <span style="display:inline-block;margin-top:5px;font-weight:700;color:${open.state === 'open' ? '#1f6b41' : '#5c6f64'}">${open.label}</span>
       <button class="popup-btn" data-open="${res.id}">View full details</button>`
    );

    marker.on('popupopen', () => {
      const btn = document.querySelector(`.popup-btn[data-open="${res.id}"]`);
      if (btn) btn.onclick = () => openModal(res);
    });

    markersById.set(res.id, marker);
  });

  if (list.length) {
    const group = L.featureGroup([...markersById.values()]);
    map.fitBounds(group.getBounds().pad(0.15), { maxZoom: 14 });
  }
}

function renderLegend() {
  const legend = document.getElementById('legend');
  legend.innerHTML = Object.values(CATEGORIES)
    .map(c => `<span><i style="background:${c.color}"></i>${c.icon} ${c.label}</span>`)
    .join('');
}

/* ------------------------------------------------------------
   9. FILTERING + SORTING
   ------------------------------------------------------------ */
function referencePoint() {
  if (state.userPos) return state.userPos;
  if (map) {
    const c = map.getCenter();
    return { lat: c.lat, lng: c.lng };
  }
  return { lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] };
}

function getFiltered() {
  const ref = referencePoint();
  const q = state.query.trim().toLowerCase();

  let list = getAllResources().map(res => ({
    ...res,
    _distance: haversineMiles(ref, { lat: res.lat, lng: res.lng }),
    _open: getOpenState(res),
  }));

  if (q) {
    list = list.filter(res =>
      [res.name, res.address, res.eligibility_notes, res.notes, (res.languages || []).join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }

  if (state.activeTypes.size) {
    list = list.filter(res => state.activeTypes.has(res.type));
  }

  if (state.openNow) {
    list = list.filter(res => res._open.state === 'open');
  }

  if (state.savedOnly) {
    list = list.filter(res => savedIds.has(res.id));
  }

  list.sort((a, b) => {
    if (state.sort === 'name') return a.name.localeCompare(b.name);
    return a._distance - b._distance;
  });

  return list;
}

/* ------------------------------------------------------------
   10. RENDER: chips, list, meta
   ------------------------------------------------------------ */
function renderChips() {
  const wrap = document.getElementById('typeChips');
  wrap.innerHTML = '';

  Object.entries(CATEGORIES).forEach(([key, cat]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.style.setProperty('--c', cat.color);
    btn.setAttribute('aria-pressed', String(state.activeTypes.has(key)));
    btn.innerHTML = `<span class="chip-dot"></span>${cat.icon} ${cat.label}`;
    btn.addEventListener('click', () => {
      if (state.activeTypes.has(key)) state.activeTypes.delete(key);
      else state.activeTypes.add(key);
      btn.setAttribute('aria-pressed', String(state.activeTypes.has(key)));
      refresh();
    });
    wrap.appendChild(btn);
  });
}

function renderHomeCategories() {
  const grid = document.getElementById('homeCategories');
  grid.innerHTML = Object.values(CATEGORIES)
    .map(c => `<div class="cat-pill"><span class="cat-dot" style="--c:${c.color}">${c.icon}</span>${c.label}</div>`)
    .join('');
}

function renderList(list) {
  const container = document.getElementById('resourceList');
  const meta = document.getElementById('resultsMeta');

  meta.textContent = `${list.length} resource${list.length === 1 ? '' : 's'}${state.userPos ? ' sorted by distance from you' : ''}`;

  if (!list.length) {
    container.innerHTML = `
      <div class="card" style="text-align:center;padding:34px 20px">
        <p style="font-size:1.5rem;margin:0 0 8px">🔍</p>
        <p style="font-weight:700;margin:0 0 4px">No resources match those filters</p>
        <p class="muted small" style="margin:0">Try clearing a filter, or search a different term.</p>
      </div>`;
    return;
  }

  container.innerHTML = '';
  list.forEach(res => {
    const cat = CATEGORIES[res.type] || CATEGORIES.pantry;
    const open = res._open;
    const isSaved = savedIds.has(res.id);

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'res-card';
    card.style.setProperty('--c', cat.color);
    card.setAttribute('data-id', res.id);

    card.innerHTML = `
      <div class="res-top">
        <span class="res-ico" aria-hidden="true">${cat.icon}</span>
        <div style="min-width:0">
          <p class="res-name">${escapeHTML(res.name)}</p>
          <span class="res-type">${cat.label}</span>
        </div>
      </div>
      <p class="res-addr">📍 ${escapeHTML(res.address)}</p>
      <div class="res-foot">
        <span class="badge ${open.state}">${open.state === 'open' ? '●' : '○'} ${open.label}</span>
        ${res._distance != null ? `<span class="badge dist">${res._distance.toFixed(1)} mi</span>` : ''}
        ${res.requires_id ? '<span class="badge tag">ID required</span>' : '<span class="badge tag">No ID needed</span>'}
      </div>
      <button class="star-btn" type="button" aria-pressed="${isSaved}"
        aria-label="${isSaved ? 'Unsave' : 'Save'} ${escapeHTML(res.name)}" data-star="${res.id}">★</button>
    `;

    card.addEventListener('click', e => {
      if (e.target.closest('[data-star]')) return;
      openModal(res);
    });

    const star = card.querySelector('[data-star]');
    star.addEventListener('click', e => {
      e.stopPropagation();
      toggleSaved(res.id);
    });

    container.appendChild(card);
  });
}

function refresh() {
  const list = getFiltered();
  renderList(list);
  renderMarkers(list);
}

/* ------------------------------------------------------------
   11. SAVE / FAVORITE
   ------------------------------------------------------------ */
function toggleSaved(id) {
  if (savedIds.has(id)) savedIds.delete(id);
  else savedIds.add(id);
  persistSaved();
  refresh();
  syncModalStar(id);
}

function syncModalStar(id) {
  const btn = document.querySelector('#modalBody [data-modal-star]');
  if (btn && btn.dataset.modalStar === id) {
    btn.setAttribute('aria-pressed', String(savedIds.has(id)));
    btn.textContent = savedIds.has(id) ? '★ Saved' : '☆ Save';
  }
}

/* ------------------------------------------------------------
   12. MODAL
   ------------------------------------------------------------ */
const modalBackdrop = document.getElementById('modalBackdrop');
const modalBody = document.getElementById('modalBody');
const modalCloseBtn = document.getElementById('modalClose');
let lastFocused = null;

function openModal(res) {
  const cat = CATEGORIES[res.type] || CATEGORIES.pantry;
  const open = getOpenState(res);
  const today = new Date().getDay();
  const isSaved = savedIds.has(res.id);

  const hoursRows = Array.isArray(res.hours)
    ? res.hours
        .map((day, i) => `<tr class="${i === today ? 'today' : ''}"><td>${DAY_NAMES[i]}</td><td>${formatDayHours(day)}</td></tr>`)
        .join('')
    : `<tr><td colspan="2" class="muted">${escapeHTML(res.hoursText || 'Call to confirm hours.')}</td></tr>`;

  const directionsURL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(res.address)}`;

  modalBody.innerHTML = `
    <div class="modal-hero" style="--m-light:${hexToTint(cat.color)}">
      <span class="res-type" style="color:${cat.color}">${cat.icon} ${cat.label}</span>
      <h2 id="modalTitle">${escapeHTML(res.name)}</h2>
      <span class="badge ${open.state}">${open.state === 'open' ? '●' : '○'} ${open.label}</span>
      <span class="muted small" style="margin-left:6px">${escapeHTML(open.detail)}</span>
    </div>

    <div class="modal-body">
      <div class="m-row">
        <span class="m-ico">📍</span>
        <div><span class="m-key">Address</span><span class="m-val">${escapeHTML(res.address)}</span></div>
      </div>

      ${res.phone ? `
      <div class="m-row">
        <span class="m-ico">📞</span>
        <div><span class="m-key">Phone</span><a class="m-val" href="tel:${escapeHTML(res.phone.replace(/[^\d+]/g, ''))}">${escapeHTML(res.phone)}</a></div>
      </div>` : ''}

      ${res.website ? `
      <div class="m-row">
        <span class="m-ico">🌐</span>
        <div><span class="m-key">Website</span><a class="m-val" href="${escapeHTML(res.website)}" target="_blank" rel="noopener">${escapeHTML(res.website.replace(/^https?:\/\//, ''))}</a></div>
      </div>` : ''}

      <div class="m-row">
        <span class="m-ico">🕒</span>
        <div style="flex:1">
          <span class="m-key">Hours</span>
          <table class="hours-table"><tbody>${hoursRows}</tbody></table>
        </div>
      </div>

      ${res.eligibility_notes ? `
      <div class="m-row">
        <span class="m-ico">✅</span>
        <div><span class="m-key">Eligibility</span><span class="m-val">${escapeHTML(res.eligibility_notes)}</span></div>
      </div>` : ''}

      ${res.bring ? `
      <div class="notes-box"><strong>What to bring</strong>${escapeHTML(res.bring)}</div>` : ''}

      ${res.languages && res.languages.length ? `
      <div class="m-row">
        <span class="m-ico">🗣️</span>
        <div><span class="m-key">Languages spoken</span><span class="m-val">${res.languages.map(escapeHTML).join(' · ')}</span></div>
      </div>` : ''}

      <div class="m-row">
        <span class="m-ico">🪪</span>
        <div><span class="m-key">ID</span><span class="m-val">${res.requires_id ? 'Photo ID required' : 'No ID required'}</span></div>
      </div>

      ${res.notes ? `
      <div class="m-row">
        <span class="m-ico">💬</span>
        <div><span class="m-key">Good to know</span><span class="m-val">${escapeHTML(res.notes)}</span></div>
      </div>` : ''}

      <div class="modal-actions">
        <a class="btn btn-primary" href="${directionsURL}" target="_blank" rel="noopener">🧭 Get directions</a>
        ${res.phone ? `<a class="btn btn-ghost" href="tel:${escapeHTML(res.phone.replace(/[^\d+]/g, ''))}">📞 Call</a>` : ''}
        <button class="btn btn-ghost" type="button" data-modal-star="${res.id}" aria-pressed="${isSaved}">
          ${isSaved ? '★ Saved' : '☆ Save'}
        </button>
      </div>
    </div>
  `;

  const starBtn = modalBody.querySelector('[data-modal-star]');
  if (starBtn) starBtn.addEventListener('click', () => toggleSaved(res.id));

  lastFocused = document.activeElement;
  modalBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  modalCloseBtn.focus();
}

function closeModal() {
  modalBackdrop.hidden = true;
  document.body.style.overflow = '';
  if (lastFocused && lastFocused.focus) lastFocused.focus();
}

modalCloseBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', e => {
  if (e.target === modalBackdrop) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modalBackdrop.hidden) closeModal();
});

/* ------------------------------------------------------------
   13. SUBMIT MAP
   ------------------------------------------------------------ */
function initSubmitMap() {
  submitMap = L.map('submitMap').setView(DEFAULT_CENTER, 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(submitMap);

  submitMap.on('click', e => {
    const { lat, lng } = e.latlng;
    if (submitMarker) submitMarker.setLatLng(e.latlng);
    else submitMarker = L.marker(e.latlng, { draggable: true }).addTo(submitMap);
    submitMarker.setIcon(pinIcon({ type: 'pantry' }));
    document.getElementById('submitCoords').textContent =
      `Pin set at ${lat.toFixed(5)}, ${lng.toFixed(5)} — click again to adjust.`;
  });
}

/* ------------------------------------------------------------
   14. SUBMIT FORM
   ------------------------------------------------------------ */
function initSubmitForm() {
  const form = document.getElementById('submitForm');
  const typeSelect = document.getElementById('f-type');
  const msg = document.getElementById('formMsg');

  Object.entries(CATEGORIES).forEach(([key, cat]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = `${cat.icon} ${cat.label}`;
    typeSelect.appendChild(opt);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    msg.className = 'form-msg';
    msg.textContent = '';

    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const type = (data.get('type') || '').toString();
    const address = (data.get('address') || '').toString().trim();

    if (!name || !type || !address) {
      msg.classList.add('err');
      msg.textContent = 'Please fill in the name, type, and address.';
      return;
    }
    if (!submitMarker) {
      msg.classList.add('err');
      msg.textContent = 'Click the map to drop a pin for this resource.';
      return;
    }

    const latlng = submitMarker.getLatLng();
    const languages = (data.get('languages') || '')
      .toString().split(',').map(s => s.trim()).filter(Boolean);

    const resource = {
      id: `community-${Date.now()}`,
      name,
      type,
      lat: latlng.lat,
      lng: latlng.lng,
      address,
      phone: (data.get('phone') || '').toString().trim(),
      website: (data.get('website') || '').toString().trim(),
      hours: null,
      hoursText: (data.get('hours') || '').toString().trim(),
      eligibility_notes: (data.get('eligibility') || '').toString().trim(),
      languages,
      requires_id: data.get('requiresId') === 'true',
      bring: (data.get('bring') || '').toString().trim(),
      notes: (data.get('notes') || '').toString().trim(),
      communitySubmitted: true,
    };

    submissions.push(resource);
    writeJSON(STORAGE_SUBMISSIONS, submissions);

    msg.classList.add('ok');
    msg.textContent = `Thanks! "${name}" has been added to the directory.`;

    form.reset();
    if (submitMarker) { submitMap.removeLayer(submitMarker); submitMarker = null; }
    document.getElementById('submitCoords').textContent = 'Click anywhere on the map below to drop a pin.';

    refresh();
  });
}

/* ------------------------------------------------------------
   15. MISC HELPERS
   ------------------------------------------------------------ */
function escapeHTML(str) {
  return String(str ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

function hexToTint(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const mix = (c) => Math.round(c + (255 - c) * 0.9);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

/* ------------------------------------------------------------
   16. EVENT WIRING
   ------------------------------------------------------------ */
function initControls() {
  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  menuBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Search (debounced)
  let searchTimer;
  document.getElementById('searchInput').addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.query = e.target.value;
      refresh();
    }, 160);
  });

  // Open now / saved only
  document.getElementById('openNowToggle').addEventListener('change', e => {
    state.openNow = e.target.checked;
    refresh();
  });
  document.getElementById('savedToggle').addEventListener('change', e => {
    state.savedOnly = e.target.checked;
    refresh();
  });

  // Sort
  document.getElementById('sortSelect').addEventListener('change', e => {
    state.sort = e.target.value;
    refresh();
  });

  // List / map toggle (mobile)
  document.getElementById('viewSeg').addEventListener('click', e => {
    const btn = e.target.closest('button[data-view]');
    if (!btn) return;
    state.mobileView = btn.dataset.view;
    document.querySelectorAll('#viewSeg button').forEach(b => b.classList.toggle('active', b === btn));
    const body = document.getElementById('directoryBody');
    body.classList.toggle('show-list', state.mobileView === 'list');
    body.classList.toggle('show-map', state.mobileView === 'map');
    if (state.mobileView === 'map' && map) setTimeout(() => map.invalidateSize(), 60);
  });

  // Use my location
  document.getElementById('locateBtn').addEventListener('click', () => {
    const btn = document.getElementById('locateBtn');
    if (!navigator.geolocation) {
      alert('Your browser does not support location services.');
      return;
    }
    btn.disabled = true;
    btn.textContent = '📍 Locating…';
    navigator.geolocation.getCurrentPosition(
      pos => {
        state.userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        state.sort = 'distance';
        document.getElementById('sortSelect').value = 'distance';
        if (map) map.setView([state.userPos.lat, state.userPos.lng], 13);
        btn.disabled = false;
        btn.textContent = '📍 Location set';
        refresh();
      },
      () => {
        btn.disabled = false;
        btn.textContent = '📍 Use my location';
        alert('Could not get your location. You can still browse and search the full directory.');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  });
}

/* ------------------------------------------------------------
   17. BOOT
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  renderHomeCategories();
  renderChips();
  renderLegend();
  initControls();

  initMainMap();
  initSubmitMap();

  document.getElementById('directoryBody').classList.add('show-list');

  refresh();
  navigate(location.hash.replace('#', '') || 'home');
});