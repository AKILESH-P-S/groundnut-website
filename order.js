/* ============================================================
   ORDER PAGE — order.js
   Web3Forms email · Form validation · Step nav · Summary
   ============================================================

   ⚙️  ONE-TIME SETUP (takes 1 minute):
   1. Open https://web3forms.com in your browser
   2. Enter your email:  agghnv@gmail.com
   3. Click "Create Access Key" — you will receive a key by email
   4. Paste that key below as WEB3FORMS_KEY

   ============================================================ */

'use strict';

// ──────────────────────────────────────────────
// ⚙️  CONFIGURATION  ← ONLY EDIT THIS ONE LINE
// ──────────────────────────────────────────────
const CONFIG = {
  OWNER_EMAIL: 'agghnv@gmail.com',
  WEB3FORMS_KEY: 'cf90d63c-1483-44ce-8619-0e65180453d8',
};

// ──────────────────────────────────────────────
// PRICE TABLE  (oil type → ₹ per litre)
// ──────────────────────────────────────────────
const PRICES = {
  'Refined Groundnut Oil': 192,
  'Cold Pressed Groundnut Oil': 290,
  'Pure Groundnut Oil': 240,
  'Organic Groundnut Oil': 340,
};

// ──────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────
let currentStep = 1;
let orderData = {};

// ──────────────────────────────────────────────
// CLOCK
// ──────────────────────────────────────────────
function updateClock() {
  const el = document.getElementById('navTime');
  if (!el) return;
  el.textContent = new Date().toLocaleString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZone: 'Asia/Kolkata', hour12: true,
  }) + ' IST';
}

// ──────────────────────────────────────────────
// NAVBAR SCROLL
// ──────────────────────────────────────────────
function initNavScroll() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ──────────────────────────────────────────────
// QUANTITY STEPPER
// ──────────────────────────────────────────────
function initQtyStepper() {
  const input = document.getElementById('quantity');
  const minBtn = document.getElementById('qtyMinus');
  const plusBtn = document.getElementById('qtyPlus');

  minBtn.addEventListener('click', () => {
    const v = parseInt(input.value) || 1;
    input.value = Math.max(1, v - (v <= 10 ? 1 : v <= 100 ? 5 : 50));
    updateSummary();
  });

  plusBtn.addEventListener('click', () => {
    const v = parseInt(input.value) || 1;
    input.value = Math.min(10000, v + (v < 10 ? 1 : v < 100 ? 5 : 50));
    updateSummary();
  });

  input.addEventListener('input', updateSummary);

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      input.value = btn.dataset.qty;
      updateSummary();
    });
  });
}

// ──────────────────────────────────────────────
// OIL TYPE CARDS → update price
// ──────────────────────────────────────────────
function initOilCards() {
  document.querySelectorAll('input[name="oilType"]').forEach(r => {
    r.addEventListener('change', updateSummary);
  });
}

// ──────────────────────────────────────────────
// PACKAGING
// ──────────────────────────────────────────────
function initPackaging() {
  document.querySelectorAll('input[name="packaging"]').forEach(r => {
    r.addEventListener('change', () => {
      document.getElementById('sumPack').textContent = r.value;
    });
  });
}

// ──────────────────────────────────────────────
// SUMMARY UPDATER
// ──────────────────────────────────────────────
function updateSummary() {
  const oilType = document.querySelector('input[name="oilType"]:checked')?.value || 'Refined Groundnut Oil';
  const qty = parseInt(document.getElementById('quantity')?.value) || 0;
  const price = PRICES[oilType] || 192;
  const oilCost = qty * price;
  const gst = Math.round(oilCost * 0.05);
  const total = oilCost + gst;

  document.getElementById('sumType').textContent = oilType;
  document.getElementById('sumQty').textContent = qty + ' Litres';
  document.getElementById('sumUnitPrice').textContent = '₹' + price + '/L';
  document.getElementById('sumOilCost').textContent = '₹' + oilCost.toLocaleString('en-IN');
  document.getElementById('sumGst').textContent = '₹' + gst.toLocaleString('en-IN');
  document.getElementById('sumTotal').textContent = '₹' + total.toLocaleString('en-IN');
}

// ──────────────────────────────────────────────
// STEP NAVIGATION
// ──────────────────────────────────────────────
function goToStep(step) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.getElementById('formStep' + step).classList.add('active');

  // Update step dots
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById('step' + i + 'Dot');
    dot.classList.remove('active', 'done');
    if (i < step) dot.classList.add('done');
    if (i === step) dot.classList.add('active');
  }

  // Update step lines
  const lines = document.querySelectorAll('.step-line');
  lines.forEach((l, idx) => {
    l.classList.toggle('done', idx < step - 1);
  });

  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ──────────────────────────────────────────────
// VALIDATION HELPERS
// ──────────────────────────────────────────────
function validateStep1() {
  const qty = parseInt(document.getElementById('quantity').value);
  if (!qty || qty < 1) {
    showFieldError('quantity', 'Please enter a valid quantity (minimum 1 litre)');
    return false;
  }
  if (qty > 10000) {
    showFieldError('quantity', 'Maximum 10,000 litres per order. Contact us for larger orders.');
    return false;
  }
  clearErrors();
  return true;
}

function validateStep2() {
  const required = ['firstName', 'lastName', 'email', 'phone'];
  let ok = true;
  required.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) { showFieldError(id, 'This field is required'); ok = false; }
    else clearFieldError(id);
  });
  const email = document.getElementById('email').value.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError('email', 'Please enter a valid email address');
    ok = false;
  }
  const phone = document.getElementById('phone').value.trim();
  if (phone && !/^\d{10}$/.test(phone)) {
    showFieldError('phone', 'Enter a valid 10-digit mobile number');
    ok = false;
  }
  return ok;
}

function validateStep3() {
  const required = ['addressLine1', 'city', 'pincode', 'state'];
  let ok = true;
  required.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) { showFieldError(id, 'This field is required'); ok = false; }
    else clearFieldError(id);
  });
  const pin = document.getElementById('pincode').value.trim();
  if (pin && !/^\d{6}$/.test(pin)) {
    showFieldError('pincode', 'Enter a valid 6-digit PIN code');
    ok = false;
  }
  if (!document.getElementById('agreeTerms').checked) {
    alert('Please agree to the Terms & Conditions to proceed.');
    ok = false;
  }
  return ok;
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('error');
  let err = el.parentElement.querySelector('.field-error');
  if (!err) {
    err = document.createElement('p');
    err.className = 'field-error';
    err.style.cssText = 'font-size:0.72rem;color:var(--red);margin-top:0.25rem;';
    el.parentElement.appendChild(err);
  }
  err.textContent = msg;
}

function clearFieldError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('error');
  const err = el.parentElement.querySelector('.field-error');
  if (err) err.remove();
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(e => e.remove());
  document.querySelectorAll('.form-input.error').forEach(e => e.classList.remove('error'));
}

// ──────────────────────────────────────────────
// BUILD ORDER DATA OBJECT
// ──────────────────────────────────────────────
function collectOrderData() {
  const qty = parseInt(document.getElementById('quantity').value) || 0;
  const oilType = document.querySelector('input[name="oilType"]:checked')?.value || 'Refined Groundnut Oil';
  const price = PRICES[oilType] || 192;
  const oilCost = qty * price;
  const gst = Math.round(oilCost * 0.05);
  const total = oilCost + gst;
  const ref = 'GNO-' + Date.now().toString(36).toUpperCase();

  orderData = {
    order_ref: ref,
    order_date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    customer_name: document.getElementById('firstName').value.trim() + ' ' + document.getElementById('lastName').value.trim(),
    customer_email: document.getElementById('email').value.trim(),
    customer_phone: '+91 ' + document.getElementById('phone').value.trim(),
    customer_type: document.querySelector('input[name="customerType"]:checked')?.value || 'Individual',
    company: document.getElementById('company').value.trim() || 'N/A',
    gstin: document.getElementById('gstin').value.trim() || 'N/A',
    oil_type: oilType,
    quantity: qty + ' Litres',
    packaging: document.querySelector('input[name="packaging"]:checked')?.value || 'Pet Bottle',
    unit_price: '₹' + price + '/Litre',
    oil_cost: '₹' + oilCost.toLocaleString('en-IN'),
    gst_amount: '₹' + gst.toLocaleString('en-IN'),
    total_amount: '₹' + total.toLocaleString('en-IN'),
    delivery_mode: document.querySelector('input[name="deliveryMode"]:checked')?.value || 'Standard',
    delivery_date: document.getElementById('deliveryDate').value || 'Flexible',
    address: document.getElementById('addressLine1').value.trim() + (document.getElementById('addressLine2').value.trim() ? ', ' + document.getElementById('addressLine2').value.trim() : ''),
    city: document.getElementById('city').value.trim(),
    state: document.getElementById('state').value,
    pincode: document.getElementById('pincode').value.trim(),
    notes: document.getElementById('notes').value.trim() || 'None',
    owner_email: CONFIG.OWNER_EMAIL,
    to_name: 'GroundnutOil Markets Team',
  };

  return ref;
}

// ──────────────────────────────────────────────
// SUBMIT ORDER → Web3Forms
// ──────────────────────────────────────────────
async function submitOrder(e) {
  e.preventDefault();
  if (!validateStep3()) return;

  const ref = collectOrderData();
  const btn = document.getElementById('submitBtn');
  const txtEl = document.getElementById('submitText');
  const spinEl = document.getElementById('submitSpinner');

  // Loading state
  btn.disabled = true;
  txtEl.style.display = 'none';
  spinEl.style.display = 'inline';

  // If key not set yet → demo mode
  if (!CONFIG.WEB3FORMS_KEY || CONFIG.WEB3FORMS_KEY === 'YOUR_WEB3FORMS_KEY') {
    await new Promise(r => setTimeout(r, 1500));
    showSuccess(ref, true);
    return;
  }

  // Build a clean email body
  const emailBody = `
🛒 NEW GROUNDNUT OIL ORDER
━━━━━━━━━━━━━━━━━━━━━━━━━━
Order Ref   : ${orderData.order_ref}
Order Date  : ${orderData.order_date}

👤 CUSTOMER
Name        : ${orderData.customer_name}
Email       : ${orderData.customer_email}
Phone       : ${orderData.customer_phone}
Type        : ${orderData.customer_type}
Company     : ${orderData.company}
GSTIN       : ${orderData.gstin}

🥜 PRODUCT
Oil Type    : ${orderData.oil_type}
Quantity    : ${orderData.quantity}
Packaging   : ${orderData.packaging}
Unit Price  : ${orderData.unit_price}
Oil Cost    : ${orderData.oil_cost}
GST (5%)    : ${orderData.gst_amount}
Total       : ${orderData.total_amount}

🚚 DELIVERY
Address     : ${orderData.address}
City        : ${orderData.city}, ${orderData.state} - ${orderData.pincode}
Delivery    : ${orderData.delivery_mode}
Pref. Date  : ${orderData.delivery_date}

📝 NOTES
${orderData.notes}
━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: CONFIG.WEB3FORMS_KEY,
        subject: `🛒 New Order ${orderData.order_ref} — ${orderData.oil_type} (${orderData.quantity})`,
        from_name: orderData.customer_name,
        email: CONFIG.OWNER_EMAIL,       // send to owner
        replyto: orderData.customer_email, // reply goes to customer
        message: emailBody,
        botcheck: false,
      }),
    });

    const json = await res.json();
    if (json.success) {
      showSuccess(ref, false);
    } else {
      throw new Error(json.message || 'Web3Forms returned an error');
    }
  } catch (err) {
    console.error('Email error:', err);
    btn.disabled = false;
    txtEl.style.display = 'inline';
    spinEl.style.display = 'none';
    alert('⚠️ Could not send email right now. Please check your internet connection and try again.\n\nError: ' + err.message);
  }
}

function showSuccess(ref, devMode) {
  document.getElementById('orderForm').style.display = 'none';
  document.getElementById('orderSuccess').style.display = 'block';
  document.getElementById('orderRef').textContent = ref;
  if (devMode) {
    document.getElementById('orderSuccess').insertAdjacentHTML('afterbegin',
      '<div style="background:rgba(245,166,35,0.1);border:1px solid var(--gold);border-radius:10px;padding:0.8rem 1rem;font-size:0.8rem;color:var(--gold);margin-bottom:1rem;">'
      + '<strong>⚠️ Almost ready!</strong> Go to <a href="https://web3forms.com" target="_blank" style="color:var(--gold-light)">web3forms.com</a>, '
      + 'enter <strong>agghnv@gmail.com</strong>, copy the Access Key, and paste it as <code>WEB3FORMS_KEY</code> in order.js. Done!'
      + '</div>'
    );
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  document.getElementById('orderForm').reset();
  document.getElementById('orderForm').style.display = 'block';
  document.getElementById('orderSuccess').style.display = 'none';
  goToStep(1);
  updateSummary();
}
window.resetForm = resetForm;

// ──────────────────────────────────────────────
// SET MIN DATE for delivery date picker
// ──────────────────────────────────────────────
function initDeliveryDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 3);
  const el = document.getElementById('deliveryDate');
  if (el) el.min = tomorrow.toISOString().split('T')[0];
}

// ──────────────────────────────────────────────
// BOOT
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  initNavScroll();
  initQtyStepper();
  initOilCards();
  initPackaging();
  initDeliveryDate();
  updateSummary();
  updateClock();
  setInterval(updateClock, 1000);

  // Step navigation
  document.getElementById('toStep2').addEventListener('click', () => {
    if (validateStep1()) goToStep(2);
  });
  document.getElementById('toStep3').addEventListener('click', () => {
    if (validateStep2()) goToStep(3);
  });
  document.getElementById('backToStep1').addEventListener('click', () => goToStep(1));
  document.getElementById('backToStep2').addEventListener('click', () => goToStep(2));

  // Form submit
  document.getElementById('orderForm').addEventListener('submit', submitOrder);

  // Make step dots clickable (for completed steps)
  for (let i = 1; i <= 3; i++) {
    document.getElementById('step' + i + 'Dot').addEventListener('click', () => {
      if (i < currentStep) goToStep(i);
    });
  }
});
