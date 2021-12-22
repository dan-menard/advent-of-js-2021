(() => {
  function getExpandableNode(startingNode) {
    while(startingNode.nodeName !== 'LI') {
      startingNode = startingNode.parentNode;

      if (startingNode === document.body) {
        // Defensive, yes, but unbounded while loops scare me.
        throw 'Almost hit an infinite loop. Be more careful!';
      }
    }

    return startingNode;
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('ul').addEventListener('click', ({target}) => {
      getExpandableNode(target).classList.toggle('expand');
    });
  });
})();
