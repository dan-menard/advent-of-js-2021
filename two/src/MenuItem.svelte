<script>
  export let menuItem;

  import {formatPrice} from './helpers/formatPrice.js';
</script>

<li>
  <div class="plate">
    <img src="images/{menuItem.image}" alt="{menuItem.alt}" class="plate" />
  </div>

  <div class="content">
    <p class="menu-item">{menuItem.name}</p>
    <p class="price">{formatPrice(menuItem.price)}</p>

    {#if !menuItem.count}
      <button class="add">Add to Cart</button>
    {:else}
      <button class="in-cart">
        <img src="images/check.svg" alt="Check" />
        In Cart
      </button>
    {/if}
  </div>
</li>
