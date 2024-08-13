<script>
  import { onMount } from "svelte";

  const cartService = `http://localhost:5172`;
  let cart = [];
  let total = 0;
  let notification = "";
  let showNotification = false;

  async function fetchCart() {
    try {
      const cartId = getCookie("cart_id");
      const response = await fetch(`${cartService}/cart?cartId=${cartId}`);

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

  async function removeFromCart(fruit) {
    try {
      const cartId = getCookie("cart_id");
      const response = await fetch(`${cartService}/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId: cartId, fruit: fruit }),
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
      fetchCart();
    } catch (error) {
      alert(`Failed to remove item from cart: ${error.message}`);
    }
  }

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  onMount(fetchCart);
</script>

<div>
  <h2>Your Cart | Total ${total.toFixed(2)}</h2>
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

<style>
  .notification {
    width: 100%;
    padding: 10px;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
    text-align: center;
    margin-bottom: 15px;
    border-radius: 4px;
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
