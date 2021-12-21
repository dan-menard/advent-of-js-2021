<script>
  import Bill from './Bill.svelte';
  import People from './People.svelte';
  import TipPercentagePicker from './TipPercentagePicker.svelte';

  import {validateBill, validatePeople} from './validators.js';

  let peopleCount = 0;
  let billTotal = 0;
  let tipPercentage = '20%';

  let tipAmount = 0;
  let billAmount = 0;

  let tipFormatted = '';
  let tppFormatted = '';

  function calculate() {
    const tipValue = Number(tipPercentage.split('%')[0]);
    const billValue = Number(validateBill(billTotal));
    const peopleValue = validatePeople(peopleCount);

    tipAmount = billValue * (tipValue / 100);
    billAmount = peopleValue ? (billValue + tipAmount) / peopleValue : 0;
  }

  $: {
    tipFormatted = tipAmount.toFixed(2);
    tppFormatted = billAmount.toFixed(2);
  }
</script>

<main>
  <div class="wrapper">
    <div class="tip-amount">
      <div class="label">Tip Amount</div>
      <div class="dollars"><sup>$</sup><span id="tip-amount">{tipFormatted}</span></div>
    </div>
    <div class="total-per-person">
      <div class="label">Total Per Person</div>
      <div class="dollars"><sup>$</sup><span id="total-per-person">{tppFormatted}</span></div>
    </div>

    <div class="input-fields">
      <Bill bind:billTotal={billTotal} />
      <People bind:peopleCount={peopleCount} />
    </div>

    <TipPercentagePicker bind:tipPercentage={tipPercentage} />

    <div class="button-wrapper">
      <button id="calculate" on:click={calculate}>Calculate</button>
    </div>
  </div>
</main>
