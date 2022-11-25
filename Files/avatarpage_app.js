const selectionMenu = document.getElementById("selection-menu");
const optionsContainer = document.getElementById("options-container");
const avatarcontainer = document.getElementById("avatar-container");
const namebox = document.getElementById("nickname");


//  Conferma nickname da tastiera
namebox.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        saveName();
    }
});

// Creazione testo con nickname inserito
function saveName() {
    const nameField = document.getElementById('nickname').value;
    let nameAvatar = document.getElementById("name-avatar");
    nameAvatar.innerText = nameField;
    changeView();

}

// Cambio layout
function changeView(){
    document.getElementById("create-container").style.display="flex";
    document.getElementById("done").hidden=false;
    document.getElementById("nick-form").style.display="none";

}

const options = {
    "skin": ['skin1', 'skin2', 'skin3', 'skin4', 'skin5', 'skin6', 'skin7', 'skin8', 'skin9', 'skin10'],
    "haircolor": ['black_hair', 'white_hair', 'brown_hair', 'blonde_hair', 'red_hair', 'grey_hair', 'lightbrown_hair', 'pink_hair', 'blue_hair', 'brown2_hair', 'chocolate_hair', 'gold_hair'],
    "haircut": ['1h','2h','3h'],
    "eyes": ['green_eyes', 'blue_eyes', 'brown_eyes', 'grey_eyes'],
    "nose":['type1n', 'type2n', 'type3n', 'type4n'],
    "mouth": ['type1m','type2m']

};

avatarFeat = [0,0,0,0,0,0];

// contatori per fare replaceChildren se si sostituisce la scelta
let cont_hair=0;
let cont_nose=0;
let cont_mouth=0;



// Selezione elementi dal menù a tendina
function menuselection(){
    const selected = selectionMenu.value;
    const filenames = options[selected];
    const selected_el = e => {
        arrayCreation(e.target.id, selected);
        avatarcreation(e,selected);
    }
    optionsContainer.replaceChildren([]);


    for (const filename of filenames){

        if(selected === 'haircolor' || selected === 'skin' || selected === 'eyes'){

            const color = document.createElement('div');
            color.setAttribute('id', filename);
            color.setAttribute('class', 'colors');
            color.addEventListener("click", selected_el);
            optionsContainer.appendChild(color);


        }else{

            const a = document.createElement('a');
            a.href = "#";
            a.cursor = "pointer";
            a.style.background = "white";
            a.setAttribute('id',filename);

            const el_img = document.createElement('object');
            el_img.classList.add('svgimage');
            el_img.type = "image/svg+xml";
            el_img.data = "hair1.svg";
            el_img.height = "50px";
            el_img.width = "50px";

            a.addEventListener("click", selected_el);
            optionsContainer.appendChild(a);
            a.appendChild(el_img);

            el_img.addEventListener('load',changeHairColor);


        }

    }
}

selectionMenu.addEventListener("change", menuselection);

// Cambio colore
function changeHairColor() {
    const elem = document.querySelectorAll('.svgimage');
    for(let i = 0; i<elem.length; i++){
        const ele = elem[i].contentDocument;
        const e = ele.getElementById('SvgjsG1373');
        e.classList.replace(e.classList.item(0), avatarFeat[0]);
    }
}

// Creazione avatar
function avatarcreation(e, selected){
    if (selected !== 'haircolor' && selected!=='skin') {
        const av_img = document.createElement('object');
        av_img.classList.add('svgimage');
        av_img.type = "image/svg+xml";
        av_img.height = "30%";
        av_img.width = "30%";
        av_img.setAttribute('opacity', '1');

        if (selected === 'haircut') {
            cont_hair++;
            if (cont_hair > 1) {
                avatarcontainer.replaceChild();
            }
            av_img.data = "hair1.svg"; //poi sarebbe " e.target.id + '.svg' "
            av_img.addEventListener('load',changeHairColor);
            //avatarcontainer.addEventListener("load",changeHairColor);


        }else if(selected === 'mouth'){
            cont_mouth++;
            if(cont_mouth > 1){
                avatarcontainer.replaceChild();
            }
        }else if(selected === 'nose'){
            cont_nose++;
            if(cont_nose > 1){
                avatarcontainer.replaceChild();
            }
        }


        avatarcontainer.appendChild(av_img);
    }

}

// Creazione array genoma avatar
function arrayCreation(elem, selected){
    // [0]=hair color, [1]=haircut, [2]=eyes, [3]=skin [4]=nose, [5]=mouth
    if(selected==='haircolor')
        avatarFeat[0] = elem
    else if(selected==='haircut')
        avatarFeat[1] = elem
    else if(selected==='eyes')
        avatarFeat[2] = elem
    else if(selected==='skin')
        avatarFeat[3] = elem
    else if(selected==='nose')
        avatarFeat[4] = elem
    else if(selected==='mouth')
        avatarFeat[5] = elem

    // Per visualizzare array in console
    console.log(avatarFeat[0]+','+avatarFeat[1]+','+avatarFeat[2]+','+avatarFeat[3]+','+avatarFeat[4]+','+avatarFeat[5])
}

// Disabilta tendina dopo "done"
function doneButton(){
    selectionMenu.setAttribute('disabled', '');
    optionsContainer.replaceChildren([]);
    //console.log('final string: '+ avatarFeat[0]+','+avatarFeat[1]+','+avatarFeat[2]+','+avatarFeat[3]+','+avatarFeat[4]+','+avatarFeat[5]);
}





