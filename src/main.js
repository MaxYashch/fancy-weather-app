import './styles/style.scss';
import _ from 'underscore';
import axios from 'axios';


const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'];


let dataBlock = document.querySelector('.js-weather-data');
let dataTemplate = _.template(
`
<div class="weather-data">
	<div class="weather-data__location"><%- city %></div>
	<div class="weather-data__date-time">
		<span class="weather-data__date"><%- date %></span>
		<span class="weather-data__time"><%- time %></span>  
	</div>
	<div class="weather-data__info">
		<div class="weather-data__info-main">
			<div class="weather-data__temperature"><%- temperature %><span class="weather-data__temperature-unit">°</span></div>
		</div>
		<div class="weather-data__info-aside">
			<div class="weather-data__type"><%- type %></div>
			<div class="weather-data__type">feels like <%- feels %>°</div>
			<div class="weather-data__wind">wind: <%- wind %> m/s</div>
			<div class="weather-data__humidity">humidity: <%- humidity %>%</div>
		</div>
	</div>
</div>
`
);

/*
dataBlock.innerHTML = dataTemplate({
	city: 'Minsk', 
	date: 'Mon October 13',
	time: '17:23',
	temperature: '10'
});
*/


function update(weatherData) {
	let now = new Date();
	dataBlock.innerHTML = dataTemplate({
		city: 'Minsk', 
		date: dayNames[now.getDay() - 1] + ' ' + monthNames[now.getMonth()] + ' ' + now.getDate(),
		time: now.getHours() + ':' + now.getMinutes(),
		temperature: weatherData ? Math.round(weatherData.main.temp) : null,
		type: weatherData ? weatherData.weather[0].main : null,
		feels: weatherData ? Math.round(weatherData.main.feels_like) : null,
		humidity: weatherData ? Math.round(weatherData.main.humidity) : null,
		wind: weatherData ? Math.round(weatherData.wind.speed) : null
	});
}


function request() {
	axios.get('https://api.openweathermap.org/data/2.5/weather', {
		params: {
			q: 'Minsk',
			APPID: 'b120a6cfd889b41feb53cc6197265022',
			units: 'metric'
		}
	})
	.then((response) => {
		console.log('openweathermap ajax done', response.data);
		update(response.data);
		setTimeout(request, 60*1000);
	})
	.catch((error) => {
		console.warn('openweathermap ajax call failed', error);
		setTimeout(request, 60*1000);	
	});
}


update();
request();