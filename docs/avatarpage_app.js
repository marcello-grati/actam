const selectionMenu = document.getElementById('selection-menu');
const optionsContainer = document.getElementById('options-container');
const namebox = document.getElementById('nickname');
const body_svg = document.getElementById('body');

//  Conferma nickname da tastiera
namebox.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    saveName();
  }
});

// Creazione testo con nickname inserito
function saveName() {
  const nameField = namebox.value;
  let nameAvatar = document.getElementById('name-avatar');
  nameAvatar.innerText = nameField;
  changeView();
}

// Cambio layout dopo aver confermato il nickname
function changeView() {
  document.getElementById('create-container').style.display = 'flex';
  document.getElementById('done').hidden = false;
  document.getElementById('write').hidden = false;
  document.getElementById('play').hidden = false;
  document.getElementById('pause').hidden = false;
  document.getElementById('stop').hidden = false;
  document.getElementById('nick-form').style.display = 'none';
}

const options = {
  skin: [
    'skin1',
    'skin2',
    'skin3',
    'skin4',
    'skin5',
    'skin6',
    'skin7',
    'skin8',
    'skin9',
    'skin10',
  ],
  haircolor: [
    'black_hair',
    'white_hair',
    'brown_hair',
    'blonde_hair',
    'red_hair',
    'grey_hair',
    'lightbrown_hair',
    'pink_hair',
    'blue_hair',
    'brown2_hair',
    'chocolate_hair',
    'gold_hair',
  ],
  haircut: ['0h','1h', '2h', '3h','4h','5h','6h','7h'],
  eyes: ['green_eyes', 'blue_eyes', 'brown_eyes', 'grey_eyes'],
  nose: ['type1n', 'type2n', 'type3n', 'type4n'],
  mouth: ['type1m', 'type2m'],
};

//array di features di default
avatarFeat = ['black_hair', '0h', 'blue_eyes', 'skin1', 'type1n', 'type1m'];

selectionMenu.addEventListener('change', menuselection);

// Selezione elementi dal menù a tendina
function menuselection() {
  const selected = selectionMenu.value;
  const filenames = options[selected]; //options for a feature
  //quando una caratteristica viene scelta
  const selected_el = (e) => {
    arrayCreation(e.target.id, selected);
    avatarcreation(e, selected);
  }
  optionsContainer.replaceChildren([]);

  //display delle caratteristiche
  for (const filename of filenames) {
    if (
      selected === 'haircolor' ||
      selected === 'skin' ||
      selected === 'eyes'
    ) {
      // Crea le icone dei colori
      const color = document.createElement('div');
      color.setAttribute('id', filename);
      color.setAttribute('class', 'colors');
      color.addEventListener('click', selected_el);
      optionsContainer.appendChild(color);
    }
    else {
      // Crea le icone di capelli, naso, bocca
      const a = document.createElement('div');
      a.classList.add('selectelement');
      a.style.cursor = 'pointer';
      a.style.background = 'white';
      a.setAttribute('id', filename);

      const el_img = document.createElement('object');
      if(selected==='nose')
        el_img.classList.add('svgimage_nose');
      else if(selected==='mouth')
        el_img.classList.add('svgimage_mouth');
      else if(selected==='haircut')
        el_img.classList.add('svgimage_hair');
      el_img.id = filename + 'svg';
      el_img.type = 'image/svg+xml';
      el_img.data = filename + '.svg';

      a.addEventListener('click', selected_el);
      optionsContainer.appendChild(a);
      a.appendChild(el_img);

      // cambia colore dei capelli delle icone in base al colore scelto su haircolor
      if (selected==='haircut') {
        el_img.addEventListener('load', function () {
          changeColor(el_img.id, 0);
        });
      }
      // cambia colore di naso e bocca delle icone in base al colore scelto della pelle
      else if (selected==='mouse'||selected==='nose'){
        el_img.addEventListener('load', function () {
          changeColor(el_img.id, 3);
        });
      }
    }
  }
}

// Cambio colore capelli icone in base a scelta
function changeColor(name,i) {
  const elem = document.getElementById(name);
  const ele = elem.contentDocument;
  const e = ele.getElementsByTagName('g')[0];
  e.classList.replace(e.classList.item(0), avatarFeat[i]);
}

// Cambio colore capelli avatar in base a selezione
function changeHairColor(color) {
  let haircut = body_svg.contentDocument.getElementById('haircut');
  haircut.classList.replace(haircut.classList.item(0), color);
  let eyebrows = body_svg.contentDocument.getElementById('eyebrows_left');
  eyebrows.classList.replace(eyebrows.classList.item(0), color);
  eyebrows = body_svg.contentDocument.getElementById('eyebrows_right');
  eyebrows.classList.replace(eyebrows.classList.item(0), color);
}

// Cambio taglio di capelli avatar in base a selezione
function changeHairCut(hair) {
  let haircut = body_svg.contentDocument.getElementById('haircut');
  let hr = hair + '.svg#' + hair;
  haircut.setAttribute('href', hr);
}

// Cambio bocca avatar in base a selezione
function changeMouth(mouthtype) {
  let mouth = body_svg.contentDocument.getElementById('mouth');
  let m = mouthtype + '.svg#' + mouthtype;
  mouth.setAttribute('href', m);
}

// Cambio naso avatar in base a selezione
function changeNose(nosetype) {
  let nose = body_svg.contentDocument.getElementById('nose');
  let n = nosetype + '.svg#' + nosetype;
  nose.setAttribute('href', n);
}

// Cambio colore pelle avatar in base a selezione
function changeSkinColor(colorskin) {
  let skin = body_svg.contentDocument.getElementById('sameskin');
  skin.classList.replace(skin.classList.item(0), colorskin);
  skin = body_svg.contentDocument.getElementById('sameskin1');
  skin.classList.replace(skin.classList.item(0), colorskin + '1');
  let nose = body_svg.contentDocument.getElementById('nose');
  nose.classList.replace(nose.classList.item(0), colorskin +'1');
  let mouth = body_svg.contentDocument.getElementById('mouth');
  mouth.classList.replace(mouth.classList.item(0), colorskin +'1');
}

// Cambio colore occhi avatar in base a selezione
function changeEyesColor(eyescolor) {
  let iris = body_svg.contentDocument.getElementById('iris_right');
  iris.classList.replace(iris.classList.item(0), eyescolor);
  iris = body_svg.contentDocument.getElementById('iris_left');
  iris.classList.replace(iris.classList.item(0), eyescolor);
}

// Creazione avatar in base alla selezione
function avatarcreation(e, selected) {
  if (selected === 'haircolor') {
    changeHairColor(e.target.id);
  }
  else if (selected === 'haircut') {
    changeHairCut(e.target.id);
  }
  else if (selected === 'skin') {
    changeSkinColor(e.target.id);
  }
  else if (selected === 'eyes') {
    changeEyesColor(e.target.id);
  }
  else if (selected === 'mouth') {
    changeMouth(e.target.id);
  }
  else if (selected === 'nose') {
    changeNose(e.target.id);
  }
}

// Creazione array genoma avatar
function arrayCreation(elem, selected) {
  // [0]=hair color, [1]=haircut, [2]=eyes, [3]=skin [4]=nose, [5]=mouth
  if (selected === 'haircolor') avatarFeat[0] = elem;
  else if (selected === 'haircut') avatarFeat[1] = elem;
  else if (selected === 'eyes') avatarFeat[2] = elem;
  else if (selected === 'skin') avatarFeat[3] = elem;
  else if (selected === 'nose') avatarFeat[4] = elem;
  else if (selected === 'mouth') avatarFeat[5] = elem;

  // Per visualizzare array in console
  console.log(avatarFeat[0] + ',' + avatarFeat[1] + ',' + avatarFeat[2] + ',' +
      avatarFeat[3] + ',' + avatarFeat[4] + ',' + avatarFeat[5]);
}

avatardb = [0,0,0,0,0,0,0,0];

// Disabilita tendina dopo "done"
// invia avatar al database
async function doneButton() {

  selectionMenu.setAttribute('disabled', '');
  optionsContainer.replaceChildren([]);
  //console.log('final string: '+ avatarFeat[0]+','+avatarFeat[1]+','+avatarFeat[2]+','+avatarFeat[3]+','+avatarFeat[4]+','+avatarFeat[5]);
  document.getElementsByClassName('selection')[0].style.display = 'none';
  document.getElementById('done').hidden = true;
  document.getElementById('write').hidden = true;
  document.getElementById('play').hidden = false;
  document.getElementById('pause').hidden = false;
  document.getElementById('download').hidden = false;
  document.getElementById('stop').hidden = false;
  document.getElementById('nick-form').style.display = 'none';
  document.getElementById('back').style.marginRight = '73px';

  avatardb = avatarFeat;
  // name avatar
  let tempname = namebox.value;
  avatardb[6] = tempname.toUpperCase();
  // id avatar randomizzato
  avatardb[7] = Math.round(Math.random () * 100000);
  console.log('avatardb: ' + avatardb);

  //connessione al server
  fetch('http://localhost:3000/community/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ avatar: avatardb }),
  });

  const res = await fetch('http://localhost:3000/community');
  const all = await res.json();
  console.log(all);
}
