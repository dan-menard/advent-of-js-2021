<script>
  export let billTotal;

  import {validateBill} from './validators.js';

  function validate(changeEvent) {
    changeEvent.target.value = validateBill(changeEvent.target.value);
  }
</script>

<div class="bill-amount">
  <div class="field">
    <input type="text" id="bill-amount" name="bill-amount" bind:value="{billTotal}" on:change="{validate}" />
  </div>
  <div class="label">Bill Amount</div>
</div>
