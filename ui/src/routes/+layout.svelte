<script>
  import Navbar from "$lib/Navbar.svelte";
</script>

<div class="container">
  <Navbar />
  <slot />
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
</style>
