<script>
  //export let menuItems;

  import Bill from './Bill.svelte';
  import People from './People.svelte';
  import TipPercentagePicker from './TipPercentagePicker.svelte';

  //let subtotal;

  //$: {
  //  subtotal = menuItems.reduce((total, item) => {
  //      const itemTotal = item.price * item.count;
  //      return total + itemTotal;
  //  }, 0);
  //}
</script>

<main>
  <div class="wrapper">
    <div class="tip-amount">
      <div class="label">Tip Amount</div>
      <div class="dollars"><sup>$</sup><span id="tip-amount">15.30</span></div>
    </div>
    <div class="total-per-person">
      <div class="label">Total Per Person</div>
      <div class="dollars"><sup>$</sup><span id="total-per-person">39.11</span></div>
    </div>

    <div class="input-fields">
      <Bill />
      <People />
    </div>

    <TipPercentagePicker />

    <div class="button-wrapper">
      <button id="calculate">Calculate</button>
    </div>
  </div>
</main>
