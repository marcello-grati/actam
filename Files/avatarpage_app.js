const selectionMenu = document.getElementById("selection-menu");
const optionsContainer = document.getElementById("options-container");
//const nameAvatar = document.getElementById("name-avatar");
//const selectedElement = document.getElementsByClassName("options-container");

function saveName() {

    const nameField = document.getElementById('nickname').value;
    let nameAvatar = document.getElementById("name-avatar");
    nameAvatar.innerText = nameField;
    /*const nameField = document.getElementById('nickname').value;
    let e = document.createElement("p");
    e.classList.add('neonText', 'new_name');
    e.id = "name-avatar";
    e.innerText = nameField;
    let nameAvatar = document.getElementById("name-avatar");
    nameAvatar.replaceWith(e);*/
    /*nameAvatar.replaceChildren([]);
    const nick_vis = document.createElement('p');
    nick_vis.classList.add('neonText', 'subtitle');
    nick_vis.innerText = nameField;
    nameAvatar.appendChild(nick_vis);*/
}

const options = {
    "skin": ['color1s', 'color2s', 'color3s', 'color4s', 'color5s', 'color6s', 'color7s', 'color8s', 'color9s', 'color10s'],
    "haircolor": ['color1h', 'color2h', 'color3h', 'color4h', 'color5h', 'color6h', 'color7h', 'color8h', 'color9h', 'color10h', 'color11h', 'color12h'],
    "haircut": ['1h','2h','3h'],
    "eyes": ['color1e', 'color2e', 'color3e', 'color4e'],
    "nose":['type1n', 'type2n', 'type3n', 'type4n'],
    "mouth": ['type1m','type2m']

};

avatarFeat = [0,0,0,0,0,0];


selectionMenu.addEventListener("change", function() {
    const selected = selectionMenu.value;
    const filenames = options[selected];
    const selected_el = e => {
        arrayCreation(e.target.id, selected)
    }

    optionsContainer.replaceChildren([]);

    for (const filename of filenames) {

        const a = document.createElement('a');
        a.href = "#";
        a.cursor = "pointer";
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
    }
})

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


function doneButton(){
    selectionMenu.setAttribute('disabled', '');
    optionsContainer.replaceChildren([]);
    //console.log('final string: '+ avatarFeat[0]+','+avatarFeat[1]+','+avatarFeat[2]+','+avatarFeat[3]+','+avatarFeat[4]+','+avatarFeat[5]);
}





