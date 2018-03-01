# What is LIRI?

LIRI is a Node-based application that can perform basic tasks, including retrieving Tweets, looking up songs on Spotify, and looking up movie information on OMDB.

# How to Use

Use the command line to operate LIRI. You may type "node liri" and then one of three commands, followed by a title of your choosing. The three commands available for you are as follows:

    my-tweets (retreives your most recent Tweets)
    spotify-this-song (searches Spotify for a song)
    movie-this (searches OMDB for a movie)

No title is needed to retrieve Tweets. However, if you want to look for a song or movie, you will need to specify which title to look for. You may do so by using "+" between each word in the title, as illustrated by the following examples:

    node liri spotify-this-song single+ladies
    node liri movie-this star+wars

You may also use quotes to wrap the query and pass it as a string, such as:

    node liri spotify-this-song "i will always love you"
    node liri move-this "an american tale"

LIRI will return the relevant content based on either input method.

