# Envisage

![envisageAsBanner](src/img/docs/logoAsBanner.png)

## Introduction 
In ENVISAGE, you and your friends can compete against each other over multiple rounds to create the best AI generated masterpieces. At the beginning of the first round, you are given a picture from the category you choose and an image style as a requirement. 
Your task is to generate an image as close as possible to the requirements. At the end of each round, you get to vote on your favorite picture (not your own!) and the best picture is given as the prompt for the next round with a different style requirement. The process continues till the final round is completed and a winner is declared based on the accumulated votes.


## Technologies
* React, CSS, HTML
* APIs: [DALL-E](https://platform.openai.com/docs/api-reference/introduction), [Met Collection API](https://metmuseum.github.io/)
* Hosted on GCP


## High-level components
### [Landing Page](https://github.com/sopra-fs23-group-15/envisage-client/blob/main/src/components/views/LandingPage.js)
Where it all begins - you can choose to create/join a lobby and get a preview of the game before you start :)
### [Lobby](https://github.com/sopra-fs23-group-15/envisage-client/blob/main/src/components/views/Lobbies.js) [[Lobby creation](https://github.com/sopra-fs23-group-15/envisage-client/blob/main/src/components/views/LobbyCreation.js), [Lobby configuration](https://github.com/sopra-fs23-group-15/envisage-client/blob/main/src/components/views/LobbyConfiguration.js), [Waiting Lobby](https://github.com/sopra-fs23-group-15/envisage-client/blob/main/src/components/views/LobbiesAfter.js)]
Everything related to lobbies - As a player of ENVISAGE, you can create a default lobby (and even configure the game settings to your liking). Further, during the waiting periods before and after voting, you are in a waiting lobby area in case not all of your co-players are done yet.
### [Game](https://github.com/sopra-fs23-group-15/envisage-client/blob/main/src/components/views/Games.js) [[Vote View](https://github.com/sopra-fs23-group-15/envisage-client/blob/main/src/components/views/VotePage.js), [Final View](https://github.com/sopra-fs23-group-15/envisage-client/blob/main/src/components/views/FinalPage.js)]
The most important component - Apart from generating images, you get to vote on the images of your co-players after each round, not your own ofc!;) Make sure to accumulate votes to increase your score and potentially be the winner displayed at the very end on top of the scoreboard.
### [Winning Images](https://github.com/sopra-fs23-group-15/envisage-client/blob/main/src/components/views/WinningImages.js)
The winners - A display of the winning images of each round
### [Exhibition](https://github.com/sopra-fs23-group-15/envisage-client/blob/main/src/components/views/ExhibitionPage.js) 
Your gallery - A display of all your generated images :)


## Launch & Deployment
### Prerequisites
Clone the client repository:

```bash
git clone git@github.com:sopra-fs23-group-15/envisage-client.git
```

For your local development environment, you will need [Node.js](https://nodejs.org). All other dependencies, including React, get installed with:

```bash
npm install
```

Run this command before you start your application for the first time. Next, you can start the app with:

```bash
npm run dev
```

After these steps you can open [http://localhost:3000](http://localhost:3000) in your browser to view it.

**_Use different browsers to play the game locally_**

### Testing
Run the tests with:

```bash
npm run test
```

> For macOS user running into a 'fsevents' error: https://github.com/jest-community/vscode-jest/issues/423

### Build
Run the following command to build the application:

```bash
npm run build
``` 

### Deployment
The app is hosted on Google App Engine. A push to the main will automatically lead to the deployment to the Google App Engine.


## Illustrations
The following diagram shows the flow of our interfaces.

<p align="center">
 <img src="src/img/docs/viewflow_diagram.png" width="800">
</p>

### LandingPage
<p align="center">
  <img src="src/img/docs/landingpage.png">
</p>

### Lobbies
<p align="center">
  <img src="src/img/docs/lobby.png">
</p>

### Games
<p align="center">
  <img src="src/img/docs/game.png">
</p>

### VotePage
<p align="center">
  <img src="src/img/docs/vote.png">
</p>

### LobbiesAfter
<p align="center">
  <img src="src/img/docs/scoreboard.png">
</p>

### FinalPage
<p align="center">
  <img src="src/img/docs/winner.png">
</p>

### WinningImages
<p align="center">
  <img src="src/img/docs/winningimages.png">
</p>

### ExibithionPage
<p align="center">
  <img src="src/img/docs/exhibition.png">
</p>


## Roadmap 
* Play with anyone in the world by introducing waiting lobbies
* Ability to download your images
* Accounts to save player stats and their generated images
* Disappearing Mode (images disappear after a while and are not displayed for the entire round duration)

## Authors and acknowledgment 
* Marion Andermatt - [marion-an](https://github.com/marion-an)
* Moritz Mohn - [moritzmohn](https://github.com/moritzmohn)
* Nikita Amitabh - [nikita-uzh](https://github.com/nikita-uzh)
* Shantam Raj - [armsp](https://github.com/armsp)
* Xue Wang - [xueswang](https://github.com/xueswang)

We would like to thank our mentor Valentin Hollenstein - [v4lentin1879](https://github.com/v4lentin1879) for supporting us throughout the project.

## License
This project is licensed under [Apache-2.0 license](https://github.com/sopra-fs23-group-15/envisage-client/blob/main/LICENSE)
