(() => {
  let allStars;

  function nearestStar(node) {
    while(!node.classList.contains('star')) {
      node = node.parentNode;
    }

    return node;
  }

  function updateRating({target, type}) {
    const star = nearestStar(target);
    const starIndex = star.classList[1].split('-')[1];
    const className = type === 'click' ? 'star-committed' : 'star-proposed';

    allStars.slice(0, starIndex).forEach((star) => {
      star.classList.add(className);
    });

    allStars.slice(starIndex).forEach((star) => {
      star.classList.remove(className);
    });
  }

  function unfocusAll() {
    allStars.forEach((star) => {
      star.classList.remove('star-proposed');
    });
  }

  function listen() {
    document.querySelector('.star-rating').addEventListener('click', updateRating, 'star-committed');
    document.querySelector('.star-rating').addEventListener('mouseover', updateRating, 'star-propsed');
    document.querySelector('.star-rating').addEventListener('mouseleave', unfocusAll);

    allStars = Array.from(document.querySelectorAll('.star'));
  }

  document.addEventListener('DOMContentLoaded', listen);
})();
