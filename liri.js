require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

// "command" instructs LIRI which service call to make
var command = process.argv[2];
// "title" is the user's specific query, which is added to the service call
var title = process.argv[3];

// This service call retrieves the 20 most-recent Tweets from the Twitter account "chick_n_finger"
if (command === "my-tweets") {
    client.get('search/tweets', {q: 'from:chick_n_finger', count: 20}, function(error, tweets, response) {
        if (!error) {
            // For loop iterates through return object
            for (var i = 0; i < tweets.statuses.length; i++) {
                // Outputs Tweets and their corresponding timestamps to terminal
                console.log(`
Tweet: ${tweets.statuses[i].text}
Timestamp: ${tweets.statuses[i].created_at}
                `);
                // Appends Tweets to log.txt
                fs.appendFile("log.txt",
            `
Tweet: ${tweets.statuses[i].text}
Timestamp: ${tweets.statuses[i].created_at}
        `,
                // If there is an error when appending Tweets to log.txt, output to terminal
                function(error) {
                    if (error) {
                        console.log(error);
                    }
                });          
            }
            // Outputs to terminal if Tweets are successfully appended to log.txt
            console.log("*Added to log.txt");
        } else {
            // Outputs error code to terminal if service call fails
            console.log(error);
        }
    });
// This service call retrieves the first item in the return object from Spotify
} else if (command === "spotify-this-song") {
    // If a user fails to add a query to service call, "The Sign" by Ace of Base will be queried
    if (title === undefined) {
        spotify.search({ type: 'track', query: "The Sign" } )
        .then(function(response) {
            // Appends returned item to log.txt
            fs.appendFile("log.txt",
            `
Artist: ${response.tracks.items[5].artists[0].name}
Title: ${response.tracks.items[5].name}
Album: ${response.tracks.items[5].album.name}
Preview: ${response.tracks.items[5].preview_url}
        `,
            // If there is an error when appending item to log.txt, outputs to terminal
            function(error) {
                if (error) {
                    console.log(error);
                }
                // Outputs to terminal if item is successfully appended to log.txt
                else {
                    console.log("*Added to log.txt");
                }
            });
            // Outputs returned item to terminal
            console.log(`
Artist: ${response.tracks.items[5].artists[0].name}
Title: ${response.tracks.items[5].name}
Album: ${response.tracks.items[5].album.name}
Preview: ${response.tracks.items[5].preview_url}
            `);
        })
        // Outputs error code to terminal if service call fails 
        .catch(function(error) {
            console.log(error);
        });
    // If a user includes a query when making the service call, the program will return the queried object
    } else {
        spotify.search({ type: 'track', query: title })
        .then(function(response) {
        // Appends first item from returned object to log.txt
            fs.appendFile("log.txt",
            `
Artist: ${response.tracks.items[0].artists[0].name}
Title: ${response.tracks.items[0].name}
Album: ${response.tracks.items[0].album.name}
Preview: ${response.tracks.items[0].preview_url}
        `,
            // If there is an error when appending item to log.txt, outputs to terminal
            function(error) {
                if (error) {
                    console.log(error);
                }
                // Outputs to terminal if item is successfully appended to log.txt
                else {
                    console.log("*Added to log.txt");
                }
            });
            // Outputs returned item to terminal
            console.log(`
Artist: ${response.tracks.items[0].artists[0].name}
Title: ${response.tracks.items[0].name}
Album: ${response.tracks.items[0].album.name}
Preview: ${response.tracks.items[0].preview_url}
            `);
        })
        // Outputs error code to terminal if service call fails
        .catch(function(error) {
            console.log(error);
        });
    }
// This service call retrives a specific endpoint from the OMDB API
} else if (command === "movie-this") {
    // If a user fails to add a query to service call, "Mr. Nobody" will be queried
    if (title === undefined) {
        title = "mr+nobody";
    }
    // "movie" concatenates "title" with endpoint address
    var movie = "http://www.omdbapi.com/?t="
    + title + "&y=&plot=short&apikey=trilogy";
    request(movie, function(error, response, body) {
        if (!error || response.statusCode === 200) {
            var parsedBody = JSON.parse(body);
            // Appends information from return objext to log.txt
            fs.appendFile("log.txt",
            `
Title: ${parsedBody.Title}
Year: ${parsedBody.Year}
IMDB Rating: ${parsedBody.imdbRating}
Rotten Tomatoes Rating: ${parsedBody.Ratings[1].Value}
Country: ${parsedBody.Country}
Language: ${parsedBody.Language}
Plot: ${parsedBody.Plot}
Actors: ${parsedBody.Actors}
        `,
            // If there is an error when appending information to log.txt, outputs to terminal
            function(error) {
                if (error) {
                    console.log(error);
                } else {
                    // Outputs to terminal if information is successfully appended to log.txt
                    console.log("*Added to log.txt");
                }
            });
            // Outputs information from return object to terminal
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
// This command reads random.txt and makes a service call to Spotify based on that text
} else if (command === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (!error) {
            // Splits text from random.txt into array
            var dataArray = data.split(",");
            // Adds second item of "dataArray" to query
            spotify
            .search({ type: 'track', query: dataArray[1] })
            .then(function(response) {
                // Appends first item of return object to log.txt
                fs.appendFile("log.txt",
                `
Artist: ${response.tracks.items[0].artists[0].name}
Title: ${response.tracks.items[0].name}
Album: ${response.tracks.items[0].album.name}
Preview: ${response.tracks.items[0].preview_url}
            `,
                // If there is an error when appending item to log.txt, outputs to terminal
                function(error) {
                    if (error) {
                        console.log(error);
                    } else {
                        // Outputs to terminal if item is successfully appended to log.txt
                        console.log("*Added to log.txt");
                    }
                });
                // Outputs returned item to terminal
                console.log(`
Artist: ${response.tracks.items[0].artists[0].name}
Title: ${response.tracks.items[0].name}
Album: ${response.tracks.items[0].album.name}
Preview: ${response.tracks.items[0].preview_url}
                `);
            })
            // Outputs error to terminal if service call fails
            .catch(function(error) {
                console.log(error);
            });
        }
    });
};