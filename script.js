const apiKey = '49bf3d0f7e63064f57cfb16ecf199858'; 

document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('dark-mode-toggle');
  const isDarkMode = localStorage.getItem('darkMode') === 'true';

  // Initialize toggle state based on saved preference
  toggleSwitch.checked = isDarkMode;
  setDarkMode(isDarkMode);

  toggleSwitch.addEventListener('change', () => {
    const isChecked = toggleSwitch.checked;
    setDarkMode(isChecked);
    localStorage.setItem('darkMode', isChecked); // Save preference
  });
});

function setDarkMode(enable) {
  if (enable) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

function getWeather() {
  const city = document.getElementById('city-input').value.trim();
  if (!city) {
    alert('Please enter a city name.');
    return;
  }

  fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
  fetchForecast(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
}

function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
      fetchForecast(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function fetchWeather(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
    });
}

function fetchForecast(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
    });
}

function displayWeather(data) {
  document.getElementById('weather-result').classList.remove('d-none');
  document.getElementById('city-name').innerText = `${data.name}, ${data.sys.country}`;
  document.getElementById('date').innerText = new Date().toLocaleDateString();
  document.getElementById('temperature').innerText = `${Math.round(data.main.temp)}°C`;
  document.getElementById('weather-description').innerText = data.weather[0].description;

  document.getElementById('wind-speed').innerText = data.wind.speed;
  document.getElementById('humidity').innerText = data.main.humidity;
  document.getElementById('feels-like').innerText = Math.round(data.main.feels_like);
}

function displayForecast(data) {
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const forecastData = data.list[i * 8]; // Select data for each day
    const dayName = new Date(forecastData.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
    const temp = Math.round(forecastData.main.temp);
    const icon = forecastData.weather[0].icon; // Weather icon code
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`; // Icon URL from OpenWeatherMap

    forecastContainer.innerHTML += `
      <div class="forecast-item">
        <div>${dayName}</div>
        <img src="${iconUrl}" alt="${forecastData.weather[0].description}" width="50">
        <div>${temp}°C</div>
      </div>`;
  }
}