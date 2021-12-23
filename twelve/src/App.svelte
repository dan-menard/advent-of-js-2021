<script>
  import RevealResult from './RevealResult.svelte';

  let playerPick = null;
  let makeChoiceVisible = true;

  function onChoiceMade(choice) {
    playerPick = choice;
    makeChoiceVisible = false;
  }

  const playAgain = () => {
    makeChoiceVisible = true;
    playerPick = null;
  }

  $: {
    if (!playerPick) {
      document.body.className = '';
    }
  };
</script>

<div class="wrapper">
  <div class={makeChoiceVisible ? 'show' : 'hide'}>
    <h1>pick one</h1>

    <ul>
      <li class="pick-one">
        <button on:click={() => onChoiceMade('rock')}>
          <img src="./images/rock.png" alt="Rock" />
          rock
        </button>
      </li>
      <li class="pick-one">
        <button on:click={() => onChoiceMade('paper')}>
          <img src="./images/paper.png" alt="Paper" />
          paper
        </button>
      </li>
      <li class="pick-one">
        <button on:click={() => onChoiceMade('scissors')}>
          <img src="./images/scissors.png" alt="Scissors" />
          scissors
        </button>
      </li>
    </ul>
  </div>

  <div class={makeChoiceVisible ? 'hide' : 'show'}>
    <RevealResult bind:playerPick={playerPick} playAgain={playAgain} />
  </div>
</div>
