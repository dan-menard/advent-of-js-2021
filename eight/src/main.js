import App from './App.svelte';
import {api} from './apiKey.js';

const apiUrl = 'https://api.openweathermap.org/data/2.5/onecall';

const app = new App({
  target: document.body,
  props: {
    api: {
      url: apiUrl,
      appId: api.key,
      exclusions: 'current,minutely,hourly,alerts',
    },
    location: {
      name: 'Ottawa',
      units: 'metric',
      lat: '45.411171',
      lon: '-75.69812'
    }
  }
});

export default app;
