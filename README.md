## Watch Demo 👇

[![kicky-intro](https://user-images.githubusercontent.com/812622/201692295-a5d967a6-3a6e-4805-a595-50adf383e7dc.gif)](https://vimeo.com/770501525 "Demo")

## Installation

Clone the repo and run `yarn install`


## Start

After the successfull installation of the packages: `yarn dev`

## Story Behind It

## Inspiration

Football, or soccer as you may call it, is a [billion-dollar industry](https://www.imarcgroup.com/football-market#:~:text=Market%20Overview:,4.10%25%20during%202022-2027.), and nowadays, it is shaped around data science. Clubs like Brentford have been promoted to the premier league using sports analytics, especially for recruitment. Nowadays, every major club in football has a data scientist, and the usual choice of language is Python. Even though it is powerful for data visualisations, it usually generates a [static](https://twitter.com/ChelseaDatabase/status/1579943956808609794) analysis result. Our motivation was to make it a more **dynamic**, **interactive** and **playful** browser experience even for **non-analyst people** with the help of **google maps**.

## What it does

Kicky uses freely accessible soccer analytics data sources. It **visualises soccer moments on google maps** in real-world coordinates. It enables users to analyse data using some machine learning and statistics libraries in the background. Users can see distinct player movements on the **3D** map. Furthermore, they can even see a snapshot of selected events, including player positions and the direction of the shot.

## How we built it

First, we evaluated the free soccer [data](https://github.com/statsbomb/open-data). Since all events are provided with pixel coordinates, it was not applicable on a map. At this stage, we used 2D affine transformation to convert coordinates using corner coordinates of stadiums which we derived from a map.
After loading data, we visualised all actions on a map using [Deck.GL](https://deck.gl/) arc layer. [Three.js](https://threejs.org/) scene is used to show game results on a map, enabling us to visualise low and high passes in 3D. To analyse pass events, firstly, we integrated danfo.js, which replaces pandas in the python ecosystem. With the help of danfo library, we calculated pass networks. To integrate machine learning analytics into the platform, we use a simple unsupervised learning algorithm (K-means) by using [ml5.js](https://github.com/ml5js/ml5-library) library. All of the calculations are done on the client side using javascript.

## Challenges we ran into

- Since it is a competitive area, it is hard to find free study data
- Converting soccer events to geographic coordinates
- Running complex calculations and filters in the browser with javascript.
- When multiple players and events are applied on a map, it is a bit of a hustle to provide distinctive visualisation

## Accomplishments that we're proud of

- Even though we use a tiny portion of the map, it provides a unique experience and proves that maps can be used to visualise events in open court sports such as soccer, football, tennis etc.
- We made all calculations on the client side, which make sense for low-cost operations, showing reducing server cost could be possible for data analytics applications.
- Using integrated ArcLayer on Google Maps provides a 3D interactive experience.
- Advanced markers let users reconstruct important moments by creating a marker for each player, pictures included whenever possible.

## What we learned

Google Maps is capable of powerful data visualisations by easily integrating with libraries such as Three.js, Deck.GL etc. We learned how to build a data analytics and visualisation platform using solely client-side technologies.
