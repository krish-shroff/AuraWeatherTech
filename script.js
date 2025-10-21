document.addEventListener("DOMContentLoaded", () => {

  function updateElement(id, content, isHTML = false) {
    let el = document.querySelector(`#${id}`);
    const weatherBox = document.querySelector('#weather-box') || document.body;
    if (!el) {
      el = document.createElement('h3');
      el.id = id;
      weatherBox.appendChild(el);
    }
    if (isHTML) el.innerHTML = content;
    else el.textContent = content;
  }

  function clearWeather() {
    const weatherBox = document.querySelector('#weather-box');
    if (weatherBox) weatherBox.innerHTML = '';
  }

  function applyTheme(isDay) {
    if (isDay === 1) {
      document.body.classList.remove("night-theme");
      document.body.classList.add("day-theme");
    } else {
      document.body.classList.remove("day-theme");
      document.body.classList.add("night-theme");
    }
  }

  async function getWeather(cityName) {
    const cityInput = document.querySelector('#city');
    let city = cityName || cityInput?.value.trim();
    if (!city) {
      alert("Please enter a city name!");
      return;
    }

    clearWeather();

    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=1f0607942f8b49ec859103730251406&q=${city}`);
      if (!response.ok) throw new Error(`Network response not ok (${response.status})`);
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      updateElement('City', `🌆 City: ${data.location.name}`);
      updateElement('state', `🏙️ State: ${data.location.region}`);
      updateElement('Country', `🌍 Country: ${data.location.country}`);
      updateElement('Celsius', `🌡️ Temperature: ${data.current.temp_c}°C`);
      updateElement('Condition', `☁️ Condition: ${data.current.condition.text}`);
      updateElement('windspeed', `💨 Wind Speed: ${data.current.wind_kph} kph`);
      updateElement('summary', `Currently in ${data.location.name}, ${data.location.region}, ${data.location.country}, the weather is ${data.current.condition.text} with a temperature of ${data.current.temp_c}°C and wind speed of ${data.current.wind_kph} kph.`);

      let iconEl = document.querySelector('#icon');
      const weatherBox = document.querySelector('#weather-box');
      if (!iconEl) {
        iconEl = document.createElement('img');
        iconEl.id = 'icon';
        weatherBox.appendChild(iconEl);
      }
      iconEl.src = `https:${data.current.condition.icon}`;
      iconEl.style.display = "block";

      applyTheme(data.current.is_day);

    } catch (error) {
      updateElement('summary', `<span style="color:red;">Error: ${error.message}</span>`, true);
    }
  }

  function getLocationWeather() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        clearWeather();
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=1f0607942f8b49ec859103730251406&q=${lat},${lon}`);
        if (!response.ok) throw new Error(`Network response not ok (${response.status})`);
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        updateElement('City', `🌆 City: ${data.location.name}`);
        updateElement('state', `🏙️ State: ${data.location.region}`);
        updateElement('Country', `🌍 Country: ${data.location.country}`);
        updateElement('Celsius', `🌡️ Temperature: ${data.current.temp_c}°C`);
        updateElement('Condition', `☁️ Condition: ${data.current.condition.text}`);
        updateElement('windspeed', `💨 Wind Speed: ${data.current.wind_kph} kph`);
        updateElement('summary', `Currently in ${data.location.name}, ${data.location.region}, ${data.location.country}, the weather is ${data.current.condition.text} with a temperature of ${data.current.temp_c}°C and wind speed of ${data.current.wind_kph} kph.`);

        let iconEl = document.querySelector('#icon');
        const weatherBox = document.querySelector('#weather-box');
        if (!iconEl) {
          iconEl = document.createElement('img');
          iconEl.id = 'icon';
          weatherBox.appendChild(iconEl);
        }
        iconEl.src = `https:${data.current.condition.icon}`;
        iconEl.style.display = "block";

        applyTheme(data.current.is_day);

      } catch (error) {
        updateElement('summary', `<span style="color:red;">Error: ${error.message}</span>`, true);
      }

    }, () => alert("Location access denied. Please enter city manually."));
  }

  document.querySelector('#searchBtn')?.addEventListener('click', () => getWeather());
  document.querySelector('#locBtn')?.addEventListener('click', getLocationWeather());
  document.querySelector('#city')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') getWeather();
  });

});
