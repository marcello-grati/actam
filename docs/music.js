const Tone = require('tone');
const Tonal = require('tonal');
const seedrandom = require('seedrandom');

let recording = false;
let recording_interrupted = false;
let sheet;
const num_of_chord_notes = 3;
const num_of_voices = 1;
const piano_options = {
    urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3"
    },
    release: 2,
    baseUrl: "https://tonejs.github.io/audio/salamander/"
}

const t = Tone.Transport;
const pan_left = new Tone.Panner().toDestination();
//const pan_right = new Tone.Panner(0.5).toDestination();
//const piano_chord_sampler = new Tone.Sampler(piano_options).toDestination();
//const piano_melody_sampler = new Tone.Sampler(piano_options).connect(pan_left);
//const piano_right_sampler = new Tone.Sampler(piano_options).connect(pan_right);
//const piano_melody_sampler = new Tone.Sampler(piano_options).toDestination();
//const piano_right_sampler = new Tone.Sampler(piano_options).toDestination();

const piano_chord_sampler = new Tone.Sampler(piano_options).connect(pan_left);
const piano_melody_sampler = new Tone.Sampler(piano_options).connect(pan_left);

//const audio = document.querySelector('audio');    // This is only to use the html audio player

const dest  = Tone.context.createMediaStreamDestination();
pan_left.connect(dest);
const recorder = new MediaRecorder(dest.stream, { mimeType: "audio/webm" });

// Create an inverted chord
function invert(chord, inv_num) {
    return Tonal.Chord.getChord(chord.type, chord.tonic, chord.notes[inv_num]);
}

// Choose between a set of chords
function choose_btw_set(choices, input, index) {
    index = index % input.length;
    let choice = input[index] % choices.length;
    return choices[choice] - 1
}

function features2int() {
    let input = [];
    input.push(options.haircolor.indexOf(avatarFeat[0]));
    input.push(options.haircut.indexOf(avatarFeat[1]));
    input.push(options.eyes.indexOf(avatarFeat[2]));
    input.push(options.skin.indexOf(avatarFeat[3]));
    input.push(options.nose.indexOf(avatarFeat[4]));
    input.push(options.mouth.indexOf(avatarFeat[5]));

    // input.push(Math.round(rng(*3)) // temp nose
    // input.push(Math.round(rng()) // temp mouth

    return input;
}

function features2int_community() {
    let input = [];
    input.push(options.haircolor.indexOf(avatargen[0]));
    input.push(options.haircut.indexOf(avatargen[1]));
    input.push(options.eyes.indexOf(avatargen[2]));
    input.push(options.skin.indexOf(avatargen[3]));
    input.push(options.nose.indexOf(avatargen[4]));
    input.push(options.mouth.indexOf(avatargen[5]));

    // input.push(Math.round(rng(*3)) // temp nose
    // input.push(Math.round(rng()) // temp mouth

    return input;
}

function convertInput(input) {
    let chordInput = [];
    for (let i=0; i<6; i++) {    // for (let i=0; i<input.length; i++) {
        if (i%3 === 0) chordInput[i] = input[i] % 7
        else chordInput[i] = (input[i] + input[i - i%3]) % 7;
    }
    return chordInput;
}

function input2intervals(input) {

    switch (input) {
        case 0: return -3;
        case 1: return -2;
        case 2: return -1;
        case 3: return 0;
        case 4: return 1;
        case 5: return 2;
        case 6: return 3;
        default: return null;
    }
}

function nextDissonantNote(input, old_note, key) {
    let old_note_index = key.scale.indexOf(old_note);
    let next_note_index = old_note_index + input2intervals(input);
    let next_note;
    if (next_note_index < 0) {
        next_note_index += 7;
        next_note = key.scale[next_note_index] + "3";
        next_note = Tonal.Note.transpose(next_note, "-8P");
    } else if (next_note_index > 6) {
        next_note_index -= 7;
        next_note = key.scale[next_note_index] + "3";
        next_note = Tonal.Note.transpose(next_note, "+8P");
    } else {
        next_note = key.scale[next_note_index] + "3";
    }
    return next_note;
}

function nextConsonantNote(input, old_note, key, chord) {

    let next_note = null;
    while (chord.indexOf(next_note)===-1) {

        next_note = nextDissonantNote(input, old_note, key);
        input = (input + 1) % 7;
    }
    return next_note;
}

// write the sheet music
function writeMusic (option) {

    let input = [];

    // for (let i=0; i<1000; i++) input[i] = Math.floor(rng(*100); // deprecated

    if (option)
        input = features2int_community();
    else
        input = features2int();

    let chord_input = convertInput(input);
    //for (let i=0; i<1000; i++) input.push(Math.floor(rng(*100));

    let seed_string = "";
    for (let i=0; i<input.length; i++) {
        seed_string = seed_string + input[i];
    }
    let rng = seedrandom(seed_string);
    //seedrandom(seed_string, { global: true });

    if (option)
        console.log("avatargen: ", avatargen);
    else
        console.log("avatarFeat: ", avatarFeat);
    console.log("stringa in input: ", input);
    console.log("chordInput: ", chord_input);

    const measures_index = 1;
    const key_index = 0;
    const bpm_index = 3;
    const chord_index = 3;

    //const measures = input[measures_index] % 5 + 4;   // deprecated
    const measures = input[measures_index] + 4;

    const first_note_index1 = chord_index + 1;
    const first_rythm_index1 = first_note_index1 + measures*16;

    //const first_note_index2 = first_rythm_index1 + measures*16
    //const first_rythm_index2 = first_note_index2 + measures*16

    const chromatic_scale = Tonal.Range.chromatic(["C4", "B4"], {sharps : false, pitchClass : true});

    const key = new Tonal.Key.majorKey(chromatic_scale[input[key_index]]);
    // const key = new Tonal.Key.majorKey(chromaticScale[input[key_index] % 12]);   // deprecated
    //const key = new Tonal.Key.majorKey("C"); // test

    let chords_scale_obj = [];
    key.chords.forEach((value, index) => {chords_scale_obj[index] = Tonal.Chord.get(value)});

    // const bpm = input[bpm_index] % 30 + 95;  // deprecated
    const bpm = input[bpm_index] * 2 + 100;

    t.bpm.value = bpm;

    //console.log(key);
    console.log("key = ", key.tonic);
    console.log("BPM = " + bpm);
    console.log("measures = " + measures);
    // console.log(key.chords);

    let progression = [];

    for (let i=0; i<measures; i++)
    {
        if (i===0)
            progression[i] = chords_scale_obj[choose_btw_set([1, 6], chord_input, i)];
            // progression[i] = chords_scale_obj[choose_btw_set([1, 6], input, chord_index + i)];

        else if (i === measures-2)
            progression[i] = chords_scale_obj[choose_btw_set([2, 4], chord_input, i)];
            // progression[i] = chords_scale_obj[choose_btw_set([2, 4], input, chord_index + i)];

        else if (i === measures-1)
            progression[i] = chords_scale_obj[5 - 1];

        else {

            if (progression[i-1].tonic === key.scale[1 - 1]) {
                // progression[i] = chords_scale_obj[choose_btw_set([2, 3, 4, 5, 6], input, chord_index + i)];
                progression[i] = chords_scale_obj[choose_btw_set([2, 3, 4, 5, 6], chord_input, i)];

                if (progression[i].tonic === key.scale[5 - 1])
                    progression[i] = invert(progression[i], 1);
            }
            else if (progression[i-1].tonic === key.scale[2 - 1])
                progression[i] = chords_scale_obj[choose_btw_set([1, 5, 6, 7], chord_input, i)];
                // progression[i] = chords_scale_obj[choose_btw_set([1, 5, 6, 7], input, chord_index + i)];

            else if (progression[i-1].tonic === key.scale[3 - 1])
                progression[i] = chords_scale_obj[4 - 1];

            else if (progression[i-1].tonic === key.scale[4 - 1])
                progression[i] = chords_scale_obj[choose_btw_set([2, 5, 6, 7], chord_input, i)];
                // progression[i] = chords_scale_obj[choose_btw_set([2, 5, 6, 7], input, chord_index + i)];

            else if (progression[i-1].tonic === key.scale[5 - 1])
                progression[i] = chords_scale_obj[choose_btw_set([1, 6, 7], chord_input, i)];
                // progression[i] = chords_scale_obj[choose_btw_set([1, 6, 7], input, chord_index + i)];

            else if (progression[i-1].tonic === key.scale[6 - 1])
                progression[i] = chords_scale_obj[choose_btw_set([2, 3, 4, 5], chord_input, i)];
                // progression[i] = chords_scale_obj[choose_btw_set([2, 3, 4, 5], input, chord_index + i)];

            else if (progression[i-1].tonic === key.scale[7 - 1])
                progression[i] = chords_scale_obj[1 - 1];
        }
        if (progression[i].tonic === key.scale[2 - 1] || progression[i].tonic === key.scale[7 - 1])
            progression[i] = invert(progression[i], 1);
    }
    console.log(progression);

    let simple_progression = [];

    for (let i=0; i<measures; i++) {
        simple_progression.push(new Array(num_of_chord_notes));
        for (let j=0; j<num_of_chord_notes; j++) {
            simple_progression[i][j] = progression[i].notes[j] + "3";
        }
    }
    // console.log(simple_progression);

    // Math.ceil(x/2) +1

    let melody = [];

    for (let i=0; i<measures; i++) {
        let tempo_left = 16;
        let counter = 0;
        let old_note = null;
        let duration;
        let note;
        let time

        while (tempo_left > 0) {

            if (counter === 0) {
                duration = Math.floor(rng() * 2) + 3;
                // duration = input[first_rhythm_index1 + i*16 + counter] % 2 + 3;   // deprecated
                //duration = 4; // test
                //note = simple_progression[i][chord_input[(i + counter) % chord_input.length] % num_of_chord_notes];
                note = simple_progression[i][Math.floor(rng() * num_of_chord_notes)];

            } else {

                duration = Math.ceil(Math.floor(rng() * 7) / 2) + 1;
                //duration = Math.ceil(chord_input[(i + counter) % chord_input.length] / 2) + 1;
                //console.log(chord_input[(i + counter) % chord_input.length], " -> ", duration);

                // deprecated
                //duration = input[first_rhythm_index1 + i*16 + counter] % 4 + 1;
                // duration = input[first_rhythm_index1 + i*16 + counter] % 6;     // per avere più 1/4

                // if (duration < 1 || duration > 4) duration = 2;

                //duration = 4; // test

                if (duration > 2) {

                    /*let min_dist = Tonal.Interval.get("8P");
                    let min_pos = 8;
                    for (let s=0; s<key.scale.length; s++) {
                        let cur_dist = Tonal.Interval.get(Tonal.Interval.distance(old_note, key.scale[s] + "3"));
                        //console.log("ciclo " + s +" cur_dist=" + cur_dist.name + " min_dist=" + min_dist.name);
                        if (Math.abs(cur_dist.num) < Math.abs(min_dist.num) && cur_dist.num!==1 && simple_progression[i].indexOf(key.scale[s] + "3")!==-1) {
                            min_dist = cur_dist;
                            min_pos = s;
                        }
                    }
                    note = Tonal.Note.transpose(old_note, min_dist);*/

                    //console.log("fine for " + note + " " + simple_progression[i]);

                    //note = simple_progression[i][input[first_note_index1 + i*16 + counter] % num_of_chord_notes];
                    //note = Tonal.Note.transpose(note, "+8P");


                    //note = nextConsonantNote(chord_input[(i + counter) % chord_input.length], old_note, key, simple_progression[i]);
                    note = nextConsonantNote(Math.floor(rng() * 7), old_note, key, simple_progression[i]);

                } else {

                    /*let min_dist = Tonal.Interval.get("8P");
                    let min_pos = 8;
                    for (let s=0; s<key.scale.length; s++) {
                        let cur_dist = Tonal.Interval.get(Tonal.Interval.distance(old_note, key.scale[s] + "3"));
                        //console.log("ciclo " + s +" cur_dist=" + cur_dist.name + " min_dist=" + min_dist.name);
                        if (Math.abs(cur_dist.num) < Math.abs(min_dist.num) && cur_dist.num!==1 ) {
                            min_dist = cur_dist;
                            min_pos = s;
                        }
                    }
                    note = Tonal.Note.transpose(old_note, min_dist);
                    //console.log("fine for " + note);

                    //note = key.scale[input[first_note_index1 + i*16 + counter] % 7] + "3";

                    let prec_interval = Tonal.Interval.get(Tonal.Interval.distance(old_note, note)).num;
                    if (prec_interval > 4) {
                        note = Tonal.Note.transpose(note, "-8M")
                    } else if (prec_interval < -4) {
                        note = Tonal.Note.transpose(note, "+8M")
                    }*/

                    note = nextDissonantNote(Math.floor(rng() * 7), old_note, key);
                    //note = nextDissonantNote(chord_input[(i + counter) % chord_input.length], old_note, key);
                }
            }
            while (tempo_left - duration < 0) duration -= 1

            time = (i * 16 + (16 - tempo_left)) * t.toSeconds("16n");
            tempo_left -= duration;
            counter++;
            old_note = note;

            melody.push(
                {
                    time : time,
                    noteName : note = Tonal.Note.transpose(note, "+8P"),
                    velocity : 0.7,
                    duration : duration * t.toSeconds("16n")
                }
            )
            /*
            console.log("measure " + i);
            console.log({

                time : time,
                noteName : note,
                velocity : 0.7,
                duration : duration * t.toSeconds("16n")
            });
            */
        }
    }
    console.log("melody :");
    console.log(melody);

    sheet =  {
        bpm: bpm,
        measures: measures,
        key: key,
        progression: simple_progression,
        melody : melody
    }
}

// play the song
function initializeMusic() {

    t.cancel();
    //console.log(sheet)
    //t.bpm.value = sheet.bpm;
    //console.log(t.get());

    let part_array = [];

    for (let i=0; i<sheet.measures; i++) {
        for (let j=0; j<num_of_chord_notes; j++) {
            part_array.push(
                {
                    time : i * t.toSeconds("1m"),
                    noteName : Tonal.Note.simplify(sheet.progression[i][j]),
                    duration : "1m",
                    velocity : 0.5
                }
            )
        }
    }

    let melody = sheet.melody;
    let melodyPart = new Tone.Part(((time, melody) => {
        piano_melody_sampler.triggerAttackRelease(melody.noteName, melody.duration, time, melody.velocity);
    }), melody).start(0);
    melodyPart.loop = true;
    melodyPart.loopEnd = (sheet.measures) * t.toSeconds("1m");
    //pianoPart.humanize = true;

    let chordsPart = new Tone.Part(((time, part_array) => {
        piano_chord_sampler.triggerAttackRelease(part_array.noteName, part_array.duration, time, part_array.velocity);
    }), part_array).start(0);
    chordsPart.loop = true;
    chordsPart.loopEnd = (sheet.measures) * t.toSeconds("1m");
    //pianoPart.humanize = true;
}

function downloadMusic() {

    Tone.start().then(() => {

        console.log("download audio file");

        const chunks = [];
        let initialDelay = 1000;    // in milliseconds
        let duration = ((sheet.measures * 4 + 1) * 60 / sheet.bpm) * 1000;  // in milliseconds
        let fadeOut = 2000; // in milliseconds

        t.stop();

        setTimeout(function() {
            recorder.start();
            t.start();
        }, initialDelay);

        setTimeout(function(){
            if (!recording_interrupted) {
                t.stop();
                setTimeout(()=>{ recorder.stop() }, fadeOut);
                recording = false;
            } else {
                recording_interrupted = false;
            }
        }, duration + initialDelay);

        recorder.ondataavailable = evt => chunks.push(evt.data);
        recorder.onstop = () => {

            if (!recording_interrupted) {

                let blob = new Blob(chunks, {type: recorder.mimeType});
                const url = URL.createObjectURL(blob);

                //audio.src = URL.createObjectURL(blob);    // This is only to use the html audio player

                const anchor = document.createElement('a');
                //document.body.appendChild(anchor);
                let b = document.getElementsByTagName('body')[0];
                b.appendChild(anchor);
                anchor.style.display = 'none';
                anchor.href = url;
                anchor.download = 'FaceTune.webm';
                anchor.click();
                URL.revokeObjectURL(url);
            }
        };
    });
}

if (document.getElementById("write")) {
    document.getElementById("write").addEventListener("click", function () {

        if (!recording) {
            Tone.start().then(() => {
                console.log("write");
                t.stop();
                writeMusic(false);
                initializeMusic();
                t.start(t.now() + 0.6);
            });
        }
    });
}

if (document.getElementById("play")) {
    document.getElementById("play").addEventListener("click", function () {

        if (!recording) {
            Tone.start().then(() => {
                console.log("start");
                t.start();
            });
        }
    });
}

if (document.getElementById("pause")) {
    document.getElementById("pause").addEventListener("click", function () {

        if (!recording) {
            console.log("pause");
            t.pause();
        }
    });
}

if (document.getElementById("stop")) {
    document.getElementById("stop").addEventListener("click", function () {

        if (!recording) {
            console.log("stop");
            t.stop();
        }
    });
}

if (document.getElementById("download")) {
    document.getElementById("download").addEventListener("click", function () {

        if (!recording && !recording_interrupted) {
            console.log("download");
            recording = true;
            downloadMusic();
        } else {
            console.log("download interrupted");
            recording_interrupted = true;
            t.stop();
            recorder.stop()
            recording = false;
        }
    });
}

if (document.getElementById("play_community")) {
    document.getElementById("play_community").addEventListener("click", function () {

        if (!recording) {
            Tone.start().then(() => {
                console.log("write and play");
                t.stop();
                writeMusic(true);
                initializeMusic();
                t.start(t.now() + 0.6);
            });
        }
        console.log("banana");
    });
}
