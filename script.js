document.addEventListener("DOMContentLoaded", () => {

  // Refactored getWeather function
  async function getWeather(cityName) {
    let city = cityName || document.querySelector('#city')?.value.trim();
    if (!city) {
      alert("Please enter a city name!");
      return;
    }

    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=1f0607942f8b49ec859103730251406&q=${city}`);

      if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      // Update UI elements safely
      const cityEl = document.querySelector('#City');
      const stateEl = document.querySelector('#state');
      const countryEl = document.querySelector('#Country');
      const tempEl = document.querySelector('#Celsius');
      const condEl = document.querySelector('#Condition');
      const windEl = document.querySelector('#windspeed');
      const summaryEl = document.querySelector('#summary');
      const iconEl = document.querySelector('#icon');

      if (cityEl) cityEl.textContent = `🌆 City: ${data.location.name}`;
      if (stateEl) stateEl.textContent = `🏙️ State: ${data.location.region}`;
      if (countryEl) countryEl.textContent = `🌍 Country: ${data.location.country}`;
      if (tempEl) tempEl.textContent = `🌡️ Temperature: ${data.current.temp_c}°C`;
      if (condEl) condEl.textContent = `☁️ Condition: ${data.current.condition.text}`;
      if (windEl) windEl.textContent = `💨 Wind Speed: ${data.current.wind_kph} kph`;
      if (summaryEl) summaryEl.textContent =
        `Currently in ${data.location.name}, ${data.location.region}, ${data.location.country}, the weather is ${data.current.condition.text} with a temperature of ${data.current.temp_c}°C and wind speed of ${data.current.wind_kph} kph.`;

      if (iconEl) {
        iconEl.src = `https:${data.current.condition.icon}`;
        iconEl.style.display = "block";
      }

      applyTheme(data.current.is_day);

    } catch (error) {
      const weatherBox = document.querySelector('#weather-box');
      if (weatherBox) weatherBox.innerHTML = `<h3 style="color:red;">Error: ${error.message}</h3>`;
    }
  }

  // Auto-location function
  function getLocationWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=1f0607942f8b49ec859103730251406&q=${lat},${lon}`);
          const data = await response.json();
          if (data.error) throw new Error(data.error.message);
          getWeather(data.location.name);
        } catch (error) {
          const weatherBox = document.querySelector('#weather-box');
          if (weatherBox) weatherBox.innerHTML = `<h3 style="color:red;">Error: ${error.message}</h3>`;
        }
      }, () => alert("Location access denied. Please enter city manually."));
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }

  // Theme switcher
  function applyTheme(isDay) {
    if (isDay === 1) {
      document.body.classList.remove("night-theme");
      document.body.classList.add("day-theme");
    } else {
      document.body.classList.remove("day-theme");
      document.body.classList.add("night-theme");
    }
  }

  // Event listeners
  document.querySelector('#searchBtn')?.addEventListener('click', () => getWeather());
  document.querySelector('#locBtn')?.addEventListener('click', getLocationWeather());
  document.querySelector('#city')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') getWeather();
  });

});
