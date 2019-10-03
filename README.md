# NightWatch

This game is a training used to teach students JavaScript and HTML animation using an HTML 5 canvas element and Socket.io for multiplayer connectivity.

## To Set Up

First fork the repository to your own account, then clone it to your computer using `git`.

Before you can run the server, you need to install its dependencies. Go into the `gameserver` directory (on the command line) and type `npm install`.

## To Play

The server needs to be started by entering the `gameserver` directory from a command line, then typing `node .` or `node index.js`.

If you are not serving the index.html file from a local web server:  In `index.html`, look for the server URL, which (was) `//:3000` and change it to `http://localhost:3000`.

The main page can be loaded via a web server running locally, or by opening the page directly in your browser. From the macOS command line, you can type `open index.html` and it should load the page.
On Windows, Mac, and Linux (in graphical mode) you should be able to right click and open the `index.html` file from the NightWatch folder.

