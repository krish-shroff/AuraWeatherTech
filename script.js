async function getWeather() {
      let city = document.querySelector('#city').value.trim();
      let weather = await fetch(`https://api.weatherapi.com/v1/current.json?key=1f0607942f8b49ec859103730251406&q=${city}`);
      let data = await weather.json();

      document.querySelector('#City').innerHTML = "City: " + data.location.name;
      document.querySelector('#state').innerHTML = "State: " + data.location.region;
      document.querySelector('#Country').innerHTML = "Country: " + data.location.country;
      document.querySelector('#Celsius').innerHTML = "Temperature (C): " + data.current.temp_c + "°C";
      document.querySelector('#Condition').innerHTML = "Weather Condition: " + data.current.condition.text;
      document.querySelector('#windspeed').innerHTML = "Wind Speed: " + data.current.wind_kph + " kph";
      document.querySelector('#summary').innerHTML =
        "Your location is " + data.location.name + ", " +
        data.location.region + ", " + data.location.country +
        ". The temperature is " + data.current.temp_c + "°C with a wind speed of " +
        data.current.wind_kph + " kph. The weather is currently " +
        data.current.condition.text + ".";
    }