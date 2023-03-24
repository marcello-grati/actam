const filtersMenu = document.getElementById('filters-menu');
const optionsContainer = document.getElementById('options-container2');
const namebox = document.getElementById('nick-form');
const nameListContainer = document.getElementById('name-list-container');
const nameList = document.getElementById('name-list');
const noFound = document.getElementById('no_found');
const nameAvatar = document.getElementById('name-avatar_f');
const avatar_container = document.getElementById('avatar_container_f');
const body = document.getElementById('body_f');
const grid = document.getElementById('grid_container');

optionsContainer.style.display = 'none';
grid.style.display = 'none';

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


const selection = [];
idsaver=0;

function filtersSelection() {
    noFound.hidden = true;
    selection[0] = filtersMenu.value;
    nameListContainer.hidden = true;
    nameList.hidden = true;
    nameAvatar.hidden = true;
    avatar_container.hidden = true;
    body.hidden = true;
    grid.style.display = 'none';
    //console.log(1);

    console.log(selection);

    if(selection[0] === 'all'){
        optionsContainer.style.display = 'none';
        namebox.hidden = true;
        filtersArray(0, selection[0]);

    }else if(selection[0] === 'username'){
        optionsContainer.style.display = 'none';
        namebox.hidden = false;
        //console.log(2);

    }else {
        optionsContainer.style.display = 'grid';
        namebox.hidden= true;
        const filters = options[selection[0]];

        const selected_el = (e) => {
            filtersArray(e.target.id, selection[0]);
            idsaver = e.target.id;
        };
        //console.log(selection);
        //console.log(idsaver);

        optionsContainer.replaceChildren([]);

        for (const filter of filters) {
            if (
                selection[0] === 'haircolor' ||
                selection[0] === 'skin' ||
                selection[0] === 'eyes'
            ) {
                const color = document.createElement('div');
                color.setAttribute('id', filter);
                color.setAttribute('class', 'colors');
                color.addEventListener('click', selected_el);
                optionsContainer.appendChild(color);
            } else {
                const a = document.createElement('div');
                a.classList.add('selectelement');
                a.style.cursor = 'pointer';
                a.style.background = 'white';
                a.setAttribute('id', filter);

                const el_img = document.createElement('object');
                el_img.classList.add('svgimage');
                el_img.id = filter + 'svg';
                el_img.type = 'image/svg+xml';
                el_img.data = filter + '.svg';

                a.addEventListener('click', selected_el);
                optionsContainer.appendChild(a);
                a.appendChild(el_img);
                el_img.addEventListener('load', function () {
                    changeColor(el_img.id);
                });
            }

        }
    }

}

if(filtersMenu){
    filtersMenu.addEventListener('change', filtersSelection);
}




function changeColor(name) {
    const elem = document.getElementById(name);
    //console.log(elem);
    const ele = elem.contentDocument;
    const e = ele.getElementsByTagName('g')[0];
    e.classList.replace(e.classList.item(0), selection[1]);

}


if(namebox){
    namebox.addEventListener('keypress', function (event) {
        //console.log(3);
        if (event.key === 'Enter') {
            event.preventDefault();
            saveName();
        }
    });
}


function saveName() {
    const nameField = document.getElementById('username').value;
   // console.log(4);
    filtersArray(nameField, selection[0]);
    //console.log(nameField);

}

let all;

async function filtersArray(elem, selected) {

    noFound.hidden = true;
    if (selected === 'all') {
        selection[1] = 'all';
    }else {
        //console.log(5);
        selection[1] = elem;
    }

  const res = await fetch(
      'http://localhost:3000/community?' +
      new URLSearchParams({
          filters : JSON.stringify(selection),
      }),
  );
    all = await res.json();
    console.log(all);
    console.log(all.length);

    if(all.length === 0){
        optionsContainer.style.display = 'none';
        namebox.hidden = true;
        noFound.hidden = false;
    }else{
        showNicks(all.length, all);
    }


    //console.log(selection);
}


let nicknames = [];
function showNicks(length, avatars){

    console.log(avatars);
    optionsContainer.style.display = 'none';
    namebox.hidden = true;
    noFound.hidden = true;
    grid.style.display = 'grid';
    nameList.hidden = false;
    nameListContainer.hidden = false;
    avatar_container.hidden = false;
    body.hidden = false;


    nicknames.length = length;

    //console.log(nicknames.length);

    for(let i=0; i<length; i++){
        //console.log(name);
        nicknames[i] = avatars[i]["username"];
    }

    console.log(nicknames);

    nameList.replaceChildren([]);

    for (let i = 0; i < nicknames.length; i++) {
        const nickname = nicknames[i];

        // Create a list item element
        const li = document.createElement("li");
        li.textContent = nickname;
        li.style.fontSize = '2em';
        li.style.fontFamily = 'Helvetica Neue';
        li.style.margin = '10px';
        li.style.textTransform = 'uppercase';
        li.style.color = '#ffdead';
        li.style.transition = 'box-shadow 0.3s';
        li.addEventListener('mouseover', function() {
            li.style.boxShadow = '0 0 10px green';
        });
        li.addEventListener('mouseout', function() {
            li.style.boxShadow = '';
        });

        // Add a click event listener to the list item
        li.addEventListener("click", function() {
            // Call the seeAvatar function with the selected nickname
            chooseName(nickname, avatars);
        });

        // Add the list item to the name list
        nameList.appendChild(li);
    }


}


function chooseName(nickname, avatars) {

    optionsContainer.style.display = 'none';
    grid.hidden = false;
    console.log(`Selected nickname: ${nickname}`);
    const avatarFeat = [];

    for(let i=0; i<avatars.length; i++){
        if(avatars[i]['username'] === nickname){
            avatarFeat[0] = avatars[i]['haircolor'];
            avatarFeat[1] = avatars[i]['haircut'];
            avatarFeat[2] = avatars[i]['eyes'];
            avatarFeat[3] = avatars[i]['skin'];
            avatarFeat[4] = avatars[i]['nose'];
            avatarFeat[5] = avatars[i]['mouth'];
            avatarFeat[6] = avatars[i]['username'];
        }
    }

    console.log(avatarFeat);
    seeAvatar(nickname, avatarFeat);

}

function seeAvatar(nickname, avatar) {
    optionsContainer.style.display = 'none';
    filtersMenu.hidden = false;
    nameList.hidden = false;
    nameListContainer.hidden = false;

    nameAvatar.hidden = false;
    nameAvatar.innerText = nickname;

    avatar_container.hidden = false;
    body.hidden = false;

    if(avatar[0]==='0.0'){
        avatar[0] = 'black_hair';
    }
    if(avatar[1]==='0.0'){
        avatar[1] = '0h';
    }
    if(avatar[2]==='0.0'){
        avatar[2] = 'blue_eyes';
    }
    if(avatar[3]==='0.0'){
        avatar[3] = 'skin1';
    }



    haircut = body.contentDocument.getElementById('haircut');
    hr = avatar[1] + '.svg#' + avatar[1];
    haircut.setAttribute('href', hr);
    haircut = body.contentDocument.getElementById('haircut');
    haircut.classList.replace(haircut.classList.item(0), avatar[0]);
    eyebrows = body.contentDocument.getElementById('eyebrows_left');
    eyebrows.classList.replace(eyebrows.classList.item(0), avatar[0]);
    eyebrows = body.contentDocument.getElementById('eyebrows_right');
    eyebrows.classList.replace(eyebrows.classList.item(0), avatar[0]);
    skin = body.contentDocument.getElementById('sameskin');
    skin.classList.replace(skin.classList.item(0), avatar[3]);
    skin = body.contentDocument.getElementById('sameskin1');
    skin.classList.replace(skin.classList.item(0), avatar[3] + '1');
    iris = body.contentDocument.getElementById('iris_right');
    iris.classList.replace(iris.classList.item(0), avatar[2]);
    iris = body.contentDocument.getElementById('iris_left');
    iris.classList.replace(iris.classList.item(0), avatar[2]);





}
