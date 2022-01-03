import App from './App.svelte';
import {videoData} from './sampleData.js'

const app = new App({
  target: document.body,
  props: {
    defaultEtag: 'n-CQPhskjY6gfovIvC9XGP68MMY',
    videos: videoData
  }
});

export default app;
