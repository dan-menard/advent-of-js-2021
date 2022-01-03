(() => {
  let debounce;
  let lastScrollY;

  let allHeadings;
  let allLinks;

  function updateSelection({target}) {
    if (target.nodeName !== 'A') {
      return;
    }

    document.querySelector('.selected').classList.remove('selected');
    target.parentNode.classList.add('selected');
  }

  function getCurrentHeadingIndex() {
    const currentHeadingText = document.querySelector('.selected').children[0].textContent;
    const lastHeadingText = allHeadings.at(-1).textContent;

    if (currentHeadingText === lastHeadingText) {
      return null;
    }

    let currentHeadingIndex;

    allHeadings.find((heading, index) => {
      const found = heading.textContent === currentHeadingText;

      if (found) {
        currentHeadingIndex = index;
      }

      return found;
    });

    return currentHeadingIndex;
  }

  function checkNextHeading() {
    const nextHeading = allHeadings[getCurrentHeadingIndex() + 1];

    if (!nextHeading) {
      return;
    }

    const nextHeadingRect = nextHeading.getBoundingClientRect();

    if (nextHeadingRect.top - (window.innerHeight / 2) < 0) {
      const nextLink = allLinks.find((link) => link.textContent === nextHeading.textContent);

      if (nextLink) {
        updateSelection({target: nextLink});
      } else {
        console.warn(`Couldn't find link: ${nextHeading.textContent}`);
      }
    }
  }

  function checkPrevHeading() {
    const prevHeading = allHeadings[getCurrentHeadingIndex() - 1];

    if (!prevHeading) {
      return;
    }

    const prevHeadingRect = prevHeading.getBoundingClientRect();

    if (prevHeadingRect.bottom - (window.innerHeight / 4) > 0) {
      const prevLink = allLinks.find((link) => link.textContent === prevHeading.textContent);

      if (prevLink) {
        updateSelection({target: prevLink});
      } else {
        console.warn(`Couldn't find link: ${prevHeading.textContent}`);
      }
    }
  }

  function onScroll(scrollEvent) {
    if (debounce) {
      window.cancelAnimationFrame(debounce);
    }

    debounce = window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const scrollingDown = !lastScrollY || lastScrollY < scrollY;

      if (scrollingDown) {
        checkNextHeading();
      } else {
        checkPrevHeading();
      }

      lastScrollY = scrollY;
    });
  }

  function listen() {
    document.querySelector('ul').addEventListener('click', updateSelection);
    window.addEventListener('scroll', onScroll)

    allHeadings = Array.from(document.querySelectorAll('h3'));
    allLinks = Array.from(document.querySelectorAll('ul a'));
  }

  document.addEventListener('DOMContentLoaded', listen);
})();
