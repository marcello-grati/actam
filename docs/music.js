const Tone = require('tone');
const Tonal = require('tonal');
const seedrandom = require('seedrandom');

// Global variables

let recording = false;                  // true when user is downloading the song
let recording_interrupted = false;      // true when download has been interrupted and until return to initial stage
const CHORD_NOTES = 3;                  // chords are triads
let song_duration;                      // song duration in seconds
let sheet;                              // data object in which all music information are stored
let intervalID;                         // ID of song position update
let song_position = 0;                  // playing head in song

// Piano sampler
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

// Transport object that controls audio timing
const t = Tone.Transport;

// Audio nodes routing : (piano_chord_sampler, piano_melody_sampler) -> (pan) -> (destination, recording_node)

const pan = new Tone.Panner().toDestination();
const piano_chord_sampler = new Tone.Sampler(piano_options).connect(pan);
const piano_melody_sampler = new Tone.Sampler(piano_options).connect(pan);

const recording_node  = Tone.context.createMediaStreamDestination();
pan.connect(recording_node);
const recorder = new MediaRecorder(recording_node.stream, { mimeType: "audio/webm" });

/*
    Creates an inverted chord

    @param chord : original chord
    @param inv_num : inversion number (es.  1 -> C/E : [E, G, C],
                                            2 -> C/G : [G, C, E])
    @return inverted chord
 */
function invert(chord, inv_num) {
    return Tonal.Chord.getChord(chord.type, chord.tonic, chord.notes[inv_num]);
}

/*
    Chooses between a set of proposed chords

    @param chords : chord options
    @param input : input generated from avatarFeat
    @param index : current position in input
    @return : chosen chord
 */
function choose_btw_set(choices, input, index) {
    index = index % input.length;
    let choice = input[index] % choices.length;
    return choices[choice] - 1
}

/*
    Converts avatar characteristics into an array of integers

    @param avatar_options : reads from avatar editor or community
    @return input array
 */
function features2int(avatar_options) {
    let input = [];
    input.push(options.haircolor.indexOf(avatar_options[0]));
    input.push(options.haircut.indexOf(avatar_options[1]));
    input.push(options.eyes.indexOf(avatar_options[2]));
    input.push(options.skin.indexOf(avatar_options[3]));
    input.push(options.nose.indexOf(avatar_options[4]));
    input.push(options.mouth.indexOf(avatar_options[5]));

    return input;
}

/*
    Converts input integers into numbers between 0 and 6 to be used as chord choices

    @param input : avatar input
    @return input choices in chord format
 */
function convertInput(input) {
    let chordInput = [];
    for (let i=0; i<6; i++) {    // for (let i=0; i<input.length; i++) {
        if (i%3 === 0) chordInput[i] = input[i] % 7
        else chordInput[i] = (input[i] + input[i - i%3]) % 7;
    }
    return chordInput;
}

/*
    Maps input integer (from 0 to 6) to interval choice (from -2 to +2)

    @param input : avatar input
    @return chosen interval
 */
function input2intervals(input) {

    switch (input) {
        case 0: return -2;
        case 1: return -1;
        case 2: return -1;
        case 3: return 0;
        case 4: return 1;
        case 5: return 1;
        case 6: return 2;
        default: return null;
    }
}

/*
    Finds the new melody note, with respect to previous note and key, and adapting its octave

    @param input : current avatar input
    @param old_note : previous note
    @param key : song key
    @return : chosen note
 */
function nextDissonantNote(input, old_note, key) {

    let interval = input2intervals(input);      // (-2, ..., +2 )
    let old_note_index = key.scale.indexOf(Tonal.Note.pitchClass(old_note));    // with respect to key (0, ..., 6)
    let next_note_index = old_note_index + interval;    // with respect to key (0, ..., 6)
    let next_note;
    next_note_index = (next_note_index + 7) % 7;
    next_note = key.scale[next_note_index] + Tonal.Note.octave(old_note);

    // with respect to chromatic scale (0, ..., 11)
    let next_note_chroma_index = Tonal.Note.chroma(key.scale[next_note_index]);
    if (next_note_chroma_index === -1)
        next_note_chroma_index = Tonal.Note.chroma(Tonal.Note.enharmonic(key.scale[next_note_index]));

    // with respect to chromatic scale (0, ..., 11)
    let old_note_chroma_index = Tonal.Note.chroma(key.scale[old_note_index]);
    if (old_note_chroma_index === -1)
        old_note_chroma_index = Tonal.Note.chroma(Tonal.Note.enharmonic(key.scale[old_note_index]));

    // transposes current note to correct octave
    if ((next_note_chroma_index > old_note_chroma_index) && (interval < 0)) {
        next_note = Tonal.Note.transpose(next_note, "-8P");

    } else if ((next_note_chroma_index < old_note_chroma_index) && (interval > 0)) {
        next_note = Tonal.Note.transpose(next_note, "+8P");
    }
    return next_note;
}

/*
    Finds the new melody note between the ones from the current chord

    @param input : current avatar input
    @param old_note : previous note
    @param key : song key
    @param chord : current chord (acceptable notes)
    @return : chosen note
 */
function nextConsonantNote(input, old_note, key, chord) {

    let next_note = null;
    let counter=0;
    let temp_note = null;

    // compute note and checks if it belongs to chord
    while (chord.indexOf(temp_note)===-1 && counter<10) {
        next_note = nextDissonantNote(input, old_note, key);
        input = (input + 1) % 7;
        temp_note = Tonal.Note.pitchClass(next_note) + "3";
        counter++;
    }
    if (counter>=10) console.log("error - " + next_note + " - " + chord);
    return next_note;
}

/*
    update song_duration global variable with current song duration
 */
function updateSongDuration() {
    song_duration = (sheet.measures + 1) * 4 * 60 / sheet.bpm;
}

/*
    Writes music starting from avatar characteristics

    @param avatar_options : avatar characteristics from editor or community
    @return sheet object of whole song
 */
function writeMusic (avatar_options) {

    // CONVERSION FROM AVATAR CHARACTERISTICS TO MUSIC PARAMETERS

    let input = features2int(avatar_options);
    let chord_input = convertInput(input);
    let seed_string = "";
    for (let i=0; i<input.length; i++) {
        seed_string = seed_string + input[i];
    }
    let rng = seedrandom(seed_string);

    // Test
    // console.log("avatar options: ", avatar_options);

    const KEY_INDEX = 0;        // hair color -> key
    const MEASURES_INDEX = 2;   // eyes -> measures
    const BPM_INDEX = 3;        // skin -> bpm

    // Total number of measures choice
    const measures = input[MEASURES_INDEX] + 4;

    // Song key choice
    const chromatic_scale = Tonal.Range.chromatic(["C4", "B4"], {sharps : false, pitchClass : true});
    const key = new Tonal.Key.majorKey(chromatic_scale[input[KEY_INDEX]]);

    // Allowed chords for this key
    let chords_scale_obj = [];
    key.chords.forEach((value, index) => {chords_scale_obj[index] = Tonal.Chord.get(value)});

    // BPM choice
    const bpm = input[BPM_INDEX] * 2 + 100;
    t.bpm.value = bpm;

    // Test
    // console.log(key);
    console.log("key = ", key.tonic);
    console.log("BPM = " + bpm);
    console.log("measures = " + measures);
    // console.log(key.chords);

    //---------------------------------------------------------------------------------------

    // CHORDS PROGRESSION

    let progression = [];

    for (let i=0; i<measures; i++)      // one chord per measure
    {
        // first chord
        if (i===0)
            progression[i] = chords_scale_obj[choose_btw_set([1, 6], chord_input, i)];

        // second-to-last chord
        else if (i === measures-2)
            progression[i] = chords_scale_obj[choose_btw_set([2, 4], chord_input, i)];

        // last chord
        else if (i === measures-1)
            progression[i] = chords_scale_obj[5 - 1];

        else {

            if (progression[i-1].tonic === key.scale[1 - 1]) {
                progression[i] = chords_scale_obj[choose_btw_set([2, 3, 4, 5, 6], chord_input, i)];

                if (progression[i].tonic === key.scale[5 - 1])
                    progression[i] = invert(progression[i], 1);
            }
            else if (progression[i-1].tonic === key.scale[2 - 1])
                progression[i] = chords_scale_obj[choose_btw_set([1, 5, 6, 7], chord_input, i)];

            else if (progression[i-1].tonic === key.scale[3 - 1])
                progression[i] = chords_scale_obj[4 - 1];

            else if (progression[i-1].tonic === key.scale[4 - 1])
                progression[i] = chords_scale_obj[choose_btw_set([2, 5, 6, 7], chord_input, i)];

            else if (progression[i-1].tonic === key.scale[5 - 1])
                progression[i] = chords_scale_obj[choose_btw_set([1, 6, 7], chord_input, i)];

            else if (progression[i-1].tonic === key.scale[6 - 1])
                progression[i] = chords_scale_obj[choose_btw_set([2, 3, 4, 5], chord_input, i)];

            else if (progression[i-1].tonic === key.scale[7 - 1])
                progression[i] = chords_scale_obj[1 - 1];
        }
        if (progression[i].tonic === key.scale[2 - 1] || progression[i].tonic === key.scale[7 - 1])
            progression[i] = invert(progression[i], 1);
    }
    // Test
    console.log(progression);

    let simple_progression = [];

    for (let i=0; i<measures; i++) {
        simple_progression.push(new Array(CHORD_NOTES));
        for (let j=0; j<CHORD_NOTES; j++) {
            simple_progression[i][j] = progression[i].notes[j] + "3";
        }
    }
    // Test
    //console.log(simple_progression);


    //---------------------------------------------------------------------------------------

    // MELODY

    let melody = [];        // List of all melody notes
    let old_note = null;    // previous computed note

    for (let i=0; i<measures; i++) {

        let tempo_left = 16;    // total amount of 1/16s in a measure
        let counter = 0;        // number of notes added in the current measure
        let duration;           // note duration in 1/16s
        let note;               // current note
        let time                // note position in time

        // iterates until measure is full
        while (tempo_left > 0) {

            // measure first note must be consonant and must last from 3 to 4 1/16s
            if (counter === 0) {
                duration = Math.floor(rng() * 2) + 3;
                note = simple_progression[i][Math.floor(rng() * CHORD_NOTES)];

            } else {

                // Random duration from 1 to 4 1/16s (not uniform)
                duration = Math.ceil(Math.floor(rng() * 7) / 2) + 1;

                // long notes must be consonant
                if (duration > 2) {
                    note = nextConsonantNote(Math.floor(rng() * 7), old_note, key, simple_progression[i]);

                // might be dissonant
                } else {
                    note = nextDissonantNote(Math.floor(rng() * 7), old_note, key);
                }
            }
            // decrease duration if it exceeds the measure
            while (tempo_left - duration < 0) duration -= 1

            time = (i * 16 + (16 - tempo_left)) * t.toSeconds("16n");
            tempo_left -= duration;
            counter++;
            old_note = note;

            // add note element to melody
            melody.push(
                {
                    time : time,
                    noteName : note = Tonal.Note.transpose(note, "+8P"),
                    velocity : 0.7,
                    duration : duration * t.toSeconds("16n")    // in seconds
                }
            )
        }
    }
    // Test
    console.log("melody :");
    console.log(melody);

    //-----------------------------------------------------------------------

    // SAVE

    // Sheet containing all song information
    sheet =  {
        bpm: bpm,
        measures: measures,
        key: key,
        progression: simple_progression,
        melody : melody
    }
    updateSongDuration()
}

/*
    Converts sheet into music by creating a Tonal.Part object both for melody and chord, passing the sheet to them,
    and making them loop-able
 */
function initializeMusic() {

    t.cancel(); // deletes transport of previous written song

    // Converting chord progression from 2D to 1D
    let array_of_chords_notes = [];

    for (let i=0; i<sheet.measures; i++) {
        for (let j=0; j<CHORD_NOTES; j++) {
            array_of_chords_notes.push(
                {
                    time : i * t.toSeconds("1m"),
                    noteName : Tonal.Note.simplify(sheet.progression[i][j]),
                    duration : "1m",
                    velocity : 0.5
                }
            )
        }
    }

    // Melody writing

    // schedules sampler action in time, reading from 'melody'
    let melody = sheet.melody;
    let melodyPart = new Tone.Part(
        ((time, melody) => {
            piano_melody_sampler.triggerAttackRelease(
                melody.noteName,
                melody.duration,
                time,
                melody.velocity
            );
        }),
        melody).start(0);

    melodyPart.loop = true;     // makes it loop-able
    melodyPart.loopEnd = (sheet.measures) * t.toSeconds("1m");  // duration of loop in seconds

    // Chords writing

    // schedules sampler action in time, reading from 'array_of_chords_notes'
    let chordsPart = new Tone.Part(
        ((time, part_array) => {
            piano_chord_sampler.triggerAttackRelease(
                part_array.noteName,
                part_array.duration,
                time,
                part_array.velocity);
        }),
        array_of_chords_notes).start(0);

    chordsPart.loop = true;     // makes it loop-able
    chordsPart.loopEnd = (sheet.measures) * t.toSeconds("1m");  // duration of loop in seconds

}

/*
    Records current playing music and makes it downloadable from browser as a .webm file
 */
function downloadMusic() {

    // Waits for Tone to be started
    Tone.start().then(() => {

        // Test
        console.log("download audio file");

        const chunks = [];      // where pieces of recording are saved
        let initialDelay = 1000;    // in milliseconds
        let duration = ((sheet.measures * 4 + 1) * 60 / sheet.bpm) * 1000;  // in milliseconds
        let fadeOut = 2000;     // in milliseconds

        t.stop(); // stops music playing previously

        // Waits 'initialDelay' ms before starting the recording and playing the song
        setTimeout(function() {
            recorder.start();
            t.start();
        }, initialDelay);

        /*
            Schedules the end of recording after 'duration + initialDelay' ms.
            if it has been interrupted doesn't do anything, otherwise it stops music
            and schedules the end of recording after 'fadeOut' ms.
        */
        setTimeout(function(){
            if (!recording_interrupted) {
                t.stop();
                setTimeout(()=>{ recorder.stop() }, fadeOut);
                recording = false;
            } else {
                recording_interrupted = false;
            }
        }, duration + initialDelay);

        // push recorded data into chunks
        recorder.ondataavailable = evt => chunks.push(evt.data);

        // recorder actions when stopped (only if not interrupted)
        recorder.onstop = () => {

            if (!recording_interrupted) {

                // Creates blob from data chunks
                let blob = new Blob(chunks, {type: recorder.mimeType});

                // Open download window
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement('a');
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

/*
    Write button action: stops currently playing music, writes and initializes a new song
    reading current avatar parameters, and starts the song
 */
if (document.getElementById("write")) {
    document.getElementById("write").addEventListener("click", function () {

        if (!recording) {
            Tone.start().then(() => {
                console.log("write");
                t.stop();
                writeMusic(avatarFeat);
                initializeMusic();
                t.start(t.now() + 0.6);
            });
        }
    });
}

/*
    Play button action: starts playing the song
 */
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

/*
    Wrapper for scheduling a song position update every 0.1 seconds
 */
function repeatEverySecond() {
    intervalID = setInterval(getSongPosition, 100);
}

/*
    Updates progress bar when downloading a song, using as reference the current playing head of the song
 */
function getSongPosition() {

    // Test
    //console.log(song_position + " s  - " + Math.round(song_position * 100 / song_duration) + "%");

    song_position+=0.1;     // slight advance to make it smoother

    let myBar = document.getElementById("myBar");


    if (song_position > song_duration) {

        // Download finished
        clearInterval(intervalID);
        song_position = 0;

        // return to 'download' button
        myBar.style.width = 100 + "%";
        myBar.hidden = true;
        document.getElementById("myProgress").hidden = true;
        document.getElementById("download").hidden = false;

    } else {
        // Update bar position
        myBar.style.width = Math.round(song_position * 100 / song_duration) + "%";
    }
}

/*
    Pause button action: pauses the song keeping the time position
 */
if (document.getElementById("pause")) {
    document.getElementById("pause").addEventListener("click", function () {

        if (!recording) {
            console.log("pause");
            t.pause();
        }
    });
}

/*
    Stop button action: stops the song bringing it back to the beginning
 */
if (document.getElementById("stop")) {
    document.getElementById("stop").addEventListener("click", function () {

        if (!recording) {
            console.log("stop");
            t.stop();
        }
    });
}

/*
    Done button action: Ends avatar editor, stops playing music, writes and initializes the current song and plays it
 */
if (document.getElementById("done")) {
    document.getElementById("done").addEventListener("click", function () {

        if (!recording) {
            Tone.start().then(() => {
                console.log("write");
                t.stop();
                writeMusic(avatarFeat);
                initializeMusic();
                t.start(t.now() + 0.6);
            });
        }
    });
}

/*
    Download button action: starts download if recording is not already in action
 */
if (document.getElementById("download")) {
    document.getElementById("download").addEventListener("click", function () {

        if (!recording && !recording_interrupted) {

            // Starts download
            console.log("download");
            recording = true;
            downloadMusic();
            console.log("song duration : " + song_duration + " s");

            // update and show progress bar instead of button
            repeatEverySecond();
            document.getElementById("myBar").hidden = false;
            document.getElementById("myProgress").hidden = false;
            document.getElementById("download").hidden = true;


        } else {

            // Handles download interruption
            console.log("download interrupted");
            recording_interrupted = true;
            t.stop();
            recorder.stop()
            recording = false;

            // Bring back download button
            clearInterval(intervalID);
            song_position = 0;
            document.getElementById("myBar").hidden = true;
            document.getElementById("myProgress").hidden = true;
            document.getElementById("download").hidden = false;
        }
    });
}

/*
    Alternative Play button for community, it writes and initializes music too
 */
if (document.getElementById("play_community")) {
    document.getElementById("play_community").addEventListener("click", function () {

        if (!recording) {
            Tone.start().then(() => {
                console.log("write and play");
                t.stop();
                writeMusic(avatargen);
                initializeMusic();
                t.start(t.now() + 0.6);
            });
        }
    });
}

/*
    Stops music when applying new filter in the community
 */
if (document.getElementById('filters-menu')) {
    document.getElementById('filters-menu').addEventListener("change", function () {
        if (!recording) {
            console.log("stop");
            t.stop();
        }
    });
}
