<script>
  import FeaturedVideo from './FeaturedVideo.svelte';
  import VideoGallery from './VideoGallery.svelte';

  export let defaultEtag;
  export let videos;

  let featuredVideo = videos.items.find((video) => {
    return video.etag === defaultEtag;
  });
</script>

<div class="wrapper">
  <header>
    <img src="images/logo.png" alt="YouTube" />
  </header>

  <FeaturedVideo bind:featuredVideo={featuredVideo} />

  <aside>
    <VideoGallery videos={videos.items} bind:featuredVideo={featuredVideo} />
  </aside>
</div>
