<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { v4 as uuidv4 } from "uuid";
  import { getCookie, checkForCookie, timeStamp } from "$lib/shopUtils";

  const cartService = `http://localhost:5172`;
  let cartId = "";
  let notification = "";
  let showNotification = false;

  let fruits = [
    { id: 1, name: "Pineapple", price: 5.75, image: "🍍" },
    { id: 2, name: "Banana", price: 0.25, image: "🍌" },
    { id: 3, name: "Cherry", price: 0.1, image: "🍒" },
    { id: 4, name: "Mango", price: 1.5, image: "🥭" },
    { id: 5, name: "Orange", price: 0.5, image: "🍊" },
    { id: 6, name: "Strawberry", price: 0.35, image: "🍓" },
  ];

  async function addToCart(fruit) {
    const cartId = getCookie("cart_id");
    const callId = `add-${cartId}-${fruit.name}-${timeStamp()}`;
    fruit.id = uuidv4();
    try {
      const response = await fetch(`${cartService}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId: callId, cartId: cartId, fruit: fruit }),
      });

      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Parse the response body as JSON
      const data = await response.json();

      // Use the message from the response (assuming the server returns a JSON with a message field)
      notification = data.message;
      showNotification = true;
      setTimeout(() => {
        showNotification = false;
      }, 4000);
    } catch (error) {
      // Handle errors, like network issues or server errors
      alert(`Failed to add ${fruit.name} to cart: ${error.message}`);
    }
  }

  onMount(() => {
    cartId = checkForCookie("cart_id");
  });
</script>

<div>
  <!-- Notification Banner -->
  {#if showNotification}
    <div class="notification">
      {notification}
    </div>
  {/if}
  <p>Click on a fruit to add it to your cart!</p>
  <div class="grid">
    {#each fruits as fruit}
      <div class="fruit" on:click={() => addToCart(fruit)}>
        <h3>{fruit.name}</h3>
        <p class="fruit-img">{fruit.image}</p>
        <p>${fruit.price.toFixed(2)}</p>
      </div>
    {/each}
  </div>
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

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .fruit {
    border: 1px solid #ddd;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
  }

  .fruit:hover {
    background-color: #f9f9f9;
  }

  .fruit-img {
    margin: 0;
    padding: 0;
    font-size: 4em;
  }

  @media (max-width: 768px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
