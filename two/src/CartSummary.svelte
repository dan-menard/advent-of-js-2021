<script>
  export let subtotal;

  import {formatPrice} from './helpers/formatPrice.js';

  const taxRate = 0.0975;
</script>

<div class="totals">
  <div class="line-item">
    <div class="label">Subtotal:</div>
    <div class="amount price subtotal">{formatPrice(subtotal)}</div>
  </div>
  <div class="line-item">
    <div class="label">Tax:</div>
    <div class="amount price tax">{formatPrice(subtotal * taxRate)}</div>
  </div>
  <div class="line-item total">
    <div class="label">Total:</div>
    <div class="amount price total">{formatPrice(subtotal + (subtotal * taxRate))}</div>
  </div>
</div>
