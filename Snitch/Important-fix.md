Snitch
 
Go file by file, apply the fix, and confirm each change before movingce Snitch to ShopStream and  to the next.
ISSUE 1: Order schema mismatch (order.service.js)
Problem: createOrder() sends priceAtPurchase as an { amount, currency } object, 
but Order schema expects a flat Number. Also missing required productName and 
subtotal fields. paymentStatus/orderStatus sent as "Pending"/"Paid" but schema 
enum requires lowercase "pending"/"paid".
Fix: 
- priceAtPurchase: use price.amount (flat number), not the whole price object
- Add productName: product.title and variantName to each order item
- Compute and include top-level subtotal before adding tax/shipping
- Use lowercase "pending"/"paid"/"processing" everywhere for status fields
ISSUE 2: Razorpay never actually wired in (order.service.js, razorpay.service.js)
Problem: completePayment() marks orders as paid with zero payment verification — 
any authenticated user could POST an orderId and get it marked paid for free.
Fix:
- In razorpay.service.js add verifyPaymentSignature() using HMAC-SHA256 with 
  RAZORPAY_KEY_SECRET, and verifyWebhookSignature() using RAZORPAY_WEBHOOK_SECRET
- In order.service.js, createOrder() must call Razorpay's createOrder with the 
  server-computed totalAmount, save razorpayOrderId on the order, return both 
  order and razorpayOrder to the controller
- completePayment() must verify the signature before deducting stock or marking paid
- Add completePaymentFromWebhook() as a second, independent confirmation path, 
  idempotent if already paid
ISSUE 3: Stock deduction race condition (order.service.js)
Problem: completePayment() does read-stock -> subtract -> save, which is not 
atomic. Concurrent orders can both pass the check and oversell stock.
Fix: Replace with atomic conditional update: 
findOneAndUpdate({ _id, stock: { $gte: quantity } }, { $inc: { stock: -quantity } })
so it fails cleanly if stock changed between check and deduction.
ISSUE 4: Cart/order route base URL mismatch (product.service.js)
Problem: addToCart, getCart, updateCartItem, createOrder, etc. all call through 
axios instance baseURL "/api/product", but cart and order are separately mounted 
routers at "/api/cart" and "/api/order". Requests 404.
Fix: Create separate axios instances — cartApi (baseURL "/api/cart") and 
orderApi (baseURL "/api/order") — and route each function through the correct one.
ISSUE 5: addToCart field name mismatch (product.service.js)
Problem: frontend sends { productId, quantity, variant }, but backend controller 
reads req.body.variantId — variant is silently ignored, every add-to-cart is 
treated as the base product with no variant.
Fix: Rename the sent field to variantId to match backend.
ISSUE 6: updateCartItem/deleteCartItem wrong param shape (product.service.js)
Problem: functions accept an itemId and hit /cart/item/:itemId, but backend has 
no itemId concept — it identifies items by (productId, variantId) as query params.
Fix: Change signatures to (productId, variantId, quantity) and (productId, variantId), 
sending productId/variantId as query params to match req.query on the backend.
ISSUE 7: Payment page still using a fake/simulated payment (PaymentPage.jsx)
Problem: handlePayment() POSTs a fake razorpayPaymentId: "" directly with no real 
payment ever occurring — this is a placeholder "Simulated Payment Gateway" stub.
Fix: 
- handlePlaceOrder must capture both order and razorpayOrder from the checkout 
  response
- handlePayment must dynamically load https://checkout.razorpay.com/v1/checkout.js, 
  open window.Razorpay({ key: <public key_id only>, amount, currency, 
  order_id: razorpayOrder.id, handler: ... }).open()
- In the handler callback, POST the real razorpay_order_id, razorpay_payment_id, 
  razorpay_signature returned by Razorpay to /api/order/complete-payment
ISSUE 8: Webhook raw body not preserved (app.js / server entrypoint)
Problem: signature verification on the webhook will always fail because 
express.json() has already parsed and mutated the request body by the time the 
webhook controller tries to verify it against the raw bytes Razorpay signed.
Fix: Mount express.raw({ type: "application/json" }) specifically on the webhook 
route path BEFORE the global express.json() middleware, storing the raw buffer 
separately for signature verification and parsing JSON after for controller use.
ISSUE 9: Seller variant preview has no click-to-select (OneProduct.jsx)
Problem: seller product detail page shows only the base product image; there's no 
way to preview a variant's own image/price by clicking it.
Fix: Add selectedVariant state; clicking a variant card toggles selection and 
swaps the main image + price to that variant's data, with delete button using 
stopPropagation so it doesn't also trigger selection.
Apply all fixes, run the app, and verify: checkout creates a Razorpay order, 
payment completes via the real Razorpay modal, webhook and frontend-confirm 
paths both correctly mark orders paid exactly once, and adding two different 
variants of the same product creates two separate cart lines.
ISSUE 10: Category filter is non-functional (product.controller.js, product creation flow)
Problem: createProduct() never accepts or saves a `category` field — only title, 
description, price, stock, and images are stored. Meanwhile fetchAllProducts() 
filters by `filters.category = category` whenever a category other than "All" is 
selected in SearchSort.jsx. Since no product ever has a category value, every 
non-"All" filter returns zero results.
Fix:
- Add `category: { type: String, required: true }` to the Product schema
- Accept `category` in createProduct() controller/service and require it on the 
  product creation form (OneProduct.jsx / product creation page)
- Confirm fetchAllProducts()'s category filter then actually matches real data
ISSUE 11: Automatic product categorization
Problem: Sellers currently have no structured way to categorize products (e.g. 
Shirt vs T-Shirt vs Jeans), and manually maintaining a fixed dropdown 
(Clothing/Footwear/Accessories/Electronics/Lifestyle in SearchSort.jsx) doesn't 
scale to specific product types.
Fix:
- Define a two-level category system: broad category (Clothing, Footwear, 
  Accessories, Electronics) + specific subcategory/type (T-Shirt, Shirt, Jeans, 
  Sneakers, etc.), stored as `category` and `subcategory` fields on the Product schema
- On product creation, auto-suggest the subcategory by matching keywords in the 
  product title/description against a maintained list (e.g. "tee"/"t-shirt" -> 
  T-Shirt, "jean"/"denim" -> Jeans, "sneaker"/"trainer" -> Sneakers) — implement 
  as a small keyword-matching utility function run server-side in createProduct(), 
  not a hardcoded dropdown only
- Pre-fill the suggested subcategory in the seller's product form as an editable 
  field, so the seller can override an incorrect auto-suggestion before submitting
- Update SearchSort.jsx's category filter UI to pull the live list of subcategories 
  actually in use (aggregate distinct `subcategory` values from the Product 
  collection) instead of a static hardcoded array, so new types automatically 
  appear as filter options as sellers list them
ISSUE 12: Search bar — verify end-to-end wiring
Problem: SearchSort.jsx has a working search input UI, but need to confirm the 
`search` state actually debounces before firing a request (to avoid a network 
call on every keystroke) and that fetchAllProducts()'s $or regex search on 
title/description is correctly triggered with the current value on each change.
Fix:
- Add a debounce (300-400ms) on the search input before calling 
  handleFetchAllPublicProducts(), so typing doesn't fire a request per keystroke
- Confirm the search value is included in every products fetch alongside category/
  price/sort filters, not overwritten or dropped when other filters change
- If search currently returns no/wrong results, log the exact query sent and the 
  $or filter built server-side to confirm they match — report back if this still 
  fails after the debounce fix so the root cause can be narrowed further

ISSUE 13: Cart merges product + variant into one line (cart.model.js, 
cart.service.js, CartContext.jsx)
Problem: Adding two different variants of the same product should create two 
separate, independently removable cart lines — not merge into one. Backend 
schema/service and frontend context were reviewed and are structurally correct 
(items are keyed by variantKey, defaulting to "BASE" for no-variant items, and 
all read/update/remove operations match on the (productId, variantId) pair 
together). If merging is still observed at runtime:
Fix:
- Confirm no stale dev server/build is running (restart both frontend and 
  backend after any recent change)
- Log the raw response of POST /api/cart/add and GET /api/cart and confirm 
  cart.items contains a distinct entry per (productId, variantKey) pair
- If the API response itself shows merged items, check cart.service.js's 
  addToCart() itemIndex match logic — it should only merge quantities when 
  BOTH productId AND variantKey match an existing entry, never on productId alone
- If the API response is correct but the UI still shows one line, check 
  CartPage.jsx's key prop on each CartItem — it must be unique per 
  (productId, variantId), e.g. key={`${item.productId}-${item.variantId}`}, 
  not just key={item.productId}
ISSUE 14: OneProduct.jsx — selecting a variant should render ALL of that 
variant's details, not just the image
Problem: Previous fix only swapped the main image and price when a variant is 
selected. Stock, and any other variant-specific fields, still always display 
the base product's values regardless of which variant is selected.
Fix:
- When selectedVariant is set, the Base Stock line must show 
  selectedVariant.stock instead of product.stock
- When selectedVariant is set, price must show selectedVariant.price.amount / 
  .currency instead of product.price (already fixed — confirm still correct)
- Any other variant-level fields present in the schema (SKU, dimensions, 
  weight, etc. if they exist) must also render from selectedVariant when set, 
  falling back to the base product's fields only when no variant is selected
- The product Description remains the base product's description in both 
  cases (variants don't have their own description field) — this is expected, 
  not a bug, unless a variant-specific description field is added to the schema
- Add a clear visual label (already added: "Viewing: {variant.value}") so it's 
  obvious to the seller which data set — base product or selected variant — is 
  currently displayed

ISSUE 15: Order confirmation email/notification missing
Problem: After completePayment() succeeds, the buyer gets no confirmation — 
no email, no in-app notification. Sellers also aren't notified of new orders.
Fix:
- After marking an order "paid", trigger an order confirmation email to the 
  buyer (reuse existing Nodemailer setup from Zentro if applicable) with order 
  ID, items, total, and shipping address
- Notify the seller(s) whose products are in the order — a simple email or an 
  in-app "New Order" flag is sufficient for v1
ISSUE 16: No order cancellation / refund flow
Problem: Once an order is placed and paid, there's no way for a buyer to cancel 
or a seller to reject an order. orderStatus enum includes "cancelled" but 
nothing sets it, and there's no stock-restoration logic if an order is cancelled 
after stock was already deducted.
Fix:
- Add a cancelOrder(orderId, actorId) service method: allowed only while 
  orderStatus is "pending" or "processing", restores deducted stock via $inc 
  back onto the product/variant, sets orderStatus to "cancelled"
- If payment was already captured, mark paymentStatus "refunded" and note that 
  actual refund must be triggered via Razorpay's refund API 
  (razorpay.payments.refund(paymentId)) — wire this in if refunds are in scope
ISSUE 17: No inventory low-stock or out-of-stock seller alerts
Problem: Sellers have no visibility into stock running low until it hits zero.
Fix: Add a simple threshold check (e.g. stock <= 5) surfaced on the seller 
dashboard product list — a "Low Stock" badge is enough for v1, no need for 
email alerts unless requested.
ISSUE 18: Wishlist not connected to stock/price changes
Problem: WishlistContext exists (referenced in ProductDetails.jsx) but there's 
no indication whether wishlisted items go out of stock or change price while 
sitting in the wishlist.
Fix: On the wishlist page, show current stock/price for each item fetched live 
from the product, and flag "Out of Stock" or "Price Changed" where relevant 
rather than showing stale cached values.
ISSUE 19: Address book / saved addresses
Problem: PaymentPage.jsx has the buyer type a full shipping address on every 
single checkout — no saved-address reuse.
Fix: Add a simple Address subdocument array on the User model, let buyers save 
an address at checkout, and prefill the checkout form from the buyer's saved 
addresses on future orders with an option to add a new one.
ISSUE 20: Order tracking / status timeline for buyers
Problem: getUserOrders/getOrderById return the order but there's no dedicated 
"My Orders" or "Order Detail" page shown in what's been built so far — buyers 
have no way to see past orders or track status changes 
(pending -> processing -> shipped -> delivered).
Fix: Build an Order History page listing past orders with status badges, and 
an Order Detail page showing items, shipping address, payment status, and a 
simple visual status timeline.
ISSUE 21: Seller order fulfillment view incomplete
Problem: getSellerOrders() exists in order.service.js but there's no seller-
facing UI shown yet to view and update orders containing their products.
Fix: Build a Seller Orders page: list orders containing the seller's products, 
allow status updates (pending -> processing -> shipped) via the existing 
updateOrderStatus endpoint, respecting the ownership check already in place.
ISSUE 22: No pagination on seller product list
Problem: getAllProducts() in product.service.js has no pagination params — a 
seller with many products loads them all in one request.
Fix: Add limit/skip params to getAllProducts (mirroring the pattern already 
used in fetchAllPublicProducts), and add pagination controls to the seller 
dashboard product list.
ISSUE 23: Guest checkout / cart persistence
Problem: CartContext only fetches/persists cart when `user` is present — a 
logged-out visitor's cart is entirely in-memory and lost on refresh or logout, 
with no merge-on-login behavior.
Fix (optional, larger scope — confirm before implementing): either restrict 
adding to cart to logged-in users only with a clear prompt (simplest), or 
implement a guest cart in localStorage that merges into the server cart on 
login. Given time constraints, the simplest fix is enforcing login before 
add-to-cart everywhere (already partially done in CartContext.addToCart) and 
skip guest cart persistence for v1.
ISSUE 24: Rate limiting / abuse protection missing on public routes
Problem: fetchAllPublicProducts, fetchPublicProductById, and the review 
endpoints are public with no rate limiting — vulnerable to scraping/spam.
Fix: Add express-rate-limit middleware on public product/review GET routes 
and on review POST/PUT endpoints specifically to prevent review spam.