const selectionMenu = document.getElementById("selection-menu");
const optionsContainer = document.getElementById("options-container");

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
    console.log(options[selected]);

    //createElement("img")

    //optionsContainer.addChildren
})