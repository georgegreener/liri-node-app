require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var title = process.argv[3];
var movie = "http://www.omdbapi.com/?t="
    + title + "&y=&plot=short&apikey=trilogy";

if (command === "my-tweets") {
    client.get('search/tweets', {q: 'from:chick_n_finger'}, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 10; i++) {
                console.log(`
Tweet: ${tweets.statuses[i].text}
Timestamp: ${tweets.statuses[i].created_at}
                `);
            }
        } else {
            console.log(error);
        }
     });
} else if (command === "spotify-this-song") {
    spotify
  .search({ type: 'track', query: title })
  .then(function(response) {
    console.log(`
Artist: ${response.tracks.items[0].artists[0].name}
Title: ${response.tracks.items[0].name}
Album: ${response.tracks.items[0].album.name}
Preview: ${response.tracks.items[0].preview_url}
    `);
  })
  .catch(function(err) {
    console.log(err);
  });
} else if (command === "movie-this") {
    request(movie, function(error, response, body) {
        if (!error || response.statusCode === 200) {
            var parsedBody = JSON.parse(body);
            console.log(`
Title: ${parsedBody.Title}
Year: ${parsedBody.Year}
IMDB Rating: ${parsedBody.imdbRating}
Rotten Tomatoes Rating: ${parsedBody.Ratings[1].Value}
Country: ${parsedBody.Country}
Language: ${parsedBody.Language}
Plot: ${parsedBody.Plot}
Actors: ${parsedBody.Actors}
    `);
        }
    });
};