/* vim: set expandtab ts=3 sw=3: */
/* jshint node: true, expr: true, es5: true */
/* globals describe: true, before: true, beforeEach: true, afterEach: true, it: true, Uint8Array: true, xit: true */
'use strict';

var chai = require('chai'),
    MidiDataTypes = require('../lib/data-types.js');

describe('Midi Data Types', function () {

    var expect = chai.expect;

    chai.should();

    describe('Midi', function() {
        var Midi = MidiDataTypes.Midi,
            midi = null;

        describe('error cases', function () {

            beforeEach(function () {
                midi = new Midi({});
            });

            it('should throw an error if you try to modify it\'s header property', function () {
                expect(function () {
                    midi.header = 'FAIL';
                }).to.throw(TypeError);
            });

            it('should throw an error if you try to modify it\'s tracks property', function () {
                expect(function () {
                    midi.tracks = 'FAIL';
                }).to.throw(TypeError);
            });
        });

        describe('valid cases', function () {
            
            beforeEach(function () {
                midi = new Midi({
                    header: 'HEADER',
                    tracks: ['TRACKS']
                });
            });

            it('should have an instance', function () {
                (midi instanceof Midi).should.be.true;
            });
        });
    });

    describe('MidiHeader', function() {
        var MidiHeader = MidiDataTypes.MidiHeader,
            header = null;

        describe('error cases', function () {

            beforeEach(function () {
               header = new MidiHeader({});
            });

            it('should throw an error', function () {
                expect(function () {
                    header.fail = 'yup';
                }).to.throw(TypeError);
            });
        });

        describe('valid cases', function () {

            beforeEach(function () {
               header = new MidiHeader({});
            });

            it('should have an instance', function () {
                (header instanceof MidiHeader).should.be.true;
            });
        });
    });

    describe('MidiTrack', function() {
        var MidiTrack = MidiDataTypes.MidiTrack,
            track = null;

        describe('error cases', function () {

            beforeEach(function () {
                track = new MidiTrack({});    
            });

            it('should throw an error', function () {
                expect(function () {
                    track.fail = 'yup';
                }).to.throw(TypeError);
            });
        });

        describe('valid cases', function () {

            beforeEach(function () {
                track = new MidiTrack({});    
            });

            it('should have an instance', function () {
                (track instanceof MidiTrack).should.be.true;
            });
        });
    });

    describe('MidiEvent', function() {
        var MidiEvent = MidiDataTypes.MidiEvent,
            event = null;

        describe('error cases', function () {

            beforeEach(function () {
                event = new MidiEvent({});    
            });

            it('should throw an error', function () {
                expect(function () {
                    event.fail = 'yup';
                }).to.throw(TypeError);
            });
        });

        describe('valid cases', function () {

            beforeEach(function () {
                event = new MidiEvent({});
            });

            it('should have an instance', function () {
                (event instanceof MidiEvent).should.be.true;
            });
        });
    });

    describe('MidiMetaEvent', function() {
        var MidiMetaEvent = MidiDataTypes.MidiMetaEvent,
            MidiEvent = MidiDataTypes.MidiEvent,
            metaEvent = null;

        describe('error cases', function () {

            beforeEach(function () {
                metaEvent = new MidiMetaEvent({});    
            });

            it('should throw an error', function () {
                expect(function () {
                    metaEvent.fail = 'yup';
                }).to.throw(TypeError);
            });
        });

        describe('valid cases', function () {

            beforeEach(function () {
                metaEvent = new MidiMetaEvent({});    
            });

            it('should have an instance', function () {
                (metaEvent instanceof MidiMetaEvent);
            });

            it('should be an instance of MidiEvent', function () {
                (metaEvent instanceof MidiEvent);
            });
        });
    });

    describe('MidiMetaTempoEvent', function() {
        var MidiMetaTempoEvent = MidiDataTypes.MidiMetaTempoEvent,
            MidiMetaEvent = MidiDataTypes.MidiMetaEvent,
            metaTempoEvent = null;

        describe('error cases', function () {

            describe('incomoplete parameters', function () {

                it('should throw an error if we do not pass in dataBytes', function () {
                    expect(function () {
                        new MidiMetaTempoEvent({});
                    }).to.throw(TypeError);
                });
            });

            describe('invalid data', function () {

                beforeEach(function () {
                    metaTempoEvent = new MidiMetaTempoEvent({
                        dataBytes: ['foo', 'bar']
                    });
                });

                it('should convert gibberish for dataBytes to "0" tempo', function () {
                    metaTempoEvent.tempo.should.equal(0);
                });
            });
        });

        describe('valid cases', function () {

            beforeEach(function () {
                metaTempoEvent = new MidiMetaTempoEvent({
                    code: 0xFF,
                    subtype: 0x51,
                    dataBytes: [0x01, 0x02, 0x03, 0x04]
                });
            });

            it('should have an instance', function () {
                (metaTempoEvent instanceof MidiMetaTempoEvent).should.be.true;
            });

            it('should be an instance of', function () {
                (metaTempoEvent instanceof MidiMetaEvent).should.be.true;
            });

            it('should have a tempo property calculated from "dataBytes"', function () {
                metaTempoEvent.tempo.should.equal(0x1020304);
            });
        });
    });

    describe('MidiMetaTimeSignatureEvent', function() {
        var MidiMetaTimeSignatureEvent = MidiDataTypes.MidiMetaTimeSignatureEvent,
            MidiMetaEvent = MidiDataTypes.MidiMetaEvent,
            metaTimeSignatureEvent = null;

        describe('error cases', function () {

            it('should throw an error if given no parameters', function () {
                expect(function () {
                    new MidiMetaTimeSignatureEvent();
                }).to.throw(TypeError);
            });

            it('should throw an error if you try to modify the "timeSignature"', function () {
                expect(function () {
                    metaTimeSignatureEvent = new MidiMetaTimeSignatureEvent({});
                    metaTimeSignatureEvent.timeSignature = 'fail';
                }).to.throw(TypeError);
            });
        });

        describe('valid cases', function () {

            beforeEach(function () {
                metaTimeSignatureEvent = new MidiMetaTimeSignatureEvent({
                    dataBytes: [0x01, 0x02, 0x03, 0x04]
                });
            });

            it('should have an instance', function () {
                (metaTimeSignatureEvent instanceof MidiMetaTimeSignatureEvent).should.be.true;
            });

            it('should be an instance of MidiMetaEvent', function () {
                (metaTimeSignatureEvent instanceof MidiMetaEvent).should.be.true;
            });

            it('should have a time signature property', function () {
                metaTimeSignatureEvent.timeSignature.should.be.defined; 
            });
        });
    });
});
