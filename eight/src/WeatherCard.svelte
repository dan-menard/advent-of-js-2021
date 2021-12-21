<script>
  export let date;
  export let weather;

  const weatherSvgMap = {
    Clear: {
      href: '#sunny',
      w: 208,
      h: 213
    },
    Clouds: {
      href: '#cloudy',
      w: 264,
      h: 116
    },
    PartClouds: {
      href: '#partly-cloudy',
      w: 230,
      h: 209
    },
    Rain: {
      href: '#rainy',
      w: 160,
      h: 222
    },
    Snow: {
      href: '#snowy',
      w: 230,
      h: 196
    },
    Thunderstorm: {
      href: '#stormy',
      w: 246,
      h: 187
    },
  };

  const dayShort = new Intl.DateTimeFormat('en-US', {weekday: 'short'}).format(date);
  const svgProps = weatherSvgMap[weather.type];
</script>

<div class="day">
  <div class="day-of-week">{dayShort}</div>
  <div class="date">{date.getDate()}</div>

  <div class="bar sunny">
    <div class="weather">
      <svg role="img" width="{svgProps.w}" height="{svgProps.h}" viewBox="0 0 {svgProps.w} {svgProps.h}">
        <use xlink:href="{svgProps.href}"></use>
      </svg>
    </div>
    <div class="temperature">
      {weather.high}<span class="degrees">&deg;</span>
    </div>
    <div class="content">
      <div class="precipitation">
        <svg role="img" class="icon">
          <use xlink:href="#precipitation"></use>
        </svg>
        {weather.pop * 100}%
      </div>
      <div class="low">
        <svg role="img" class="icon">
          <use xlink:href="#low"></use>
        </svg>
        {weather.low}&deg;
      </div>
    </div>
  </div>
</div>
