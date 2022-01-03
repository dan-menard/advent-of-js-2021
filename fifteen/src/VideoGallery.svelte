<script>
  export let videos;
  export let featuredVideo;
</script>

<ul class="gallery">
  {#each videos as video}
    <li>
      <a class="video" on:click={() => featuredVideo = video}>
        <img src={video.snippet.thumbnails.default.url} alt="">
        <h3>{video.snippet.title}</h3>
      </a>
    </li>
  {/each}
</ul>

<style>
  a {
    border: 4px solid transparent;
  }

  a:hover {
    cursor: pointer;
    border-color: #f0f;
    border-radius: 4px;
  }

  a.video h3 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-height: 2.5rem;
  }
</style>
