// ✅ Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// ✅ Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ✅ Add product to cart with quantity
function addToCart(productName, price, quantity = 1) {
  let cart = getCart();

  // Check if product already exists
  let existing = cart.find(item => item.name === productName);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ name: productName, price: price, quantity: quantity });
  }

  saveCart(cart);
  updateCart();
  alert(`${productName} ×${quantity} added to cart!`);
}

// ✅ Remove product from cart
function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1); // remove item by index
  saveCart(cart);
  updateCart();
}

// ✅ Update cart display (used in product pages)
function updateCart() {
  let cart = getCart();
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (!cartItems || !cartTotal) return; // If not on cart page, skip

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity;
    total += itemTotal;
    cartItems.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.name} × ${item.quantity} – ₹${itemTotal}
        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">❌ Remove</button>
      </li>`;
  });

  cartTotal.innerText = total;
  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }
}

// ✅ Render cart (used in cart.html)
function renderCart() {
  updateCart();
}

// ✅ Checkout: show payment modal
function checkoutCart() {
  let cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("paymentAmount").innerText = total;

  const modal = new bootstrap.Modal(document.getElementById("paymentModal"));
  modal.show();
}

// ✅ Confirm payment: send WhatsApp message
function confirmCartPayment() {
  let cart = getCart();
  const upiRef = document.getElementById("upiRef").value;
  const txnId = document.getElementById("txnId").value;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!upiRef || !txnId) {
    alert("Please enter UPI Reference ID and Transaction ID.");
    return;
  }

  const productList = cart.map(item => `${item.name} × ${item.quantity} (₹${item.price * item.quantity})`).join(", ");
  const message = `Hello Madam Choice,\nI have paid ₹${total} for the following products:\n${productList}\nUPI Ref: ${upiRef}\nTransaction ID: ${txnId}\nPlease confirm my order.`;

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/919133028638?text=${encoded}`, "_blank");
}

// ✅ Clear cart
function clearCart() {
  localStorage.removeItem("cart");
  updateCart();
  alert("Cart has been cleared!");
}