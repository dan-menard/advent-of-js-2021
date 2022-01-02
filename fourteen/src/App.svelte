<script>
  export let today;

  const daysOfTheWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  let todayDate = today.getDate();
  let todayMonth = today.getMonth();
  let todayYear = today.getFullYear();

  let month = today.getMonth();
  let year = today.getFullYear();

  let monthName;
  let firstDayOfTheMonth;
  let lastDateOfTheMonth;
  let weekCount;

  function loadPrevMonth() {
    if (month === 0) {
      year--;
      month = 11;
    } else {
      month--;
    }
  }

  function loadNextMonth() {
    if (month === 11) {
      year++;
      month = 0;
    } else {
      month++;
    }
  }

  $: {
    monthName = Intl.DateTimeFormat('en-us', {month: 'long'}).format(new Date(year, month, 1));

    firstDayOfTheMonth = new Date(year, month, 1).getDay();
    lastDateOfTheMonth = new Date(year, month + 1, 0).getDate();

    weekCount = 1;
    let counter = 0;

    while (counter < lastDateOfTheMonth) {
      weekCount++;
      counter+= 7;
    }
  }
</script>

<div class="wrapper">
  <button class="prev" on:click={loadPrevMonth}>
    <img src="images/previous.svg" alt="Previous" />
  </button>

  <div class="month">{monthName}, {year}</div>

  <button class="next" on:click={loadNextMonth}>
    <img src="images/next.svg" alt="Next" />
  </button>

  {#each daysOfTheWeek as day}
    <div class="day-of-week">{day}</div>
  {/each}

  {#each Array(weekCount * 7) as _, i}
    {#if i < firstDayOfTheMonth || i > firstDayOfTheMonth + lastDateOfTheMonth - 1}
      <div></div>
    {:else if year === todayYear && month === todayMonth && i - firstDayOfTheMonth + 1 === todayDate}
      <div class="today">{i - firstDayOfTheMonth + 1}</div>
    {:else}
      <div>{i - firstDayOfTheMonth + 1}</div>
    {/if}
  {/each}
</div>
