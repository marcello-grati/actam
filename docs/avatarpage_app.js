const selectionMenu = document.getElementById('selection-menu');
const optionsContainer = document.getElementById('options-container');
const avatarcontainer = document.getElementById('avatar-container');
const namebox = document.getElementById('nickname');
const body = document.getElementById('body');

//  Conferma nickname da tastiera
namebox.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    saveName();
  }
});

// Creazione testo con nickname inserito
function saveName() {
  const nameField = document.getElementById('nickname').value;
  let nameAvatar = document.getElementById('name-avatar');
  nameAvatar.innerText = nameField;
  changeView();
}

// Cambio layout
function changeView() {
  document.getElementById('create-container').style.display = 'flex';
  document.getElementById('done').hidden = false;
  document.getElementById('play').hidden = false;
  document.getElementById('pause').hidden = false;
  document.getElementById('download').hidden = false;
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
  haircut: ['1h', '2h', '3h'],
  eyes: ['green_eyes', 'blue_eyes', 'brown_eyes', 'grey_eyes'],
  nose: ['type1n', 'type2n', 'type3n', 'type4n'],
  mouth: ['type1m', 'type2m'],
};

avatarFeat = [0, 0, 0, 0, 0, 0];
idsaver = 0;
// contatori per fare replaceChildren se si sostituisce la scelta
let cont_hair = 0;
let cont_nose = 0;
let cont_mouth = 0;

// Selezione elementi dal menù a tendina
function menuselection() {
  const selected = selectionMenu.value;
  const filenames = options[selected];
  const selected_el = (e) => {
    arrayCreation(e.target.id, selected);
    avatarcreation(e, selected);
    idsaver = e.target.id;
  };
  optionsContainer.replaceChildren([]);

  for (const filename of filenames) {
    if (
      selected === 'haircolor' ||
      selected === 'skin' ||
      selected === 'eyes'
    ) {
      const color = document.createElement('div');
      color.setAttribute('id', filename);
      color.setAttribute('class', 'colors');
      color.addEventListener('click', selected_el);
      optionsContainer.appendChild(color);
    } else {
      const a = document.createElement('div');
      a.classList.add('selectelement');
      a.style.cursor = 'pointer';
      a.style.background = 'white';
      a.setAttribute('id', filename);

      const el_img = document.createElement('object');
      el_img.classList.add('svgimage');
      el_img.id = filename + 'svg';
      el_img.type = 'image/svg+xml';
      el_img.data = filename + '.svg';

      a.addEventListener('click', selected_el);
      optionsContainer.appendChild(a);
      a.appendChild(el_img);
      el_img.addEventListener('load', function () {
        changeColor(el_img.id);
      });
    }
  }
}

selectionMenu.addEventListener('change', menuselection);

// Cambio colore capelli
function changeHairColor(color) {
  console.log('change hair color' + color);
  haircut = body.contentDocument.getElementById('haircut');
  haircut.classList.replace(haircut.classList.item(0), color);
  eyebrows = body.contentDocument.getElementById('eyebrows_left');
  eyebrows.classList.replace(eyebrows.classList.item(0), color);
  eyebrows = body.contentDocument.getElementById('eyebrows_right');
  eyebrows.classList.replace(eyebrows.classList.item(0), color);
}

//cambio colore capelli icone
function changeColor(name) {
  const elem = document.getElementById(name);
  console.log(elem);
  const ele = elem.contentDocument;
  const e = ele.getElementsByTagName('g')[0];
  e.classList.replace(e.classList.item(0), avatarFeat[0]);
}

//cambio taglio di capelli
function changeHairCut(hair) {
  console.log('change hair cut' + hair);
  haircut = body.contentDocument.getElementById('haircut');
  hr = hair + '.svg#' + hair;
  haircut.setAttribute('href', hr);
}

// Cambio colore pelle
//non funziona ancora perchè bisogna cambiare i colori nell'svg
function changeSkinColor(colorskin) {
  console.log('change skin color' + colorskin);
  skin = body.contentDocument.getElementById('sameskin');
  skin.classList.replace(skin.classList.item(0), colorskin);
  skin = body.contentDocument.getElementById('sameskin1');
  skin.classList.replace(skin.classList.item(0), colorskin + '1');
}

//cambio colore occhi
function changeEyesColor(eyescolor) {
  console.log('change eyes color' + eyescolor);
  iris = body.contentDocument.getElementById('iris_right');
  iris.classList.replace(iris.classList.item(0), eyescolor);
  iris = body.contentDocument.getElementById('iris_left');
  iris.classList.replace(iris.classList.item(0), eyescolor);
}

// Creazione avatar
function avatarcreation(e, selected) {
  if (selected === 'haircolor') {
    changeHairColor(e.target.id);
  }
  if (selected === 'haircut') {
    changeHairCut(e.target.id);
  }
  if (selected === 'skin') {
    changeSkinColor(e.target.id);
  }
  if (selected === 'eyes') {
    changeEyesColor(e.target.id);
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
  console.log(
    avatarFeat[0] +
      ',' +
      avatarFeat[1] +
      ',' +
      avatarFeat[2] +
      ',' +
      avatarFeat[3] +
      ',' +
      avatarFeat[4] +
      ',' +
      avatarFeat[5],
  );
}

avatardb = [0,0,0,0,0,0];

// Disabilta tendina dopo "done"
async function doneButton() {

  avatardb = avatarFeat;
  avatardb[6] = document.getElementById('nickname').value;

  selectionMenu.setAttribute('disabled', '');
  optionsContainer.replaceChildren([]);
  //console.log('final string: '+ avatarFeat[0]+','+avatarFeat[1]+','+avatarFeat[2]+','+avatarFeat[3]+','+avatarFeat[4]+','+avatarFeat[5]);
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
