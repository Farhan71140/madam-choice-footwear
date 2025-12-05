// Start payment: call backend to create an order, then go to payment page
async function startPayment(productId, productName, amount) {
  const customer_name = prompt('Your Name');
  const customer_phone = prompt('Your Phone (10 digits)');
  if (!customer_name || !customer_phone) return alert('Please enter name and phone');

  const res = await fetch('/api/orders/create', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ product_id: productId, product_name: productName, amount, customer_name, customer_phone })
  });
  const data = await res.json();
  if (data.payment_link) {
    window.location.href = data.payment_link;
  } else {
    alert('Could not start payment. Try again.');
  }
}

// On payment page: ask user to confirm they’ve paid, then (for now) show WhatsApp link.
// Replace this with webhook-triggered server message when you integrate a real gateway.
async function confirmPaid(orderId, productName, amount) {
  // In production: you’ll receive a webhook to mark paid. This button should ideally just show status.
  // For now, ask the user for a UPI reference ID as an extra check.
  const ref = prompt('Enter UPI Reference/Transaction ID');
  if (!ref) return alert('Please provide the UPI reference ID after payment.');

  // Simulate verified payment: redirect to WhatsApp message
  const msg =
    `Hello Madam Choice,\n` +
    `Order ID: ${orderId}\n` +
    `Product: ${productName}\n` +
    `Amount Paid: ₹${amount}\n` +
    `UPI Ref: ${ref}\n` +
    `Please confirm my order.`;
  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/919395550002?text=${encoded}`, '_blank');
}

// Reviews: submit and load
async function submitReviewForm(e) {
  e.preventDefault();
  const name = document.getElementById('reviewName').value;
  const text = document.getElementById('reviewText').value;
  const ratingEl = document.querySelector('input[name="rating"]:checked');
  const rating = ratingEl ? Number(ratingEl.value) : 0;
  if (!name || !text || !rating) return alert('Please complete all fields.');

  await fetch('/api/reviews', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ name, rating, text })
  });
  loadReviews();
  e.target.reset();
}

async function loadReviews() {
  const res = await fetch('/api/reviews');
  const list = await res.json();
  const container = document.getElementById('reviews');
  if (!container) return;
  container.innerHTML = list.map(r => `
    <div class="card mb-2 p-2">
      <strong>${r.name}</strong> — ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
      <p class="mb-0">${r.text}</p>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadReviews);