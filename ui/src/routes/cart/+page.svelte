<script>
  import { onMount } from "svelte";
  import { getCookie, timeStamp } from "$lib/shopUtils";

  const cartService = `http://localhost:5172`;
  let cart = [];
  let total = 0;
  let notification = "";
  let showNotification = false;
  let paymentModalVisible = false;
  let orderCompleteModalVisible = false;

  // fetchCart will fetch all of the fruit in the cart
  async function fetchCart() {
    try {
      const cartId = getCookie("cart_id");
      const callId = `get-cart-${cartId}-${timeStamp()}`;
      const response = await fetch(
        `${cartService}/cart?callId=${callId}&cartId=${cartId}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      cart = data.cart;
      console.log(cart);
      total = 0;
      for (const item of cart) {
        total += item.price;
      }
    } catch (error) {
      alert(`Failed to fetch cart: ${error.message}`);
    }
  }

  // removeFromCart will remove the selected fruit from the cart
  async function removeFromCart(fruit) {
    try {
      const cartId = getCookie("cart_id");
      const callId = `remove-${cartId}-${fruit.name}-${timeStamp()}`;
      const response = await fetch(`${cartService}/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId: callId, cartId: cartId, fruit: fruit }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      notification = data.message;
      showNotification = true;
      fetchCart();
      setTimeout(() => {
        showNotification = false;
      }, 4000);
    } catch (e) {
      let errorMessage = "An unknown error has occurred";
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      alert(`Failed to remove item from cart: ${errorMessage}`);
    }
  }

  // startCheckout starts a "mock" checkout process
  async function startCheckout() {
    try {
      const cartId = getCookie("cart_id");
      const callId = `checkout-${cartId}-${timeStamp()}`;
      const response = await fetch(`${cartService}/cart/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId: callId, cartId: cartId }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      closePaymentModal();
      showOrderCompleteModal();
      fetchCart();
    } catch (e) {
      let errorMessage = "An unknown error has occurred";
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      alert(`Checkout failed: ${errorMessage}`);
    }
  }

  function showPaymentModal() {
    paymentModalVisible = true;
  }

  function closePaymentModal() {
    paymentModalVisible = false;
  }

  function showOrderCompleteModal() {
    orderCompleteModalVisible = true;
  }

  function closeOrderCompleteModal() {
    orderCompleteModalVisible = false;
  }

  onMount(fetchCart);
</script>

<div>
  <div class="cart-header">
    <h2>Your Cart | Total ${total.toFixed(2)}</h2>
    {#if cart.length > 0}
      <button class="checkout-button" on:click={() => showPaymentModal()}
        >Checkout</button
      >
    {/if}
  </div>
  <!-- Notification Banner -->
  {#if showNotification}
    <div class="notification">
      {notification}
    </div>
  {/if}
  {#if cart.length === 0}
    <p>Your cart is empty.</p>
  {:else}
    <ul>
      {#each cart as item}
        <div class="fruit">
          <h3>{item.name}</h3>
          <p class="fruit-img">{item.image}</p>
          <p>${item.price.toFixed(2)}</p>
          <button class="remove-from-cart" on:click={() => removeFromCart(item)}
            >Remove</button
          >
        </div>
      {/each}
    </ul>
  {/if}
</div>

<!-- Modal for Checkout -->
{#if paymentModalVisible}
  <div class="modal-backdrop" on:click={closePaymentModal}></div>
  <div class="modal">
    <h2>Checkout</h2>
    <p>Click the Pay button to "pay" and complete checkout.</p>
    <p>Click the Cancel button to return to shopping.</p>
    <button class="confirm-button" on:click={startCheckout}
      >Complete Payment</button
    >
    <button class="cancel-button" on:click={closePaymentModal}>Cancel</button>
  </div>
{/if}

{#if orderCompleteModalVisible}
  <div class="modal-backdrop" on:click={closeOrderCompleteModal}></div>
  <div class="modal">
    <h2>Order Complete!</h2>
    <p>Your payment was successful and your order will shipped shortly.</p>
    <button class="confirm-button" on:click={closeOrderCompleteModal}
      >Close</button
    >
  </div>
{/if}

<style>
  .notification {
    width: 100%;
    padding: 10px;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
    text-align: center;
    margin-bottom: 15px;
    border-radius: 0px;
  }

  .cart-header {
    display: flex;
    justify-content: space-between; /* This will push the button to the right */
    align-items: center; /* Vertically aligns the items */
    padding: 10px;
  }

  .checkout-button,
  .confirm-button,
  .cancel-button {
    border: 1px solid #ddd;
    background-color: #ffffff;
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: #000000;
    cursor: pointer;
  }

  .checkout-button:hover,
  .confirm-button:hover,
  .cancel-button:hover {
    background-color: #efefef;
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 0px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    z-index: 1000;
  }

  .fruit {
    border: 1px solid #ddd;
    padding: 1rem;
    text-align: center;
  }

  .fruit-img {
    margin: 0;
    padding: 0;
    font-size: 4em;
  }

  .remove-from-cart {
    background-color: #ffffff;
    border: 1px solid #ddd;
    color: #000000;
  }
</style>
