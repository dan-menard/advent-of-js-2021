<script>
  export let featuredVideo;
</script>

<div class="feature">
  <div class="embed">
    <iframe width="100%" height="500" src="https://www.youtube.com/embed/{featuredVideo.id.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>
  <h1>
    {featuredVideo.snippet.title}
  </h1>

  <p>{featuredVideo.snippet.description}</p>

</div>
