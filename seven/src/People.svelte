<script>
  export let peopleCount;

  import {validatePeople} from './validators.js';

  function validate(changeEvent) {
    changeEvent.target.value = validatePeople(changeEvent.target.value);
  }
</script>

<div class="number-of-people">
  <div class="field">
    <input type="text" id="number-of-people" name="number-of-people" bind:value="{peopleCount}" on:change="{validate}" />
  </div>
  <div class="label">Number of People</div>
</div>
