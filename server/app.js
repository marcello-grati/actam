const express = require('express');
const cors = require('cors');
const db = require('better-sqlite3')('facetune.db');
db.pragma('journal_mode = WAL');

// Creazione database
db.prepare(
  `CREATE TABLE IF NOT EXISTS genoma (
    haircolor TEXT NOT NULL,
    haircut TEXT NOT NULL,
    eyes TEXT NOT NULL,
    skin TEXT NOT NULL,
    nose TEXT NOT NULL,
    mouth TEXT NOT NULL,
    username TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    votes INTEGER DEFAULT 0,
    id INTEGER DEFAULT 0
);`,
).run();

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

// Accesso al database
app.get('/community', (req, res) => {

  const avatars = db.prepare(`SELECT * FROM genoma;`).all();
  res.set('Content-Type', 'application/json');
  res.set('Access-Control-Allow-Origin', '*');

  const filters_string = req.query.filters;

  // Estrazione avatars corrispondenti al filtro selezionato
  if(filters_string){
    const filters = JSON.parse(filters_string);
    console.log(filters[0] + ':' + filters[1]);


    if(filters[0] === 'all'){

      if (avatars.length === 0) {
        res.send(avatars);
        console.log('No avatars found :(');

      } else {
        res.send(avatars);
        console.log(avatars);

      }

    }else{
      const query = `SELECT * FROM genoma WHERE ${filters[0]} LIKE ?;`;
      const filtered_avatars = db.prepare(query).all(filters[1]);

      if (filtered_avatars.length === 0) {

        res.send(filtered_avatars);
        console.log('No avatars found :(');

      } else {
        res.send(filtered_avatars);
        console.log(filtered_avatars);

      }

    }


  }


});

app.post('/community/add', (req, res) => {
  // Ottiene l'avatar nuovo
  const avatar_da_salvare = req.body.avatar;

  // Salva l'avatar nuovo nel db
  db.prepare(
    `INSERT INTO genoma (haircolor, haircut, eyes, skin, nose, mouth, username, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(...avatar_da_salvare);


  return res.status(200);
});

// Update del database con nuovo punteggio
app.post('/community/update', (req, res) => {
  const avatar = req.body.genome;
  console.log('Received update request:', avatar);
  
  const username = avatar[6];
  const score = avatar[7];
  const votes = avatar[8];
  const id = avatar[9];


  const existingAvatars = db.prepare('SELECT * FROM genoma WHERE id = ?').all(id);

  db.transaction(() => {
    if (existingAvatars.length > 0) {
      const updateStmt = db.prepare('UPDATE genoma SET score = ?, votes = ? WHERE id = ?');
      existingAvatars.forEach(existingAvatar => {
        updateStmt.run(score, votes,id);
      });
    }
  })();

  console.log('updated');

  return res.status(200);
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
