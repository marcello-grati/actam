const filtersMenu = document.getElementById('filters-menu');
const optionsContainer = document.getElementById('options-container2');
const namebox = document.getElementById('nick-form');
const nameListContainer = document.getElementById('name-list-container');
const nameList = document.getElementById('name-list');
const noFound = document.getElementById('no_found');
const nameAvatar = document.getElementById('name-avatar_f');
const avatar_container = document.getElementById('avatar_container_f');
const body_svg = document.getElementById('body_f');
const grid = document.getElementById('grid_container');
const score_cont = document.getElementById('score');
const score_view = document.getElementById('score_text');
const order_by = document.getElementById('order-by');

optionsContainer.style.display = 'none';
grid.style.display = 'none';
score_cont.style.display = 'none';

avatargen = [];

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
    haircut: ['0h', '1h', '2h', '3h','4h','5h','6h','7h'],
    eyes: ['green_eyes', 'blue_eyes', 'brown_eyes', 'grey_eyes'],
    nose: ['type1n', 'type2n', 'type3n', 'type4n'],
    mouth: ['type1m', 'type2m'],
};

const selection = [];

if (filtersMenu) {
    filtersMenu.addEventListener("change", filtersSelection);
}

function filtersSelection() {

    nameList.replaceChildren([]);
    order_by.value = 'null1';
    defaultAvatar();
    selection[0] = filtersMenu.value;

    document.getElementById('play_community').hidden = true;
    document.getElementById('pause').hidden = true;
    document.getElementById('stop').hidden = true;
    grid.style.display = 'none';
    score_cont.style.display = 'none';
    noFound.hidden = true;

    console.log(selection);

    // all avatars
    if(selection[0] === 'all'){
        optionsContainer.style.display = 'none';
        namebox.hidden = true;
        filtersArray(0, selection[0]);

    }
    // filter by name
    else if(selection[0] === 'username'){
        optionsContainer.style.display = 'none';
        namebox.hidden = false;

    }
    // other filters
    else {
        optionsContainer.style.display = 'grid';
        namebox.hidden= true;
        const filters = options[selection[0]];

        const selected_el = (e) => {
            filtersArray(e.target.id, selection[0]);
        };
        console.log(selection);

        optionsContainer.replaceChildren([]);

        // display delle caratteristiche
        for (const filter of filters) {
            if (
                selection[0] === 'haircolor' ||
                selection[0] === 'skin' ||
                selection[0] === 'eyes'
            ) {
                // Crea le icone dei colori
                const color = document.createElement('div');
                color.setAttribute('id', filter);
                color.setAttribute('class', 'colors');
                color.addEventListener('click', selected_el);
                optionsContainer.appendChild(color);
            } else {
                // Crea le icone di capelli, naso, bocca
                const a = document.createElement('div');
                a.classList.add('selectelement');
                a.style.cursor = 'pointer';
                a.style.background = 'white';
                a.setAttribute('id', filter);

                const el_img = document.createElement('object');
                if(selection[0]==='nose')
                    el_img.classList.add('svgimage_nose');
                else if(selection[0]==='mouth')
                    el_img.classList.add('svgimage_mouth');
                else if(selection[0]==='haircut')
                    el_img.classList.add('svgimage_hair');
                el_img.id = filter + 'svg';
                el_img.type = 'image/svg+xml';
                el_img.data = filter + '.svg';

                a.addEventListener('click', selected_el);
                optionsContainer.appendChild(a);
                a.appendChild(el_img);
            }
        }
    }
    filtersMenu.value = 'null';
}

if(namebox){
    namebox.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveName();
        }
    });
}

function saveName() {
    const nameField = document.getElementById('username').value;
    filtersArray(nameField, selection[0]);
    //console.log(nameField);

}

let all;
let all_avatars=[];
async function filtersArray(elem, selected) {

    noFound.hidden = true;
    if (selected === 'all') {
        selection[1] = 'all';
    }else {
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

    all_avatars = all;

    if(all.length === 0){
        optionsContainer.style.display = 'none';
        namebox.hidden = true;
        noFound.hidden = false;
    }else{
        showNicks();
    }
    //console.log(selection);
}

function showNicks(){

    console.log(all_avatars);
    optionsContainer.style.display = 'none';
    namebox.hidden = true;
    noFound.hidden = true;
    grid.style.display = 'flex';
    nameList.hidden = false;
    nameListContainer.hidden = false;
    avatar_container.hidden = false;
    body_svg.hidden = false;

    nameList.replaceChildren([]);

    for (let i = 0; i < all_avatars.length; i++) {
        const nickname = all_avatars[i]['username'];
        const userid = all_avatars[i]['id'];

        // Create a list item element
        const li = document.createElement("li");
        li.textContent = nickname;
        li.addEventListener('mouseover', function() {
            li.style.boxShadow = '0 0 10px green';
        });
        li.addEventListener('mouseout', function() {
            li.style.boxShadow = '';
        });
        // Add a click event listener to the list item
        li.addEventListener("click", function() {
            // Call the seeAvatar function with the selected nickname
            chooseName(nickname, userid);
        });

        // Add the list item to the name list
        nameList.appendChild(li);
        console.log(i);
    }
    order_by.addEventListener("change", ordering);
}


function ordering(){
    let order = order_by.value;

    //console.log(order);

    if(order === 'higher'){
        //console.log(order);
        all_avatars.sort(function(a,b){
            return b["score"]-a["score"];
        });
        //console.log(all_avatars);
    }else if(order === 'lower'){
        all_avatars.sort(function(a,b){
            return a["score"]-b["score"];
        });
    }else if(order === 'az'){
        all_avatars.sort((a, b) => {
            if (a["username"] < b["username"]) {
                return -1;
            }
            if (a["username"] > b["username"]) {
                return 1;
            }
            return 0;
        });
    }else if(order === 'za'){
        all_avatars.sort((a, b) => {
            if (a["username"] > b["username"]) {
                return -1;
            }
            if (a["username"] < b["username"]) {
                return 1;
            }
            return 0;
        });
    }
    
    showNicks();
}

function chooseName(nickname, userid) {

    optionsContainer.style.display = 'none';
    grid.hidden = false;
    score_cont.style.display = 'none';
    console.log(`Selected nickname: ${nickname}`);

    for(let i=0; i<all_avatars.length; i++){
        if(all_avatars[i]['id'] === userid){
            avatargen[0] = all_avatars[i]['haircolor'];
            avatargen[1] = all_avatars[i]['haircut'];
            avatargen[2] = all_avatars[i]['eyes'];
            avatargen[3] = all_avatars[i]['skin'];
            avatargen[4] = all_avatars[i]['nose'];
            avatargen[5] = all_avatars[i]['mouth'];
            avatargen[6] = all_avatars[i]['username'];
            avatargen[7] = all_avatars[i]['score'];
            avatargen[8] = all_avatars[i]['votes'];
            avatargen[9] = all_avatars[i]['id'];
        }
    }

    console.log(avatargen);
    seeAvatar(nickname);

}

function seeAvatar(nickname) {
    optionsContainer.style.display = 'none';
    filtersMenu.hidden = false;
    nameList.hidden = false;
    nameListContainer.hidden = false;

    nameAvatar.hidden = false;
    nameAvatar.innerText = nickname;

    avatar_container.hidden = false;
    body_svg.hidden = false;
    document.getElementById('play_community').hidden = false;
    document.getElementById('pause').hidden = false;
    document.getElementById('stop').hidden = false;

    score_cont.style.display = 'flex';
    score_view.hidden = false;

    score_view.innerText = 'SCORE: '+avatargen[7]+'/5';


    avatarScore(avatargen[7], avatargen[8]);


    let haircut = body_svg.contentDocument.getElementById('haircut');
    let hr = avatargen[1] + '.svg#' + avatargen[1];
    haircut.setAttribute('href', hr);
    haircut.classList.replace(haircut.classList.item(0), avatargen[0]);
    let eyebrows = body_svg.contentDocument.getElementById('eyebrows_left');
    eyebrows.classList.replace(eyebrows.classList.item(0), avatargen[0]);
    eyebrows = body_svg.contentDocument.getElementById('eyebrows_right');
    eyebrows.classList.replace(eyebrows.classList.item(0), avatargen[0]);
    let skin = body_svg.contentDocument.getElementById('sameskin');
    skin.classList.replace(skin.classList.item(0), avatargen[3]);
    skin = body_svg.contentDocument.getElementById('sameskin1');
    skin.classList.replace(skin.classList.item(0), avatargen[3] + '1');
    let iris = body_svg.contentDocument.getElementById('iris_right');
    iris.classList.replace(iris.classList.item(0), avatargen[2]);
    iris = body_svg.contentDocument.getElementById('iris_left');
    iris.classList.replace(iris.classList.item(0), avatargen[2]);
    let nose = body_svg.contentDocument.getElementById('nose');
    hr = avatargen[4] + '.svg#' + avatargen[4];
    nose.setAttribute('href', hr);
    nose.classList.replace(nose.classList.item(0), avatargen[3] + '1');
    let mouth = body_svg.contentDocument.getElementById('mouth');
    hr = avatargen[5] + '.svg#' + avatargen[5];
    mouth.setAttribute('href', hr);
    mouth.classList.replace(mouth.classList.item(0), avatargen[3] + '1');
}

function defaultAvatar(){
    /*avatargen[0] = 'black_hair';
    avatargen[1] = '0h';
    avatargen[2] = 'blue_eyes';
    avatargen[3] = 'skin1';*/

    body_svg.replaceChildren([]);
    score_cont.style.display = 'none';
    score_view.hidden = true;
    nameAvatar.hidden = true;
}

stars_vector = [];
nStars = 5;

scores = [];

function avatarScore(score, votes){

    score_cont.replaceChildren([]);

    const vote_text = document.createElement('p');
    vote_text.setAttribute('class','neonText new_name');
    vote_text.innerText = 'VOTE';
    score_cont.appendChild(vote_text);


    const a = document.createElement('div');
    a.setAttribute('id', 'star_cont');

    score_cont.appendChild(a);


    for(let i = 0; i<nStars; i++){

        id =i;
        //console.log(id);
        htmlStar = '<svg  id='+id+' viewBox="0 0 100 100">'+
            '<path id='+id+' stroke-width="3" d="M50 5 L61.8 37.5 L95 37.5 L68.7 58.3 L79.4 95.1 L50 75.2 L20.6 95.1 L31.3 58.3 L5 37.5 L38.2 37.5 Z" />'+
            ' </svg>';

        //a.innerHTML =stars_vector[i];
        child = document.createElement('div');
        child.innerHTML = htmlStar;
        a.appendChild(child);
        stars_vector[i] = document.getElementById(id);
        //console.log(stars_vector[i]);
        stars_vector[i].style.stroke = 'yellow';
        stars_vector[i].style.width = '30px';
        stars_vector[i].style.height = '30px';

        stars_vector[i].addEventListener('mouseenter', colorBorder);
        stars_vector[i].addEventListener('mouseleave', unColorBorder);
        stars_vector[i].addEventListener('click', fillStar);
    }

    console.log('score:'+ score + ' votes:' + votes);
    scores[0] = score;
    scores[1] = votes;
}

function colorBorder(e){
    var img = e.target;
    img.style.stroke = 'orange';

}

function unColorBorder(e){
    var img = e.target;
    img.style.stroke = 'yellow';
}

function fillStar(e) {
    //console.log('enter');
    //console.log(e.target.id);

    const img = stars_vector[e.target.id];
    let num = parseInt(e.target.id);
    //console.log('num '+num);

    if (img.style.fill === 'yellow') {
        for (let i = 0; i < nStars; i++) {
            stars_vector[i].style.fill = 'none';
            //console.log("coloring"+i)
        }
    } else

        for (let i = 0; i < num + 1; i++) stars_vector[i].style.fill = 'yellow';

    console.log('scores: ' + scores);

    const new_score_dec = (scores[0] * scores[1] + (num + 1)) / (scores[1] + 1);
    let new_score = new_score_dec.toFixed(1);
    console.log('new score:' + new_score);

    avatargen[7] = new_score;
    avatargen[8] += 1;

    let new_votes = avatargen[8];

    for(let i=0; i<all_avatars.length; i++){
        if(all_avatars[i]['id'] === avatargen[9]){
            all_avatars[i]['score'] = new_score;
            all_avatars[i]['votes'] = new_votes;
        }
    }

    score_view.innerText = 'SCORE: '+new_score+'/5';

    console.log(avatargen);


    const data = {
        genome: [
            avatargen[0],
            avatargen[1],
            avatargen[2],
            avatargen[3],
            avatargen[4],
            avatargen[5],
            avatargen[6],
            avatargen[7],
            avatargen[8],
            avatargen[9]
        ]
    };

    fetch('http://localhost:3000/community/update?', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));




}
