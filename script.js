async function getWeather(cityName) {
  const weatherBox = document.getElementById('weather-box');
  weatherBox.innerHTML = ''; // clear previous results

  let city = cityName || document.getElementById('city').value.trim();
  if (!city) {
    weatherBox.innerHTML = "<h3>Please enter a city name.</h3>";
    return;
  }

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=1f0607942f8b49ec859103730251406&q=${city}`);
    if (!response.ok) throw new Error("Weather data not found.");
    const data = await response.json();

    // Day/Night theme based on API
    document.body.className = data.current.is_day ? 'day-theme' : 'night-theme';

    // Weather icon
    const img = document.createElement('img');
    img.src = data.current.condition.icon;
    img.alt = data.current.condition.text;
    img.id = 'icon';
    weatherBox.appendChild(img);

    // Weather details
    const details = [
      `City: ${data.location.name}`,
      `State: ${data.location.region}`,
      `Country: ${data.location.country}`,
      `Temperature: ${data.current.temp_c}°C`,
      `Condition: ${data.current.condition.text}`,
      `Wind Speed: ${data.current.wind_kph} kph`,
      `Summary: Your location is ${data.location.name}, ${data.location.region}, ${data.location.country}. Temperature: ${data.current.temp_c}°C, Wind: ${data.current.wind_kph} kph, Weather: ${data.current.condition.text}.`
    ];

    details.forEach(text => {
      const h3 = document.createElement('h3');
      h3.textContent = text;
      weatherBox.appendChild(h3);
    });

  } catch (err) {
    weatherBox.innerHTML = `<h3>Error: ${err.message}</h3>`;
  }
}

// Button events
document.getElementById('searchBtn').addEventListener('click', () => getWeather());
document.getElementById('locBtn').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
      getWeather(coords);
    }, () => {
      document.getElementById('weather-box').innerHTML = "<h3>Unable to get location.</h3>";
    });
  } else {
    document.getElementById('weather-box').innerHTML = "<h3>Geolocation not supported.</h3>";
  }
});
