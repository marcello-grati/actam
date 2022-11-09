from midiutil.MidiFile import MIDIFile
import string
import random

randomStringSize = 100000   # lunghezza in caratteri dell'input casuale
channel = 0                 # no idea
volume = 50                 # velocity di ogni nota
C4pitch = 60                # nota di riferimento
measures = 4                # durata in battute del brano generato
octave = 12                 # intervallo di un ottava

# intervalli dei vari gradi rispetto alla fondamentale (scala maggiore)
maj_scale = [0, 2, 4, 5, 7, 9, 11]

# Nomi dei vari accordi/note
note_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

# giri di accordi belli
progressions = [[1, 4, 6, 5],[1, 2, 4, 5],[1, 5, 4, 5],[1, 5, 6, 4],[5, 1, 3, 2],[6, 4, 1, 5]]

#triad = [-1,-1,-1]      # forse lo tolgo

# riceve in input il grado (int da 1 a 7) e restituisce un array con le frequenze midi
# della triade che forma l'accordo (rispetto a C4pitch)
def findChord(chord) :
    triad = [-1,-1,-1]
    for i in range(3) :
        triad[i] = (maj_scale[(chord - 1 + 2*i) % 7] + key)
    return triad

# riceve in input il grado (int da 1 a 7) e restituisce la stringa da stampare
# con il nome dell'accordo e le note che lo formano
def printChord(chord):
    triad = findChord(chord)
    chordName = note_names[triad[0]%12]
    if chord==2 or chord==3 or chord==6 : 
        chordName = chordName + "m"
    chordName = chordName + "\t(" + note_names[triad[0]%12] + " | " + note_names[triad[1]%12] + " | " + note_names[triad[2]%12] + ")"
    return chordName

# ritarda la posizione temporale della nota di un valore random da 0 a 0.01
# per rendere più "realistico" il suono
def dequantize(time):
    return time + random.uniform(0, 0.01)

# INPUT PARSING
#   0       : key
#   1       : bpm
#   2       : chord progression
#   3       : first note index (#1 melody)
#   ...     : ...
#   67      : first rythm index (#1 melody)
#   ...     : ...
#   131     : first note index (#2 melody)
#   ...     : ...
#   195     : first rythm index (#2 melody)

input =  ''.join(random.choices(string.ascii_letters, k=randomStringSize))

key_index = 0
bpm_index = 1
chord_index = 2
first_note_index = chord_index + 1
first_rythm_index = first_note_index + measures*16
first_note_index2 = first_rythm_index + measures*16
first_rythm_index2 = first_note_index2 + measures*16
    
# create your MIDI object

tracks_num = 4              # numero di tracce nel file midi
mf = MIDIFile(tracks_num)   # genera il file    
chord_track = 0             # traccia con gli accordi
melody1_track = 1           # traccia con la 1° melodia
melody2_track = 2           # traccia con la 2° melodia
bass_track = 3              # traccia con il basso

# tonalità del brano (int da 0 a 11)
key = ord(input[key_index]) % 12    
print("key = " + note_names[key])

# Project Tempo

# numero dei bpm del brano (da 80 a 129)
BPM  = ord(input[key_index]) % 50 + 80  
print("BPM = ", BPM)

time = 0    # start at the beginning
mf.addTrackName(chord_track, time, "Chord Track")
mf.addTrackName(melody1_track, time, "melody1 Track")
mf.addTrackName(melody2_track, time, "melody2 Track")
mf.addTrackName(bass_track, time, "Bass Track")

mf.addTempo(chord_track, time, BPM)
mf.addTempo(melody1_track, time, BPM)
mf.addTempo(melody2_track, time, BPM)
mf.addTempo(bass_track, time, BPM)

# giro di accordi scelto (array con i 4 gradi - int da 1 a 7)
chord_progression = progressions[ord(input[chord_index]) % 6]
print(chord_progression)

# loop sulle 4 battute
for i in range(measures):

    # per scegliere gli accordi casualmente:
    # chord = ord(input[i + first_chord_index]) % 7 + 1

    # i-esimo accordo del giro (int da 1 a 7)
    chord = chord_progression[i]

    # triade (valori in frequenza relativa a C4pitch)
    triad = findChord(chord)

    # stampa l'accordo
    chordName = printChord(chord) 
    print(chordName) # add: [, end = "  "]

    # Chords

    for j in range(3):

        # definisce i parametri midi per ogni nota dell'accordo
        pitch = C4pitch + triad[j]      # C4pitch + freq (da 0 a 11) + key (da 0 a 11)
        time = i * 4                    # uno ogni battuta
        time = dequantize(time)         
        duration = 4                    # 4 quarti
        mf.addNote(chord_track, channel, pitch, time, duration, volume)

    # Bass 

    for j in range(4):
        
        # definisce i parametri midi per la nota del basso
        pitch = C4pitch + triad[0] - 2*octave       # C4pitch + freq (da 0 a 11) + key (da 0 a 11) - 2 ottave (-24)
        time = i * 4 + j                            # uno ogni quarto
        time = dequantize(time)            
        duration = 1                                # 1 quarto
        mf.addNote(bass_track, channel, pitch, time, duration, volume)
    
    # first melody

    tempo_left = 16     # quantità in 16esimi rimasta per ripempire la battuta
    counter = 0         # n° di cicli while eseguiti (per scorrere l'input)

    while tempo_left > 0:
        
        # durata della nota in 16esimi (da 1 a 4)
        duration = ord(input[first_rythm_index + i*4 + counter]) % 4 + 1

        # indice della nota all'interno della triade (da 0 a 2) 
        raw_note = ord(input[first_note_index + i*4 + counter]) % 3

        chord_note = triad[raw_note]    # nota in frequenza relativa a C4pitch

        # verifica che l'ultima nota non sfori la lunghezza della battuta
        while tempo_left - duration < 0 :
            duration -= 1

        # Al tempo di inizio battuta aggiunge 16 16esimi - i 16esimi rimanenti 
        # riscalati in quarti
        time = i * 4 + (16 - tempo_left)/4
        time = dequantize(time)
        pitch = C4pitch + chord_note           
        mf.addNote(melody1_track, channel, pitch, time, duration/4, volume) # duration riscalata in quarti
        tempo_left -= duration
        counter += 1

    # second melody

    tempo_left = 16
    counter = 0

    while tempo_left > 0:
    
        duration = ord(input[first_rythm_index2 + i*4 + counter]) % 4 + 1
        raw_note = ord(input[first_note_index2 + i*4 + counter]) % 3
        chord_note = triad[raw_note]
        while tempo_left - duration < 0 :
            duration -= 1
        pitch = C4pitch + chord_note
        time = i * 4 + (16 - tempo_left)/4
        time = dequantize(time) 
        mf.addNote(melody2_track, channel, pitch, time, duration/4, volume)
        tempo_left -= duration
        counter += 1

# write it to disk
with open("output.mid", 'wb') as outf:
   mf.writeFile(outf)