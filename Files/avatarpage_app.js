const selectionMenu = document.getElementById("selection-menu");
const optionsContainer = document.getElementById("options-container");
const nameAvatar = document.getElementById("name-avatar");

function saveName() {

    const nameField = document.getElementById('nickname').value;
    nameAvatar.replaceChildren([]);
    const nick_vis = document.createElement('p');
    nick_vis.classList.add('neonText', 'subtitle');
    nick_vis.innerText = nameField;
    nameAvatar.appendChild(nick_vis);

}

const options = {
    "skin": ['color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7', 'color8', 'color9', 'color10'],
    "haircolor": ['color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7', 'color8', 'color9', 'color10', 'color11', 'color12'],
    "haircut": ['1','2','3'],
    "eyes": ['color1', 'color2', 'color3', 'color4'],
    "nose":['type1', 'type2', 'type3', 'type4'],
    "mouth": ['type1','type2']

};

selectionMenu.addEventListener("change", function() {
    const selected = selectionMenu.value;
    const filenames = options[selected];

    optionsContainer.replaceChildren([]);

    for (const filename of filenames) {
        const el_img = document.createElement('div');
        el_img.classList.add('neonText');
        el_img.innerText = filename;

        optionsContainer.appendChild(el_img);
    }
})

