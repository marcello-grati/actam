const Tone = require('tone');
const Tonal = require('tonal');

// Create an inverted chord
function invert(chord, inv_num) {
    return Tonal.Chord.getChord(chord.type, chord.tonic, chord.notes[inv_num]);
}

// Choose between a set of chords
function choose_btw_set(choices, input, index) {
    let choice = input[index] % choices.length;
    return choices[choice] - 1
}

// Main function
function writeMusic () {

    // Random input
    let input = [];
    for (let i=0; i<100; i++)
        input[i] = Math.floor(Math.random()*100)

    const key_index = 0
    const bpm_index = 1
    const measures_index = 2
    const chord_index = 3

    const chromaticScale = Tonal.Range.chromatic(["C4", "B4"], {sharps : true, pitchClass : true});

    const key = new Tonal.Key.majorKey(chromaticScale[input[key_index] % 12]);

    const chords_scale = key.chords;
    let chords_scale_obj = [];
    key.chords.forEach((value, index) => {chords_scale_obj[index] = Tonal.Chord.get(value)})

    const bpm = input[bpm_index] % 50 + 80;

    const measures = input[measures_index] % 5 + 4;

    console.log(key);
    console.log("BPM = " + bpm);
    console.log("n° of measures = " + measures);
    console.log(chords_scale);

    let progression = []

    for (let i=0; i<measures; i++)
    {
        if (i===0)
            progression[i] = chords_scale_obj[choose_btw_set([1, 6], input, chord_index + i)];

        else if (i === measures-2)
            progression[i] = chords_scale_obj[choose_btw_set([2, 4], input, chord_index + i)];

        else if (i === measures-1)
            progression[i] = chords_scale_obj[5 - 1];

        else {

            if (progression[i-1].tonic === key.scale[1 - 1]) {
                progression[i] = chords_scale_obj[choose_btw_set([2, 3, 4, 5, 6], input, chord_index + i)];

                if (progression[i].tonic === key.scale[5 - 1])
                    progression[i] = invert(progression[i], 1);
            }
            else if (progression[i-1].tonic === key.scale[2 - 1])
                progression[i] = chords_scale_obj[choose_btw_set([1, 5, 6, 7], input, chord_index + i)];

            else if (progression[i-1].tonic === key.scale[3 - 1])
                progression[i] = chords_scale_obj[4 - 1];

            else if (progression[i-1].tonic === key.scale[4 - 1])
                progression[i] = chords_scale_obj[choose_btw_set([2, 5, 6, 7], input, chord_index + i)];

            else if (progression[i-1].tonic === key.scale[5 - 1])
                progression[i] = chords_scale_obj[choose_btw_set([1, 6, 7], input, chord_index + i)];

            else if (progression[i-1].tonic === key.scale[6 - 1])
                progression[i] = chords_scale_obj[choose_btw_set([2, 3, 4, 5], input, chord_index + i)];

            else if (progression[i-1].tonic === key.scale[7 - 1])
                progression[i] = chords_scale_obj[1 - 1];
        }
        if (progression[i].tonic === key.scale[2 - 1] || progression[i].tonic === key.scale[7 - 1])
            progression[i] = invert(progression[i], 1);
    }
    console.log(progression);
}

// Test
writeMusic();