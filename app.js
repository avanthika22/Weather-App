async function getWeather(city) {
    const apiKey = '8352b136f505ae5d31c19716d58d6789'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const forecastResponse = await fetch(forecastUrl);

        const data = await response.json();
        const forecastData = await forecastResponse.json();

        if (data.cod !== 200 || forecastData.cod !== "200") {
            throw new Error('City not found. Please check the city name.');
        }

        displayWeather(data);
        displayForecast(forecastData);
    } catch (error) {
        console.error(error); // Logs the error details
        document.getElementById('weatherInfo').innerHTML = `<p>${error.message}</p>`;
    }
}

function displayWeather(data) {
    const celsius = data.main.temp;
    const fahrenheit = (celsius * 9/5) + 32;

    const weatherInfo = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${celsius.toFixed(2)}°C / ${fahrenheit.toFixed(2)}°F</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    document.getElementById('weatherInfo').innerHTML = weatherInfo;
}

function displayForecast(forecastData) {
    const forecastElement = document.getElementById('forecastInfo');
    forecastElement.innerHTML = ''; // Clear previous content

    const dailyForecasts = [];

    // Extracting one forecast per day (e.g., at 12:00 PM)
    forecastData.list.forEach(forecast => {
        const time = forecast.dt_txt.split(' ')[1]; // Get the time part

        if (time === '12:00:00') {
            dailyForecasts.push(forecast);
        }
    });

    // Displaying the forecast
    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt_txt);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const celsius = forecast.main.temp;
        const fahrenheit = (celsius * 9/5) + 32;

        const iconCode = forecast.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const forecastItem = `
            <div class="forecast-item">
                <h3 class="day">${day}</h3>
                <p>${formattedDate}</p>
                <img src="${iconUrl}" alt="${forecast.weather[0].description}" />
                <p>Temp: ${celsius.toFixed(2)}°C / ${fahrenheit.toFixed(2)}°F</p>
                <p>${forecast.weather[0].description}</p>
            </div>
        `;

        forecastElement.innerHTML += forecastItem;
    });
}

// Event listener for the button
document.getElementById('getWeatherBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        getWeather(city);
    } else {
        document.getElementById('weatherInfo').innerHTML = '<p>Please enter a city name.</p>';
    }
});
document.getElementById('infoButton').addEventListener('click', () => {
    const infoText = document.getElementById('infoText');
    if (infoText.style.display === 'none') {
        infoText.style.display = 'block';
    } else {
        infoText.style.display = 'none';
    }
});
