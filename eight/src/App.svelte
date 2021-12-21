<script>
  export let api, location;

  import { onMount } from "svelte";

  import WeatherCard from './WeatherCard.svelte';
  import WeatherSvg from './WeatherSvg.svelte';

  let sevenDayForecast = [];
  const partCloudsTypes = [
    'scattered clouds',
    'few clouds'
  ];

  function getWeatherType(weather) {
    if (weather.main === 'Clouds' && partCloudsTypes.includes(weather.description)) {
      return 'PartClouds';
    }

    return weather.main;
  }

  onMount(async () => {
    const params = [
      `appId=${api.appId}`,
      `lat=${location.lat}`,
      `lon=${location.lon}`,
      `units=${location.units}`,
      `exclude=${api.exclusions}`
    ].join('&');

    fetch(`${api.url}?${params}`)
    .then(response => response.json())
    .then((data) => {
      sevenDayForecast = data.daily.map((forecast) => {
        return {
          date: new Date(forecast.dt * 1000),
          weather: {
            type: getWeatherType(forecast.weather[0]),
            high: Math.round(forecast.temp.max),
            low: Math.round(forecast.temp.min),
            pop: forecast.pop
          }
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
  });

</script>

<div class="wrapper">
  <WeatherSvg />

  {#each sevenDayForecast as forecast}
    <WeatherCard date={forecast.date} weather={forecast.weather} />
  {/each}
</div>
