// Covid-19 API

const app = document.querySelector('#app');

// Save info that API need
const KEY = 'YOUR KEY FROM https://rapidapi.com/api-sports/api/covid-193',
	URL = 'https://covid-193.p.rapidapi.com',
	ROUTES = [
		'statistics',
		'countries'
	];

// Asynchronous connection to API
const connection = async (apiUrl, apiRoute = '', apiKey) => {
	try {
		// Define the app title (this appears in the top of page)
		let apiRouteTitle = apiRoute.toString().charAt(0).toUpperCase() + apiRoute.slice(1),
				appTitle = document.createElement('h1');
			appTitle.setAttribute('class', 'app-title');
			appTitle.textContent = apiRoute !== '' ? `Getting data from "${apiRouteTitle}" route` : console.warn('Check route param of connection().');
			document.body.insertBefore(appTitle, app);

		// Fetching API data with its headers
		const response = await fetch(`${apiUrl}/${apiRoute}`, {
			'headers': {
				'x-rapidapi-host': 'covid-193.p.rapidapi.com',
				'x-rapidapi-key': apiKey
			}
		});

		// Get and convert data into a json, in other variable get the data we want
		const data = await response.json(),
			importantData = data.response;
		
		// Select a method for extracting data depending of the request (in this case statistics and countries)
		apiRoute == 'statistics' ? importantData.map( e => showCases(e) ) : // Else
		apiRoute == 'countries' ? importantData.map( e => showCountries(e) ) : null;

	} catch {
		console.warn('Ocurrió un error al solicitar la API.');
	}
}

// "app" variable contains the app div (#app)
const insertData = e => {
	app.insertAdjacentHTML('beforeEnd', e);
}

const showVideo = () => {
	const video = `
		<div class="bg-video">
			<video loop autoplay src="video/covid.mp4"></video>
		</div>
	`;

	insertData(video);
}

// Comment to hide background video
showVideo();

// Ordering content for showing in the app
const showCases = e => {
	// Change some names of API values (continents and countries)
	e.continent = e.continent.toLowerCase() == 'north-america' ? 'North America' :
	e.continent.toLowerCase() == 'south-america' ? 'South America' : e.continent;

	e.country = e.country.toLowerCase() == 's-korea' ? 'South Korea' :
	e.country.toLowerCase() == 'n-korea' ? 'North Korea' : e.country;

	const cases = `
		<div class="statistics-item">
			<span class="continent">${e.continent || 'Unknown'}</span>
			<div class="inline-container">
				<span class="country">${e.country}</span>
				<span class="population">Population: ${e.population || '0'}</span>
			</div>
			<li class="cases">Cases:</li>
			<ul class="cases-list">
				<li class="case-active">Active: ${e.cases.active}</li>
				<li class="case-critical">Critical: ${e.cases.critical}</li>
				<li class="case-new">New: ${e.cases.new || '0'}</li>
				<li class="case-recovered">Recovered: ${e.cases.recovered}</li>
				<li class="case-total">Total: ${e.cases.total}</li>
				<li>New deaths: ${e.deaths.new || '0'}</li>
				<li class="case-critical">Deaths: ${e.deaths.total}</li>
			</ul>
		</div>
	`;

	insertData(cases);
};

const showCountries = e => {
	const countries = `
		<span class="countries-bad">${e}</span>
	`;

	insertData(countries);
};

connection(URL, ROUTES[0], KEY);
