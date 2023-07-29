# FaceTune

FaceTune is a web application developed using JavaScript, HTML and CSS.
It allows users to create their personalized avatar by selecting various physical characteristics. These include skin color, hair color, eyes color, haircut, nose shape and mouth shape.
Based on the chosen characteristics, the application generates a customized jingle for the avatar, allowing customization of tonality, speed, duration, harmonic and melodic progression.

Once the avatar is created, the application enables users to download the jingle and saves the created avatar in the "Avatars Community".
Within the avatar community, users can view all the previously created avatars, listen to their jingles, and rate them on a scale from 1 to 5.

# GUI
## Initial Page
<img width="1000" src="readmeImages/Screenshot 2023-06-20 alle 17.53.35.png">

## Avatar Creation
<img width="1000" src="readmeImages/Screenshot 2023-06-20 alle 17.57.56.png">

## Avatars Community
<img width="1000" src="readmeImages/Screenshot 2023-06-20 alle 17.54.53.png">


# DEMO

https://github.com/marcello-grati/actam/assets/101573040/1c5eb2c5-ab63-421a-b760-74465305c2bd

# Avatar representation

The image of the avatar is created using Scalable Graphics Vector (SVG) format. 

Each shape in body.svg  is created through the tag \<path\> and then, using the tag \<g\>, grouped together to form the various part of the body.
The elements whose color can be changed from the user, are assigned to a class defined in the .css according to the color chosen.


# Database

The Avatar Community is based on a database implemented with SQLite. The database, through fetch, receives a "genome" array containing all the characteristics of the created avatar, including username, score, number of votes, and unique ID.

The second interaction with the database occurs when the user selects avatar display filters. In this case, the server receives an array containing the selected filter class and the filter itself, and through a query, it extracts all the avatars that match this selection.

Once all avatars are extracted and added to an array of strings, it is displayed in the community as a list of usernames where users can select the avatar they want to view.

The third and last interaction with the database concerns assigning a score to an avatar on the community page. When the user assigns a score to an avatar, the avatar's genome array is updated with a new number of votes and the new score obtained.

After being updated, the array is sent back to the server, and through a query, the interested avatar is searched in the database, and the score and voting values are updated.

# Music Generation

The "genome" array containing all the characteristics of the avatar is then used to transform them into music. Some characteristics are directly linked to specific musical parameters, specifically:

- Hair color: Determines the key (tonality) of the musical motif.
- Eyes color: Determines the number of measures (beats) in the music.
- Skin color: Sets the BPM (Beats Per Minute) of the music.

All the remaining characteristics serve as seeds for random generation and contribute to the choice of harmonic progressions, melodic notes, and their respective durations.

The music generation follows specific harmonic rules to avoid parallel fifths and large melodic jumps, and it incorporates perfect cadences.

The libraries used for music generation are tone.js, music.js, and tonal.js. These libraries were bundled into a single file called bundle.js using browserify.


# How to run it

1. Clone the repository
   ```
   https://github.com/marcello-grati/actam.git
   ```
2. Enter the 'server' folder and run the following commands to install browserify and boot the server
   ```
   npm install browserify
   ```
   ```
   node app.js
   ```
3. Open the following link
   ```
   https://marcello-grati.github.io/actam/
   ```
   
NB: The previous mentioned link allows the user to open the application in a GitHub page but, 
due to the fact that GitHub page has default fonts, it modifies the original graphical layout.
If you want to see the original version of the application, run the code directly from Webstorm or VS Code.
