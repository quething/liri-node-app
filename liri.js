
// includes: env & file for masking keys, inquirer for prompts, spotify API for spotify, axios for other APIs
require("dotenv").config();
const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const keys = require("./keys.js");
//const spotify = new Spotify(keys.spotify);

const parseInputString = function (userString) {
	let searchKey = "";
	if (userString.startsWith('concert-this')) {
		searchKey = userString.slice(13);
		concertSearch(searchKey); // call concert function
	}
	else if (userString.startsWith('movie-this')) {
		searchKey = userString.slice(11);
		movieSearch(searchKey); // call imdb function
	}
	else if (userString.startsWith('spotify-this-song')) {
		searchKey = userString.slice(18);
		spotifySearch(searchKey); // call spotify function
	}
	else if (userString.toLowerCase() == 'exit') {
		exitProgram = true;
	}
	else // if not a valid prompt, error out
	{
		console.log(`Sorry, I didn't understand that input. Try again?`);
	}
}

// parent function to tell user what is possible and fire inquirer process
const promptUserAction = function () {
	// give instructions
	console.log(`Welcome to LIRI! Try typing one of the following: \n'concert-this <artist name>' to find nearby concerts \n'spotify-this-song <song name>' to find album and artist information on a song \n'movie-this <movie>' to get IMDB information about a movie \n'do-what-it-says' to run the contents of the included text file \nYou may also type 'exit' to quit.`)

	inquirer.prompt([
		{
			type: "input",
			name: "userInput"
		}
	]).then(
		function (inquirerResponse) {
			let userString = inquirerResponse.userInput;

			if (userString.startsWith('do-what-it-says')) {
				fireRandom(); // call random.txt
			}
			else {
				parseInputString(userString);
			}
		});
}

const concertSearch = function (searchKey) {
	console.log(`Searching for nearby concerts...`);
	let urlVar = `https://rest.bandsintown.com/artists/${searchKey}/events?app_id=codingbootcamp`
	axios.get(urlVar)
		.then(function (response) {
			let bandJSON = response.data;

			if (bandJSON.errormessage || bandJSON == null) {
				console.log(`Something went wrong: ${bandJSON.errormessage}`);
			}
			else {
				console.log(`Upcoming ${searchKey} concerts:`);
				fs.appendFile('log.txt', `\n---- Upcoming ${searchKey} concerts: ----`, function (error) {
					if (error) {
						console.log(`AppendFile error: ${error}`);
					}
				})
				for (let i = 0; i < bandJSON.length; i++) {
					let resultString = `\n${bandJSON[i].venue.name}\n${bandJSON[i].venue.city}\n${bandJSON[i].datetime}`; //use moment to make that mm/dd/yy

					console.log(resultString);
					fs.appendFile('log.txt', resultString, function (error) {
						if (error) {
							console.log(`AppendFile error: ${error}`);
						}
					})
				}
			}

		});
}

const movieSearch = function (searchKey) {
	console.log(`Searching for movie data...`);
	let urlVar = `http://www.omdbapi.com/?apikey=trilogy&t=${searchKey}`
	axios.get(urlVar)
		.then(function (response) {
			let movieJSON = response.data;
			let resultString = `---- ${movieJSON.Title.toUpperCase()} ----\nYear: ${movieJSON.Year}\nCritical ratings: ${movieJSON.Ratings[0].Value} @IMDB, ${movieJSON.Ratings[1].Value} @Rotten Tomatoes\nProduced in ${movieJSON.Country}\nStarring ${movieJSON.Actors}\n\n${movieJSON.Plot}`;

			console.log(resultString);
			fs.appendFile('log.txt', `\n\n${resultString}`, function (error) {
				if (error) {
					console.log(`AppendFile error: ${error}`);
				}
			})
		});
}

const spotifySearch = function (searchKey) {
	console.log(`Searching for song data...`);
	
	let resultString = `---- ${songname.toUpperCase()} ----
					\nArtist: ${artist}
					\nAlbum: ${album}
					\nPreview on Spotify: ${previewURL}`
}

const fireRandom = function () {
	console.log(`Checking for external commands...`);
	fs.readFile('./random.txt', 'utf8', (error, data) => {
		if (error) {
			console.log(`readFile error: ${error}`);
		}
		parseInputString(data);
	});
}

promptUserAction();
