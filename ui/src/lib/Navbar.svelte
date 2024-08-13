<script>
  import { goto } from "$app/navigation";
</script>

<h1>The Fruit Shop</h1>
<nav>
  <a
    href="/"
    on:click={(e) => {
      e.preventDefault();
      goto("/");
    }}>Shop</a
  >
  <a
    href="/cart"
    on:click={(e) => {
      e.preventDefault();
      goto("/cart");
    }}>Cart</a
  >
</nav>

<style>
  nav {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  nav a {
    border: 1px solid #ddd;
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: #000000;
    cursor: pointer;
  }
</style>
