<script>
  export let playerPick;
  export let playAgain;

  const CHOICES = [
    'rock',
    'paper',
    'scissors'
  ];

  const IMAGES = {
    rock: {
      src: './images/rock.png',
      alt: 'Rock'
    },
    paper: {
      src: './images/paper.png',
      alt: 'Paper'
    },
    scissors: {
      src: './images/scissors.png',
      alt: 'Scissors'
    }
  };

  let playerWon = false;
  let computerWon = false;

  let playerImage = {};
  let computerImage = {};

  $: {
    if (playerPick) {
      const randomIndex = Math.floor(Math.random() * 3);
      const computerPick = CHOICES[randomIndex];

      playerImage = IMAGES[playerPick];
      computerImage = IMAGES[computerPick];

      playerWon = false;
      computerWon = false;

      if (computerPick !== playerPick) {
        switch(playerPick) {
          case 'rock':
            playerWon = computerPick === 'scissors';
            break;
          case 'paper':
            playerWon = computerPick === 'rock';
            break;
          case 'scissors':
            playerWon = computerPick === 'paper';
            break;
        }

        computerWon = !playerWon;

        document.body.classList.add('winner');
        document.body.classList.add(computerWon ? 'computer-wins' : 'you-win');
      }
    }
  }
</script>

<div class="your-pick">
  {#if playerWon}
    <h1 class="you-win">you win</h1>
  {/if}

  <img src={playerImage.src} alt={playerImage.alt} />
</div>

<div class="computer-pick">
  {#if computerWon}
    <h1 class="computer-wins">computer wins</h1>
  {/if}

  <img src={computerImage.src} alt={computerImage.alt} />
</div>

{#if !playerWon && !computerWon}
<div>
  <h1 class="nobody-wins">nobody wins</h1>
</div>
{/if}

<button class="play-again" on:click={playAgain}>
  play again?
</button>
