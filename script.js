// Fetch weather data and update UI
async function getWeather(cityName) {
  let city = cityName || document.querySelector('#city').value.trim();

  // Handle empty input
  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=1f0607942f8b49ec859103730251406&q=${city}`);

    // Handle fetch errors
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const data = await response.json();

    // Handle API errors
    if (data.error) {
      throw new Error(data.error.message);
    }

    // Update UI elements
    document.querySelector('#City').textContent = `🌆 City: ${data.location.name}`;
    document.querySelector('#state').textContent = `🏙️ State: ${data.location.region}`;
    document.querySelector('#Country').textContent = `🌍 Country: ${data.location.country}`;
    document.querySelector('#Celsius').textContent = `🌡️ Temperature: ${data.current.temp_c}°C`;
    document.querySelector('#Condition').textContent = `☁️ Condition: ${data.current.condition.text}`;
    document.querySelector('#windspeed').textContent = `💨 Wind Speed: ${data.current.wind_kph} kph`;

    // Display weather icon
    const icon = document.querySelector('#icon');
    icon.src = `https:${data.current.condition.icon}`;
    icon.style.display = "block";

    // Improved summary message
    document.querySelector('#summary').textContent =
      `Currently in ${data.location.name}, ${data.location.region}, ${data.location.country}, the weather is ${data.current.condition.text} with a temperature of ${data.current.temp_c}°C and wind speed of ${data.current.wind_kph} kph.`;

    // Apply day/night theme
    applyTheme(data.current.is_day);

  } catch (error) {
    document.querySelector('#weather-box').innerHTML = `<h3 style="color:red;">Error: ${error.message}</h3>`;
  }
}

// Auto-detect user location
function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=1f0607942f8b49ec859103730251406&q=${lat},${lon}`);
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message);
        }

        // Use the refactored getWeather function with city name
        getWeather(data.location.name);

      } catch (error) {
        document.querySelector('#weather-box').innerHTML = `<h3 style="color:red;">Error: ${error.message}</h3>`;
      }

    }, () => {
      alert("Location access denied. Please enter city manually.");
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Switch theme based on day/night
function applyTheme(isDay) {
  if (isDay === 1) {
    document.body.classList.remove("night-theme");
    document.body.classList.add("day-theme");
  } else {
    document.body.classList.remove("day-theme");
    document.body.classList.add("night-theme");
  }
}

// Press Enter key to trigger search
document.querySelector('#city').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') getWeather();
});
