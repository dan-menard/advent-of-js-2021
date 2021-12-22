(() => {
  const content = [
    {
      'image': 'dave-hoefler-okUIdo6NxGo-unsplash.jpg',
      'caption': 'Photo by Dave Hoefler on Unsplash'
    },
    {
      'image': 'eugene-golovesov-EXdXp7Z4X4w-unsplash.jpg',
      'caption': 'Photo by Eugene Golovesov on Unsplash'
    },
    {
      'image': 'finding-dan-dan-grinwis-O35rT6OytRo-unsplash.jpg',
      'caption': 'Photo by Dan Grinwis on Unsplash'
    },
    {
      'image': 'jakob-owens-EwRM05V0VSI-unsplash.jpg',
      'caption': 'Photo by Jakob Owens on Unsplash'
    },
    {
      'image': 'jennifer-reynolds-_8HI5xf4TkE-unsplash.jpg',
      'caption': 'Photo by Jennifer reynolds on Unsplash'
    },
    {
      'image': 'kellen-riggin-SIBOiXKg0Ds-unsplash.jpg',
      'caption': 'Photo by Kellen Riggin on Unsplash'
    },
    {
      'image': 'rafael-hoyos-weht-zhkAp8DGkxw-unsplash.jpg',
      'caption': 'Photo by Rafael Hoyos on Unsplash'
    },
    {
      'image': 'sherman-yang-VBBGigIuaDY-unsplash.jpg',
      'caption': 'Photo by Sherman Yang n Unsplash'
    },
    {
      'image': 'silas-baisch-Wn4ulyzVoD4-unsplash.jpg',
      'caption': 'Photo by Silas Baisch on Unsplash'
    },
    {
      'image': 'sonya-romanovska-wzdXhyi3AiM-unsplash.jpg',
      'caption': 'Photo by Sonya Romanovska on Unsplash'
    },
    {
      'image': 'vincentiu-solomon-ln5drpv_ImI-unsplash.jpg',
      'caption': 'Photo by Vincentiu Solomon on Unsplash'
    },
  ];

  function contentIndexOf(src) {
    const imageFilename = src.split('/').pop();

    for (i=0; i<content.length; i++) {
      if (content[i].image === imageFilename) {
        return i;
      }
    }

    console.error('No matching image.');
  }

  function setFeaturedImage(index) {
    const featuredEl = document.querySelector('.feature');
    const featuredImage = content[index];

    featuredEl.children[0].src = `images/${featuredImage.image}`;
    featuredEl.children[1].textContent = featuredImage.caption;

    updateSelectedImage(index);
  }

  function updateSelectedImage(index) {
    document.querySelector('.selected').classList.remove('selected');
    document.querySelector('ul').children[index].classList.add('selected');
  }

  function listen() {
    const featuredImageSrc = document.querySelector('.feature img').src;
    IMAGE_BASE_URL = featuredImageSrc.split('/').slice(0, -1).join('/') + '/';

    // Listen for go-left
    document.querySelector('.left').addEventListener('click', () => {
      const featuredImage = document.querySelector('.feature img')
      const featuredImageIndex = contentIndexOf(featuredImage.src);

      if (featuredImageIndex === 0) {
        setFeaturedImage(content.length - 1);
      } else {
        setFeaturedImage(featuredImageIndex - 1);
      }
    });

    // Listen for go-right
    document.querySelector('.right').addEventListener('click', () => {
      const featuredImage = document.querySelector('.feature img')
      const featuredImageIndex = contentIndexOf(featuredImage.src);

      if (featuredImageIndex === content.length - 1) {
        setFeaturedImage(0);
      } else {
        setFeaturedImage(featuredImageIndex + 1);
      }
    });

    // Listen for direct image clicks.
    document.querySelector('ul').addEventListener('click', (clickEvent) => {
      const imageEl = clickEvent.target;
      setFeaturedImage(contentIndexOf(imageEl.src));
    });
  }

  document.addEventListener('DOMContentLoaded', listen);
})();
