<script>
  export let menuItems;

  import CartItem from './CartItem.svelte';
  import CartSummary from './CartSummary.svelte';
  import MenuItem from './MenuItem.svelte';

  let subtotal;

  $: {
    subtotal = menuItems.reduce((total, item) => {
        const itemTotal = item.price * item.count;
        return total + itemTotal;
    }, 0);
  }
</script>

<main>
  <div class="wrapper menu">
    <div class="panel">
      <h1>To Go Menu</h1>

      <ul class="menu">
        {#each menuItems as menuItem}
          <MenuItem bind:menuItem={menuItem} />
        {/each}
      </ul>
    </div>

    <div class="panel cart">
      <h1>Your Cart</h1>

      {#if !menuItems.reduce((total, item) => total + item.count, 0)}
        <p class="empty">Your cart is empty.</p>
      {:else}
        <ul class="cart-summary">
          {#each menuItems as menuItem}
            {#if menuItem.count}
              <CartItem bind:menuItem={menuItem} />
            {/if}
          {/each}
        </ul>

        <CartSummary subtotal={subtotal} />
      {/if}
    </div>
  </div>
</main>

