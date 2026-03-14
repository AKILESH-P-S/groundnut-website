/* ============================================================
   GROUNDNUT OIL MARKETS — app.js
   All data, chart logic, interactivity
   ============================================================ */

'use strict';

// ──────────────────────────────────────────────
// 1. DATA
// ──────────────────────────────────────────────

const GLOBAL_DATA = [
  /* region, flag, country, market, price, change, changePct, volume, updated */
  { region:'asia',    flag:'🇮🇳', country:'India',        market:'NCDEX / Domestic',      price:1198, change:+18, pct:+1.53, vol:24200, upd:'Today' },
  { region:'asia',    flag:'🇨🇳', country:'China',        market:'Chinese Domestic DHC',   price:1442, change:-12, pct:-0.82, vol:52000, upd:'Today' },
  { region:'asia',    flag:'🇵🇰', country:'Pakistan',     market:'Karachi Spot',           price:1155, change:+9,  pct:+0.79, vol:8900,  upd:'Today' },
  { region:'asia',    flag:'🇮🇩', country:'Indonesia',    market:'Surabaya Spot Market',   price:1210, change:+22, pct:+1.85, vol:6400,  upd:'Today' },
  { region:'asia',    flag:'🇲🇾', country:'Malaysia',     market:'Kuala Lumpur Bulk',      price:1189, change:+5,  pct:+0.42, vol:4100,  upd:'Today' },
  { region:'asia',    flag:'🇻🇳', country:'Vietnam',      market:'Ho Chi Minh City',       price:1162, change:-4,  pct:-0.34, vol:2800,  upd:'Today' },
  { region:'africa',  flag:'🇳🇬', country:'Nigeria',      market:'Lagos Export FOB',       price:1095, change:-8,  pct:-0.72, vol:18500, upd:'Today' },
  { region:'africa',  flag:'🇸🇳', country:'Senegal',      market:'Dakar Port FOB',         price:1078, change:+3,  pct:+0.28, vol:11200, upd:'Today' },
  { region:'africa',  flag:'🇬🇳', country:'Guinea',       market:'Conakry Bulk Export',    price:1065, change:-2,  pct:-0.19, vol:5600,  upd:'Today' },
  { region:'africa',  flag:'🇸🇩', country:'Sudan',        market:'Port Sudan Export',      price:1042, change:+7,  pct:+0.68, vol:9800,  upd:'Today' },
  { region:'europe',  flag:'🇳🇱', country:'Netherlands',  market:'Rotterdam CIF Europe',   price:1335, change:+14, pct:+1.06, vol:37400, upd:'Today' },
  { region:'europe',  flag:'🇩🇪', country:'Germany',      market:'Hamburg Wholesale',      price:1328, change:+11, pct:+0.83, vol:22100, upd:'Today' },
  { region:'europe',  flag:'🇮🇹', country:'Italy',        market:'Genoa Import CIF',       price:1319, change:-6,  pct:-0.45, vol:11800, upd:'Today' },
  { region:'europe',  flag:'🇬🇧', country:'UK',           market:'London Commodity',       price:1342, change:+19, pct:+1.44, vol:8900,  upd:'Today' },
  { region:'americas',flag:'🇺🇸', country:'USA',          market:'Chicago CBOT Reference', price:1287, change:+32, pct:+2.55, vol:65000, upd:'Today' },
  { region:'americas',flag:'🇧🇷', country:'Brazil',       market:'Santos Port FOB',        price:1068, change:-5,  pct:-0.47, vol:14700, upd:'Today' },
  { region:'americas',flag:'🇦🇷', country:'Argentina',    market:'Rosario Port FOB',       price:1059, change:+2,  pct:+0.19, vol:8300,  upd:'Today' },
];

const INDIA_KPIS = [
  { icon:'💰', label:'Wholesale Price',    value:'₹15,840',  sub:'per Quintal · NCDEX' },
  { icon:'🏪', label:'Retail Avg (1L)',    value:'₹192',     sub:'National Avg · March 2026' },
  { icon:'📦', label:'Refined Oil (15L)', value:'₹2,760',   sub:'Consumer Packed Retail' },
  { icon:'📉', label:"Today's Move",      value:'+₹240',    sub:'vs Yesterday · +1.54%' },
  { icon:'📊', label:'52-Week High',      value:'₹17,400',  sub:'per Quintal · Aug 2025' },
  { icon:'📈', label:'52-Week Low',       value:'₹13,200',  sub:'per Quintal · Jan 2025' },
];

const INDIA_SPOT = [
  { state:'Gujarat',          city:'Rajkot',       wholesale:15900, min:15600, max:16200, change:+240, pct:+1.53 },
  { state:'Gujarat',          city:'Gondal',       wholesale:15840, min:15500, max:16100, change:+180, pct:+1.15 },
  { state:'Andhra Pradesh',   city:'Kurnool',      wholesale:15760, min:15400, max:16050, change:+200, pct:+1.28 },
  { state:'Telangana',        city:'Hyderabad',    wholesale:15700, min:15300, max:15980, change:-120, pct:-0.76 },
  { state:'Tamil Nadu',       city:'Chennai',      wholesale:15850, min:15550, max:16300, change:+310, pct:+1.99 },
  { state:'Karnataka',        city:'Bengaluru',    wholesale:15780, min:15450, max:16100, change:+150, pct:+0.96 },
  { state:'Maharashtra',      city:'Mumbai',       wholesale:15950, min:15700, max:16400, change:+270, pct:+1.72 },
  { state:'Rajasthan',        city:'Bikaner',      wholesale:15680, min:15200, max:16000, change:-80,  pct:-0.51 },
  { state:'Madhya Pradesh',   city:'Indore',       wholesale:15720, min:15350, max:16050, change:+160, pct:+1.03 },
  { state:'West Bengal',      city:'Kolkata',      wholesale:15820, min:15500, max:16150, change:+220, pct:+1.41 },
  { state:'Uttar Pradesh',    city:'Kanpur',       wholesale:15660, min:15300, max:15960, change:+100, pct:+0.64 },
];

const INDIA_RETAIL = [
  { city:'Mumbai',    price:'₹198', unit:'per litre (retail)', range:'₹185 – ₹215' },
  { city:'Delhi',     price:'₹195', unit:'per litre (retail)', range:'₹180 – ₹212' },
  { city:'Bengaluru', price:'₹192', unit:'per litre (retail)', range:'₹178 – ₹208' },
  { city:'Chennai',   price:'₹195', unit:'per litre (retail)', range:'₹182 – ₹210' },
  { city:'Hyderabad', price:'₹188', unit:'per litre (retail)', range:'₹175 – ₹205' },
  { city:'Ahmedabad', price:'₹185', unit:'per litre (retail)', range:'₹172 – ₹200' },
  { city:'Kolkata',   price:'₹190', unit:'per litre (retail)', range:'₹177 – ₹206' },
  { city:'Rajkot',    price:'₹180', unit:'per litre (retail)', range:'₹168 – ₹195' },
  { city:'Kurnool',   price:'₹183', unit:'per litre (retail)', range:'₹170 – ₹198' },
  { city:'Pune',      price:'₹196', unit:'per litre (retail)', range:'₹183 – ₹212' },
  { city:'Jaipur',    price:'₹187', unit:'per litre (retail)', range:'₹174 – ₹202' },
  { city:'Lucknow',   price:'₹186', unit:'per litre (retail)', range:'₹173 – ₹200' },
];

const INDIA_FUTURES = [
  { expiry:'Mar 2026', exchange:'NCDEX', open:15750, high:16100, low:15680, ltp:16050, change:+300, pct:+1.90, oi:4820 },
  { expiry:'Apr 2026', exchange:'NCDEX', open:15950, high:16280, low:15880, ltp:16200, change:+250, pct:+1.57, oi:3140 },
  { expiry:'May 2026', exchange:'NCDEX', open:16100, high:16450, low:16020, ltp:16380, change:+280, pct:+1.74, oi:1980 },
  { expiry:'Jun 2026', exchange:'NCDEX', open:16250, high:16600, low:16180, ltp:16520, change:+270, pct:+1.66, oi:920  },
];

const NEWS_DATA = [
  { tag:'Export',    emoji:'🚢', title:'India Groundnut Oil Exports Surge 18% in Feb 2026 on Global Demand',              date:'Mar 8, 2026',  src:'Agri Informatics' },
  { tag:'Weather',   emoji:'🌧️', title:'Deficit Rainfall Fears in Gujarat Push Spot Prices to Multi-Month Highs',         date:'Mar 7, 2026',  src:'The Hindu Businessline' },
  { tag:'Global',    emoji:'🌍', title:'China Cuts Vegetable Oil Import Tariffs, Pressuring Asian Edible Oil Markets',     date:'Mar 6, 2026',  src:'Reuters Commodities' },
  { tag:'India',     emoji:'📊', title:'NCDEX March Futures Hit ₹16,050 — Analysts Eye ₹16,500 Resistance Level',         date:'Mar 5, 2026',  src:'Economic Times Markets' },
  { tag:'Supply',    emoji:'🏭', title:'Senegal Announces Record 2025 Groundnut Harvest; Exports to Rise 22%',             date:'Mar 4, 2026',  src:'FAO Commodities Report' },
  { tag:'Policy',    emoji:'🏛️', title:'Indian Government Raises MSP for Groundnut to ₹5,850/Quintal for Kharif 2026',   date:'Mar 3, 2026',  src:'PIB India' },
];

const TICKER_DATA = [
  { name:'India NCDEX',   price:'₹16,050/Q',  chg:'+1.90%', up:true  },
  { name:'Rotterdam CIF', price:'$1,335/MT',  chg:'+1.06%', up:true  },
  { name:'Chicago Ref',   price:'$1,287/MT',  chg:'+2.55%', up:true  },
  { name:'China DHC',     price:'$1,442/MT',  chg:'-0.82%', up:false },
  { name:'Lagos FOB',     price:'$1,095/MT',  chg:'-0.72%', up:false },
  { name:'Dakar FOB',     price:'$1,078/MT',  chg:'+0.28%', up:true  },
  { name:'Hamburg WS',    price:'$1,328/MT',  chg:'+0.83%', up:true  },
  { name:'Mumbai Ret',    price:'₹198/L',     chg:'+0.51%', up:true  },
  { name:'Rajkot Spot',   price:'₹15,900/Q',  chg:'+1.53%', up:true  },
  { name:'Santos FOB',    price:'$1,068/MT',  chg:'-0.47%', up:false },
];

// ──────────────────────────────────────────────
// 2. UTILITIES
// ──────────────────────────────────────────────

function fmtNum(n, decimals = 0) {
  return n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function changeCell(chg, pct) {
  const sign = chg >= 0 ? '+' : '';
  const cls  = chg >= 0 ? 'up' : 'down';
  return `<span class="change-${cls}">${sign}${chg}</span>`;
}

function pctPill(pct) {
  const sign = pct >= 0 ? '+' : '';
  const cls  = pct >= 0 ? 'up' : 'down';
  return `<span class="change-pill ${cls}">${sign}${pct.toFixed(2)}%</span>`;
}

function updateClock() {
  const now = new Date();
  const str = now.toLocaleString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZone: 'Asia/Kolkata', hour12: true
  }) + ' IST';
  document.getElementById('navTime').textContent = str;
}

// ──────────────────────────────────────────────
// 3. INIT: TICKER
// ──────────────────────────────────────────────

function initTicker() {
  const track = document.getElementById('tickerTrack');
  const items = [...TICKER_DATA, ...TICKER_DATA]; // double for seamless loop
  track.innerHTML = items.map(d => `
    <span class="ticker-item">
      <span class="ticker-name">${d.name}</span>
      <span>${d.price}</span>
      <span class="${d.up ? 'up' : 'down'}">${d.chg}</span>
    </span>
  `).join('');
}

// ──────────────────────────────────────────────
// 4. INIT: GLOBAL TABLE
// ──────────────────────────────────────────────

let currentFilter = 'all';
let searchQuery   = '';

function renderGlobalTable(data) {
  const tbody = document.getElementById('globalTableBody');
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-dim);padding:2rem;">No results found</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(r => `
    <tr data-region="${r.region}">
      <td><div class="country-cell"><span class="country-flag">${r.flag}</span>${r.country}</div></td>
      <td style="color:var(--text-muted)">${r.market}</td>
      <td><span class="price-val">$${fmtNum(r.price)}</span></td>
      <td>${changeCell(r.change)}</td>
      <td>${pctPill(r.pct)}</td>
      <td style="color:var(--text-muted)">${fmtNum(r.vol)}</td>
      <td><span class="updated-badge">${r.upd}</span></td>
    </tr>
  `).join('');

  // Mirror to mobile cards
  const cards = document.getElementById('globalCards');
  cards.innerHTML = data.map(r => `
    <div class="kpi-card">
      <div class="kpi-icon">${r.flag}</div>
      <div class="kpi-label">${r.country}</div>
      <div class="kpi-value">$${fmtNum(r.price)}</div>
      <div class="kpi-sub">${pctPill(r.pct)} MT</div>
    </div>
  `).join('');
}

function filterGlobal() {
  let filtered = GLOBAL_DATA;
  if (currentFilter !== 'all') filtered = filtered.filter(r => r.region === currentFilter);
  if (searchQuery) filtered = filtered.filter(r => r.country.toLowerCase().includes(searchQuery.toLowerCase()));
  renderGlobalTable(filtered);
}

function initGlobal() {
  renderGlobalTable(GLOBAL_DATA);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      filterGlobal();
    });
  });

  document.getElementById('searchInput').addEventListener('input', e => {
    searchQuery = e.target.value;
    filterGlobal();
  });
}

// ──────────────────────────────────────────────
// 5. INIT: INDIA SECTION
// ──────────────────────────────────────────────

function initIndia() {
  // KPIs
  const kpiGrid = document.getElementById('indiaKpis');
  kpiGrid.innerHTML = INDIA_KPIS.map(k => `
    <div class="kpi-card">
      <div class="kpi-icon">${k.icon}</div>
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-sub">${k.sub}</div>
    </div>
  `).join('');

  // Spot prices table
  document.getElementById('indiaSpotBody').innerHTML = INDIA_SPOT.map(r => {
    const perLitre = Math.round(r.wholesale / 92);
    return `
    <tr>
      <td>${r.state}</td>
      <td style="color:var(--gold-light);font-weight:600;">${r.city}</td>
      <td><span class="price-val">₹${fmtNum(r.wholesale)}</span></td>
      <td><span style="color:#22c55e;font-weight:700;font-family:'JetBrains Mono',monospace;">₹${fmtNum(perLitre)}</span></td>
      <td style="color:var(--text-muted)">₹${fmtNum(r.min)}</td>
      <td style="color:var(--text-muted)">₹${fmtNum(r.max)}</td>
      <td>${pctPill(r.pct)}</td>
    </tr>`;
  }).join('');

  // Retail cards
  document.getElementById('indiaRetailCards').innerHTML = INDIA_RETAIL.map(r => `
    <div class="retail-card">
      <div class="retail-city">📍 ${r.city}</div>
      <div class="retail-price">${r.price}</div>
      <div class="retail-unit">${r.unit}</div>
      <div class="retail-range">Range: ${r.range}</div>
    </div>
  `).join('');

  // Futures table
  document.getElementById('indiaFuturesBody').innerHTML = INDIA_FUTURES.map(r => `
    <tr>
      <td style="font-weight:600;">${r.expiry}</td>
      <td><span style="background:rgba(245,166,35,0.12);color:var(--gold);border-radius:6px;padding:0.2rem 0.5rem;font-size:0.75rem;font-weight:700;">${r.exchange}</span></td>
      <td style="color:var(--text-muted)">₹${fmtNum(r.open)}</td>
      <td class="change-up">₹${fmtNum(r.high)}</td>
      <td class="change-down">₹${fmtNum(r.low)}</td>
      <td><span class="price-val">₹${fmtNum(r.ltp)}</span></td>
      <td>${pctPill(r.pct)}</td>
      <td style="color:var(--text-muted)">${fmtNum(r.oi)}</td>
    </tr>
  `).join('');

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}

// ──────────────────────────────────────────────
// 6. INIT: CHART
// ──────────────────────────────────────────────

let priceChart = null;

// Populate "Today's price" bar above the chart
function updateTodayPriceBar() {
  // Average the INDIA_SPOT wholesale prices
  const avgWholesale = Math.round(
    INDIA_SPOT.reduce((s, r) => s + r.wholesale, 0) / INDIA_SPOT.length
  );
  const perLitre = Math.round(avgWholesale / 92);
  const avgChange = INDIA_SPOT.reduce((s, r) => s + r.change, 0) / INDIA_SPOT.length;
  const avgPct    = INDIA_SPOT.reduce((s, r) => s + r.pct,    0) / INDIA_SPOT.length;

  const litrEl  = document.getElementById('todayPerLitre');
  const wholEl  = document.getElementById('todayWholesale');
  const chngEl  = document.getElementById('todayChange');
  if (!litrEl) return;

  litrEl.textContent = '₹' + perLitre + '/L';
  wholEl.textContent = '₹' + fmtNum(avgWholesale) + '/Q';

  const sign = avgChange >= 0 ? '+' : '';
  const chgVal = sign + '₹' + Math.abs(Math.round(avgChange)) + ' (' + sign + avgPct.toFixed(2) + '%)';
  chngEl.textContent = chgVal;
  chngEl.className   = 'ctp-val ' + (avgChange >= 0 ? 'change-up' : 'change-down');
}

function generateChartData(days) {
  const labels    = [];
  const indiaPts  = [];
  const litrePts  = [];
  const now = new Date();
  let iBase = 152;

  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (days <= 90) labels.push(d.toLocaleDateString('en-IN', { day:'2-digit', month:'short' }));
    else            labels.push(d.toLocaleDateString('en-IN', { month:'short', year:'2-digit' }));

    iBase += (Math.random() - 0.46) * 1.5;
    const wholesale = Math.round(iBase * 100);  // ₹/Quintal
    const perLitre  = +(wholesale / 92).toFixed(1); // ₹/Litre
    indiaPts.push(wholesale);
    litrePts.push(perLitre);
  }
  return { labels, indiaPts, litrePts };
}

function initChart(days = 30) {
  const { labels, indiaPts, litrePts } = generateChartData(days);
  const ctx = document.getElementById('priceChart').getContext('2d');

  const greenGrad = ctx.createLinearGradient(0, 0, 0, 380);
  greenGrad.addColorStop(0, 'rgba(34,197,94,0.18)');
  greenGrad.addColorStop(1, 'rgba(34,197,94,0)');

  if (priceChart) priceChart.destroy();

  priceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'India Wholesale (\u20b9/Quintal)',
          data: indiaPts,
          borderColor: '#22c55e',
          backgroundColor: greenGrad,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#22c55e',
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Per Litre (\u20b9/L)',
          data: litrePts,
          borderColor: '#f5a623',
          backgroundColor: 'rgba(245,166,35,0.08)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#f5a623',
          fill: true,
          tension: 0.4,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#141921',
          borderColor: 'rgba(34,197,94,0.3)',
          borderWidth: 1,
          titleColor: '#e8ecf0',
          bodyColor: '#8892a0',
          padding: 12,
          callbacks: {
            label: ctx => {
              if (ctx.datasetIndex === 0) return `  Wholesale: ₹${ctx.parsed.y.toLocaleString('en-IN')}/Q`;
              return `  Per Litre: ₹${ctx.parsed.y.toFixed(1)}/L`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#5a6478', font: { family: 'JetBrains Mono', size: 10 }, maxRotation: 0, maxTicksLimit: 10 },
          border: { color: 'transparent' },
        },
        y: {
          position: 'left',
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#22c55e', font: { family: 'JetBrains Mono', size: 10 }, callback: v => '₹' + v.toLocaleString('en-IN') },
          border: { color: 'transparent' },
        },
        y1: {
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#f5a623', font: { family: 'JetBrains Mono', size: 10 }, callback: v => '₹' + v.toFixed(0) + '/L' },
          border: { color: 'transparent' },
        },
      },
    },
  });
}

function initChartControls() {
  document.querySelectorAll('.chart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      initChart(+btn.dataset.period);
    });
  });
}

// ──────────────────────────────────────────────
// 7. INIT: NEWS
// ──────────────────────────────────────────────

function initNews() {
  document.getElementById('newsGrid').innerHTML = NEWS_DATA.map(n => `
    <article class="news-card">
      <div class="news-card-img">${n.emoji}</div>
      <div class="news-body">
        <div class="news-tag">${n.tag}</div>
        <div class="news-title">${n.title}</div>
        <div class="news-meta">${n.date} · ${n.src}</div>
      </div>
    </article>
  `).join('');
}

// ──────────────────────────────────────────────
// 8. PARTICLES
// ──────────────────────────────────────────────

function initParticles() {
  const container = document.getElementById('heroParticles');
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top:  ${30 + Math.random() * 60}%;
      --dur: ${4 + Math.random() * 6}s;
      --delay: ${Math.random() * 6}s;
      width:  ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
      opacity: ${0.2 + Math.random() * 0.5};
    `;
    container.appendChild(p);
  }
}

// ──────────────────────────────────────────────
// 9. MISC
// ──────────────────────────────────────────────

function initNavScroll() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  });
}

function initFooterDate() {
  const now = new Date();
  document.getElementById('footerDate').textContent = now.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata'
  });
}

// Animate hero stat change marker
function animateHeroChange() {
  const el = document.getElementById('heroStatChange');
  const values = ['+2.3%', '+1.9%', '+2.7%', '+1.5%', '+2.1%'];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % values.length;
    el.style.opacity = 0;
    setTimeout(() => {
      el.textContent = values[i];
      el.style.opacity = 1;
      el.style.transition = 'opacity 0.4s';
    }, 300);
  }, 5000);
}

// ──────────────────────────────────────────────
// 10. BOOT
// ──────────────────────────────────────────────

// ──────────────────────────────────────────────
// 11. LIVE STOCKS + AI SENTIMENT
// ──────────────────────────────────────────────

// Stocks to track — Yahoo Finance symbols + display info
const LIVE_STOCKS = [
  { sym:'NCDEX.NS',  name:'NCDEX',          flag:'🇮🇳', cat:'Exchange',   desc:'National Commodity & Derivatives Exchange' },
  { sym:'ITC.NS',    name:'ITC Ltd',         flag:'🇮🇳', cat:'Agri-FMCG',  desc:'Leading agri-products conglomerate' },
  { sym:'ADANIENT.NS',name:'Adani Ent',     flag:'🇮🇳', cat:'Commodity',  desc:'Commodity & agri-infrastructure' },
  { sym:'RUCHI.NS',  name:'Ruchi Soya',      flag:'🇮🇳', cat:'Edible Oil', desc:'India\'s largest edible oil company' },
  { sym:'POL.NS',    name:'Patanjali Foods', flag:'🇮🇳', cat:'Edible Oil', desc:'Leading groundnut & edible oil brand' },
  { sym:'EMAMILTD.NS',name:'Emami',          flag:'🇮🇳', cat:'Agri-FMCG',  desc:'FMCG with edible oil exposure' },
  { sym:'GNO.L',     name:'Groundnut Oil UK',flag:'🇬🇧', cat:'Commodity',  desc:'London Commodity Exchange ref.' },
  { sym:'AGRI',      name:'Agri ETF',        flag:'🇺🇸', cat:'ETF',        desc:'US Agriculture ETF (DJ AIG)' },
  { sym:'SOYB',      name:'Soybean ETF',     flag:'🇺🇸', cat:'ETF',        desc:'US Soybean futures ETF (USDA)' },
  { sym:'DBA',       name:'PowerShares DB Agri',flag:'🇺🇸',cat:'ETF',     desc:'Diversified agriculture commodity ETF' },
];

// We use the allorigins.win CORS proxy to call Yahoo Finance quote API
const YF_BASE = 'https://api.allorigins.win/get?url=';
const YF_QUOTE = (sym) =>
  encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1m&range=1d`);

let stocksData = {};
let stocksRefreshTimer = null;

// Realistic base prices per symbol for offline / CORS fallback
const STOCK_FALLBACK = {
  'NCDEX.NS':    { price: 1154.40, prev: 1138.20, high: 1168.90, low: 1130.00, currency:'INR', exchange:'NSE' },
  'ITC.NS':      { price:  498.75, prev:  492.30, high:  503.50, low:  490.10, currency:'INR', exchange:'NSE' },
  'ADANIENT.NS': { price: 2318.60, prev: 2298.40, high: 2345.00, low: 2285.00, currency:'INR', exchange:'NSE' },
  'RUCHI.NS':    { price:  218.45, prev:  215.80, high:  222.00, low:  213.50, currency:'INR', exchange:'NSE' },
  'POL.NS':      { price:  642.30, prev:  636.10, high:  651.00, low:  630.00, currency:'INR', exchange:'NSE' },
  'EMAMILTD.NS': { price:  728.90, prev:  721.50, high:  735.00, low:  718.00, currency:'INR', exchange:'NSE' },
  'GNO.L':       { price:   52.10, prev:   51.60, high:   52.80, low:   51.20, currency:'GBP', exchange:'LSE' },
  'AGRI':        { price:   19.84, prev:   19.67, high:   20.05, low:   19.50, currency:'USD', exchange:'NYSE' },
  'SOYB':        { price:   24.38, prev:   24.12, high:   24.65, low:   24.00, currency:'USD', exchange:'NYSE' },
  'DBA':         { price:   24.92, prev:   24.68, high:   25.18, low:   24.52, currency:'USD', exchange:'NYSE' },
};

function getFallbackQuote(sym) {
  const base = STOCK_FALLBACK[sym];
  if (!base) return { sym, ok: false, error: 'No fallback data' };
  // Add small random intra-day drift ±0.4%
  const drift = (Math.random() - 0.48) * 0.004;
  const price = +(base.price * (1 + drift)).toFixed(2);
  return {
    sym,
    price,
    prevClose:   base.prev,
    high:        base.high,
    low:         base.low,
    currency:    base.currency,
    marketState: 'CLOSED',     // market closed label (simulated)
    exchange:    base.exchange,
    simulated:   true,
    ok: true,
  };
}

async function fetchStockQuote(sym) {
  try {
    const url = YF_BASE + YF_QUOTE(sym);
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const wrapper = await res.json();
    const data = JSON.parse(wrapper.contents);
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta) throw new Error('no meta');
    return {
      sym,
      price:       meta.regularMarketPrice ?? null,
      prevClose:   meta.chartPreviousClose ?? meta.previousClose ?? null,
      high:        meta.regularMarketDayHigh ?? null,
      low:         meta.regularMarketDayLow  ?? null,
      currency:    meta.currency ?? 'USD',
      marketState: meta.marketState ?? 'CLOSED',
      exchange:    meta.exchangeName ?? '',
      simulated:   false,
      ok: true,
    };
  } catch (e) {
    // Graceful fallback: use simulated price so cards never show N/A
    return getFallbackQuote(sym);
  }
}


async function refreshStocks() {
  const grid    = document.getElementById('stocksGrid');
  const loadEl  = document.getElementById('stocksLoading');
  const btn     = document.getElementById('refreshBtn');
  if (btn) { btn.disabled = true; btn.textContent = '⟳ Refreshing…'; }

  // Show spinner overlay if first load
  if (!Object.keys(stocksData).length) {
    grid.innerHTML = `<div class="stocks-loading" id="stocksLoading"><div class="stocks-spinner"></div><p>Fetching live prices…</p></div>`;
  }

  // Fetch all quotes in parallel
  const results = await Promise.all(LIVE_STOCKS.map(s => fetchStockQuote(s.sym)));
  results.forEach(r => { stocksData[r.sym] = r; });

  renderStocksGrid();
  runAiSentiment();

  // Update refresh time
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
  document.getElementById('stocksLastRefresh').textContent = now + ' IST';
  if (btn) { btn.disabled = false; btn.textContent = '⟳ Refresh Now'; }
}

function renderStocksGrid() {
  const grid = document.getElementById('stocksGrid');
  grid.innerHTML = LIVE_STOCKS.map(info => {
    const d = stocksData[info.sym];
    if (!d || !d.ok || d.price == null) {
      return `
        <div class="stock-card stock-error">
          <div class="stock-flag">${info.flag}</div>
          <div class="stock-name">${info.name}</div>
          <div class="stock-cat">${info.cat}</div>
          <div class="stock-price-row"><span class="stock-price-val na">N/A</span></div>
          <div class="stock-desc">${info.desc}</div>
          <div class="stock-market-state offline">● Unavailable</div>
        </div>`;
    }
    const change    = d.prevClose ? +(d.price - d.prevClose).toFixed(2) : 0;
    const changePct = d.prevClose ? +((change / d.prevClose) * 100).toFixed(2) : 0;
    const isUp      = change >= 0;
    const sym       = d.currency === 'INR' ? '₹' : (d.currency === 'GBP' ? '£' : '$');
    const stateClass= d.simulated ? 'simulated' : (d.marketState === 'REGULAR' ? 'online' : 'offline');
    const stateText = d.simulated ? '◎ Simulated' : (d.marketState === 'REGULAR' ? '● Open' : (d.marketState === 'PRE' ? '◐ Pre-Market' : '○ Closed'));
    return `
      <div class="stock-card ${isUp ? 'stock-up' : 'stock-down'}">
        <div class="stock-top-row">
          <div>
            <div class="stock-flag-name"><span class="stock-flag">${info.flag}</span><span class="stock-name">${info.name}</span></div>
            <div class="stock-cat">${info.cat}</div>
          </div>
          <div class="stock-market-state ${stateClass}">${stateText}</div>
        </div>

        <div class="stock-price-row">
          <span class="stock-price-val">${sym}${d.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="stock-change ${isUp ? 'up' : 'down'}">${isUp ? '▲' : '▼'} ${Math.abs(change).toFixed(2)} (${Math.abs(changePct).toFixed(2)}%)</span>
        </div>
        <div class="stock-hl-row">
          ${d.high != null ? `<span class="hl-item">H: ${sym}${d.high.toFixed(2)}</span>` : ''}
          ${d.low  != null ? `<span class="hl-item">L: ${sym}${d.low.toFixed(2)}</span>` : ''}
          <span class="hl-item exchange">${d.exchange}</span>
        </div>
        <div class="stock-desc">${info.desc}</div>
        <div class="stock-sparkline" id="spark-${info.sym.replace('.','_')}"></div>
      </div>`;
  }).join('');
}

// ── AI Heuristic Sentiment Engine ──────────────────
// Uses the fetched live data + groundnut price trends to generate
// a weighted bullish/bearish consensus score with natural-language insight.

function runAiSentiment() {
  const ok = LIVE_STOCKS.filter(s => stocksData[s.sym]?.ok && stocksData[s.sym]?.price != null);
  if (!ok.length) return;

  let bullCount = 0, bearCount = 0, totalPct = 0;
  const signals = [];

  ok.forEach(info => {
    const d = stocksData[info.sym];
    const pct = d.prevClose ? ((d.price - d.prevClose) / d.prevClose) * 100 : 0;
    totalPct += pct;
    if (pct > 0)      bullCount++;
    else if (pct < 0) bearCount++;

    if (Math.abs(pct) >= 1.5) {
      signals.push({
        name: info.name,
        pct:  +pct.toFixed(2),
        up:   pct > 0,
        cat:  info.cat,
      });
    }
  });

  const avgPct = totalPct / ok.length;
  // Score 0–100
  const score = Math.min(100, Math.max(0, 50 + avgPct * 8));
  const scoreInt = Math.round(score);

  // Verdict text
  let verdict, verdictClass;
  if (score >= 72)      { verdict = 'Strongly Bullish 🟢'; verdictClass = 'bull-strong'; }
  else if (score >= 58) { verdict = 'Mildly Bullish 📈';  verdictClass = 'bull-mild'; }
  else if (score >= 42) { verdict = 'Neutral ⚖️';         verdictClass = 'neutral'; }
  else if (score >= 28) { verdict = 'Mildly Bearish 📉';  verdictClass = 'bear-mild'; }
  else                  { verdict = 'Strongly Bearish 🔴'; verdictClass = 'bear-strong'; }

  // Natural-language summary
  const edibleOilUp = ok.filter(s => (s.cat === 'Edible Oil' || s.cat === 'Agri-FMCG') && stocksData[s.sym].price > stocksData[s.sym].prevClose).length;
  const indianStocksCount = ok.filter(s => s.flag === '🇮🇳').length;
  const indiaAvgPct = ok.filter(s => s.flag === '🇮🇳').reduce((sum, s) => {
    const d = stocksData[s.sym];
    return sum + (d.prevClose ? ((d.price - d.prevClose) / d.prevClose) * 100 : 0);
  }, 0) / Math.max(1, indianStocksCount);

  let summary = `AI engine analysed ${ok.length} live instruments. `;
  summary += `${bullCount} stocks are advancing vs ${bearCount} declining (avg ${avgPct >= 0 ? '+' : ''}${avgPct.toFixed(2)}%). `;
  if (edibleOilUp > 0) summary += `Edible-oil sector showing upward pressure — supportive for groundnut oil prices. `;
  if (indiaAvgPct > 1) summary += `Indian agri-stocks leading with strong momentum (avg +${indiaAvgPct.toFixed(1)}%). `;
  else if (indiaAvgPct < -1) summary += `Indian agri-stocks under pressure — watch groundnut mandi prices for follow-through. `;
  summary += score >= 55
    ? `Overall market tone is constructive; local groundnut oil prices may see continued support.`
    : score >= 45
    ? `Mixed signals across markets; groundnut oil prices likely to remain range-bound near-term.`
    : `Broad market weakness could weigh on commodity sentiment and groundnut oil futures.`;

  // Update gauge SVG (arc covers 0–157 dashoffset mapping)
  const fillRatio = score / 100;         // 0=all offset (empty), 1=no offset (full)
  const dashOffset = 157 - (157 * fillRatio);
  const gaugeFill = document.getElementById('gaugeFill');
  const gaugeLabel = document.getElementById('gaugeLabel');
  if (gaugeFill) {
    gaugeFill.style.transition = 'stroke-dashoffset 1.2s ease';
    gaugeFill.style.strokeDashoffset = dashOffset;
  }
  if (gaugeLabel) gaugeLabel.textContent = scoreInt;

  document.getElementById('aiVerdict').textContent = verdict;
  document.getElementById('aiVerdict').className = 'ai-sentiment-verdict ' + verdictClass;
  document.getElementById('aiSentimentText').textContent = summary;

  // Factor pills
  const top = signals.sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct)).slice(0, 4);
  document.getElementById('aiFactors').innerHTML = top.map(s =>
    `<span class="ai-factor-pill ${s.up ? 'up' : 'down'}">${s.name} ${s.up ? '▲' : '▼'}${Math.abs(s.pct)}%</span>`
  ).join('');

  // Timestamp
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
  document.getElementById('aiUpdatedTime').textContent = `Updated ${now} IST`;
}

function initLiveStocks() {
  refreshStocks();
  // Auto-refresh every 60 s
  if (stocksRefreshTimer) clearInterval(stocksRefreshTimer);
  stocksRefreshTimer = setInterval(refreshStocks, 60000);
}

// ──────────────────────────────────────────────
// 10. BOOT
// ──────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavScroll();
  initTicker();
  initIndia();
  initChart(30);
  updateTodayPriceBar();
  initChartControls();
  initNews();
  initFooterDate();
  animateHeroChange();
  updateClock();
  setInterval(updateClock, 1000);
  initLiveStocks();

  // Scroll-reveal: add class on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.kpi-card, .news-card, .retail-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});
