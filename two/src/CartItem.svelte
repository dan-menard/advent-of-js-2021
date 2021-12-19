<script>
  export let menuItem;

  import {formatPrice} from './helpers/formatPrice.js';
</script>

<li>
  <div class="plate">
    <img src="images/{menuItem.image}" alt="{menuItem.alt}" class="plate" />
    <div class="quantity">{menuItem.count}</div>
  </div>

  <div class="content">
    <p class="menu-item">{menuItem.name}</p>
    <p class="price">{formatPrice(menuItem.price)}</p>
  </div>

  <div class="quantity__wrapper">
    <button class="decrease" on:click={() => menuItem.count--}>
      <img src="images/chevron.svg" />
    </button>

    <div class="quantity">{menuItem.count}</div>

    <button class="increase" on:click={() => menuItem.count++}>
      <img src="images/chevron.svg" />
    </button>
  </div>

  <div class="subtotal">{formatPrice(menuItem.price * menuItem.count)}</div>
</li>
