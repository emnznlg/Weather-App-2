const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");
const futureForecast = document.querySelector(".future-forecast");

const API_KEY = "7d295ee7f48767900806e753db6617d6";

const days = ["Pazar", "Pzt", "Salı", "Çarş", "Perş", "Cuma", "Cmt"];
const months = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

setInterval(function () {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  let minutes = time.getMinutes();

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  timeEl.innerHTML = hour + ":" + minutes;

  dateEl.innerHTML = days[day] + "," + " " + date + " " + months[month];
}, 1000);

function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let Userlatitude = success.coords.latitude;
    let UserLongtitude = success.coords.longitude;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${Userlatitude}&lon=${UserLongtitude}&units=metric&exclude=hourly,minutely,&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed, temp } = data.current;
  let otherDayForecast = "";
  let todayForecast = "";

  currentWeatherItemsEl.innerHTML = `
                      <div class="weather-item">
                        <div>Humidity</div>
                        <div>${humidity}%</div>
                      </div>
                      <div class="weather-item">
                        <div>Pressure</div>
                        <div>${pressure}</div>
                      </div>
                      <div class="weather-item">
                        <div>Wind Speed</div>
                        <div>${wind_speed}</div>
                      </div>
                      <div class="weather-item">
                        <div>Sunrise</div>
                        <div>${window
                          .moment(sunrise * 1000)
                          .format("HH:mm a")}</div>
                      </div>
                      <div class="weather-item">
                        <div>Sunset</div>
                        <div>${window
                          .moment(sunset * 1000)
                          .format("HH:mm a")}</div>
                      </div>
                      `;

  todayForecast = `
      <div class="today" id="current-temp">
        <img src="http://openweathermap.org/img/wn/${
          data.current.weather[0].icon
        }@4x.png" alt="weather icon" class="w-icon"/>
        <div class="other">
          <div class="day">Current</div>
          <div class="temp"> ${Math.floor(temp)}&#176; C
          </div >
        </div>
      </div>
      `;

  futureForecast.insertAdjacentHTML("afterbegin", todayForecast);

  data.daily.forEach((day, index) => {
    if (index == 0) {
    } else {
      otherDayForecast += `
      
        <div class="weather-forecast-item">
          <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
          <img
            src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
            alt="weather icon"
            class="w-icon"
          />
          <div class="temp">Night - ${Math.floor(day.temp.night)}&#176; C</div>
          <div class="temp">Day - ${Math.floor(day.temp.day)}&#176; C</div>
        </div>
      
      `;
    }
  });
  weatherForecastEl.innerHTML = otherDayForecast;

  timezone.innerHTML = `<div class="time-zone" id="time-zone">${data.timezone}</div>`;
  countryEl.innerHTML = `<div class="country" id="country">${
    data.lat + "N" + " " + data.lon + "E"
  }</div>
        </div>`;
}

getWeatherData();
