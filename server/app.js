const express = require('express');
const cors = require('cors');
const db = require('better-sqlite3')('facetune.db');
db.pragma('journal_mode = WAL');

db.prepare(
  `CREATE TABLE IF NOT EXISTS genoma (
    haircolor TEXT NOT NULL,
    haircut TEXT NOT NULL,
    eyes TEXT NOT NULL,
    skin TEXT NOT NULL,
    nose TEXT NOT NULL,
    mouth TEXT NOT NULL,
    username TEXT NOT NULL,
    score INTEGER DEFAULT 0
);`,
).run();

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;
const error = [0];

app.get('/community', (req, res) => {

  const avatars = db.prepare(`SELECT * FROM genoma;`).all();
  res.set('Content-Type', 'application/json');
  res.set('Access-Control-Allow-Origin', '*');
  //res.status(200).send(avatars);

  const filters_string = req.query.filters;
  if(filters_string){
    const filters = JSON.parse(filters_string);
    console.log(filters[0] + ':' + filters[1]);
    //console.log(`SELECT * FROM genoma WHERE ${filters[0]} LIKE ${filters[1]};`);

    if(filters[0] === 'all'){

      if (avatars.length === 0) {
        res.send(error);
        console.log('No avatars found :(');

      } else {
        res.send(avatars);
        console.log(avatars);

      }

    }else{
      const query = `SELECT * FROM genoma WHERE ${filters[0]} LIKE ?;`;
      const filtered_avatars = db.prepare(query).all(filters[1]);

      if (filtered_avatars.length === 0) {

        res.send(error);
        console.log('No avatars found :(');

      } else {
        res.send(filtered_avatars);
        console.log(filtered_avatars);

      }

    }

    //filters_string.length = 0;

  }


});

app.post('/community/add', (req, res) => {
  // ottiene l'avatar nuovo
  const avatar_da_salvare = req.body.avatar;
  //console.log(avatar_da_salvare);
  // salva nel db
  // INSERT INTO avatar () values ...
  db.prepare(
    `INSERT INTO genoma (haircolor, haircut, eyes, skin, nose, mouth, username) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(...avatar_da_salvare);


  return res.status(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
