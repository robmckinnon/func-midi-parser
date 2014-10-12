/* vim: set expandtab ts=3 sw=3: */
/* jshint node: true */
'use strict';

var midiUtils = require('./midi-utils.js'),
    parseByteArrayToNumber = midiUtils.parseByteArrayToNumber;

function subclass(BaseClass, SubClass) {
   if (BaseClass) {
      SubClass.prototype = Object.create(BaseClass.prototype);
   } else {
      SubClass.prototype = Object.create(null);
   }

   SubClass.prototype.constructor = SubClass;
}

function Midi(header, tracks) {
   this.header = header || new MidiTrack({});
   this.tracks = tracks || [];

   if (Object.freeze) {
      Object.freeze(this);
      Object.freeze(this.tracks);
   }
}

subclass(null, Midi);

function MidiHeader(params) {
   this.format = params.format;
   this.trackCount = params.trackCount;
   this.timeDivision = params.timeDivision;
   this.isTicksPerBeat = Boolean(0x8000 & this.timeDivision);
   this.isFramesPerSecond = !this.isTicksPerBeat;
   
   if (Object.freeze) Object.freeze(this);
}

subclass(null, MidiHeader);

function MidiTrack(events) {
   this.events = events;
   
   if (Object.freeze) Object.freeze(this);
}

subclass(null, MidiTrack);

function MidiEvent(params) {
   this.code = params.code;
   this.type = params.type;
   this.delta = params.delta;
   this.data = params.data; // TODO: this is a reference and a catch-all (should go away once we flesh out the model)

   if (Object.freeze) Object.freeze(this);
}

subclass(null, MidiEvent);

function MidiMetaEvent(params) {
   this.subtype = params.subtype || 'unknown';

   MidiEvent.call(this, params);
}

subclass(MidiEvent, MidiMetaEvent);

function MidiMetaTempoEvent(params) {
   this.tempo = parseByteArrayToNumber(params.dataBytes);

   params.subtype = 'tempo';

   MidiMetaEvent.call(this, params);
}

MidiMetaTempoEvent.prototype = Object.create(MidiMetaEvent.prototype);

function MidiMetaTimeSignatureEvent(params) {
   this.timeSignature = {
      numerator: params.dataBytes[0],
      denominator: Math.pow(2, params.dataBytes[1]),
      metronomeClicksPerTick: params.dataBytes[2],
      thirtySecondNotesPerBeat: params.dataBytes[3]
   };

   if (Object.freeze) Object.freeze(this.timeSignature);

   params.subtype = 'time_signature';

   MidiMetaEvent.call(this, params);
}

MidiMetaTimeSignatureEvent.prototype = Object.create(MidiMetaEvent.prototype);

function MidiMetaInstrumentNameEvent(params) {
   this.instrumentName = params.dataBytes.map(function (charCode) { return String.fromCharCode(charCode); }).join('');

   params.subtype = 'instrument_name';

   MidiMetaEvent.call(this, params);
}

MidiMetaInstrumentNameEvent.prototype = Object.create(MidiMetaEvent.prototype);

function MidiMetaEndOfTrackEvent(params) {
   params.subtype = 'end';

   MidiMetaEvent.call(this, params);
}

MidiMetaEndOfTrackEvent.prototype = Object.create(MidiMetaEvent.prototype);

function MidiSystemEvent(params) {
   params.type = 'system';

   MidiEvent.call(this, params);
}

MidiSystemEvent.prototype = Object.create(MidiEvent.prototype);

function MidiNoteEvent(params) {
   params.type = 'note';

   this.note = params.note;
   this.velocity = params.velocity;
   
   MidiEvent.call(this, params);
}

MidiNoteEvent.prototype = Object.create(MidiEvent.prototype);

function MidiNoteOnEvent(params) {
   params.subtype = 'on';

   MidiNoteEvent.call(this, params);
}

MidiNoteOnEvent.prototype = Object.create(MidiNoteEvent.prototype);

function MidiNoteOffEvent(params) {
   params.subtype = 'off';

   MidiNoteEvent.call(this, params);
}

MidiNoteOffEvent.prototype = Object.create(MidiNoteEvent.prototype);

module.exports = {
    Midi: Midi,
    MidiHeader: MidiHeader,
    MidiTrack: MidiTrack,
    MidiEvent: MidiEvent,
    MidiMetaEvent: MidiMetaEvent,
    MidiMetaTempoEvent: MidiMetaTempoEvent,
    MidiMetaTimeSignatureEvent: MidiMetaTimeSignatureEvent,
    MidiMetaInstrumentNameEvent: MidiMetaInstrumentNameEvent,
    MidiMetaEndOfTrackEvent: MidiMetaEndOfTrackEvent,
    MidiNoteEvent: MidiNoteEvent,
    MidiNoteOnEvent: MidiNoteOnEvent,
    MidiNoteOffEvent: MidiNoteOffEvent
};