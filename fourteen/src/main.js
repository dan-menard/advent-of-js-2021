import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    today: new Date()
  }
});

export default app;
