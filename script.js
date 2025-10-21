async function getWeather(cityName) {
  let city = cityName || document.querySelector('#city').value.trim();
  if (city === "") {
    alert("Please enter a city name!");
    return;
  }

  try {
    let response = await fetch(`https://api.weatherapi.com/v1/current.json?key=1f0607942f8b49ec859103730251406&q=${city}`);
    let data = await response.json();

    if (data.error) {
      document.querySelector('#weather-box').innerHTML = `<h3 style="color:red;">${data.error.message}</h3>`;
      return;
    }

    document.querySelector('#City').innerHTML = "🌆 City: " + data.location.name;
    document.querySelector('#state').innerHTML = "🏙️ State: " + data.location.region;
    document.querySelector('#Country').innerHTML = "🌍 Country: " + data.location.country;
    document.querySelector('#Celsius').innerHTML = "🌡️ Temperature: " + data.current.temp_c + "°C";
    document.querySelector('#Condition').innerHTML = "☁️ Condition: " + data.current.condition.text;
    document.querySelector('#windspeed').innerHTML = "💨 Wind Speed: " + data.current.wind_kph + " kph";
    document.querySelector('#summary').innerHTML =
      `In ${data.location.name}, ${data.location.country}, it’s currently ${data.current.condition.text} with a temperature of ${data.current.temp_c}°C and wind speed of ${data.current.wind_kph} kph.`;

    const icon = document.querySelector('#icon');
    icon.src = "https:" + data.current.condition.icon;
    icon.style.display = "block";

    applyTheme(data.current.is_day);

  } catch (error) {
    document.querySelector('#weather-box').innerHTML = `<h3 style="color:red;">Failed to fetch data. Please try again.</h3>`;
  }
}

function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      let response = await fetch(`https://api.weatherapi.com/v1/current.json?key=1f0607942f8b49ec859103730251406&q=${lat},${lon}`);
      let data = await response.json();
      getWeather(data.location.name);
    }, () => {
      alert("Location access denied. Please enter city manually.");
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
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

document.querySelector('#city').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    getWeather();
  }
});
