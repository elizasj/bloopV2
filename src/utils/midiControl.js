import WebMidi from 'webmidi';

export default function webMidiControl(callback) {
  WebMidi.enable(function(err) {
    if (err) {
      console.log('WebMidi could not be enabled.', err);
    } else {
      console.log('WebMidi enabled!');
    }

    console.log(WebMidi.inputs);
    //  console.log(WebMidi.outputs);

    var inputLaunchControl = WebMidi.getInputById('195363929');
    inputLaunchControl = WebMidi.getInputByName('Launch Control');
    inputLaunchControl = WebMidi.inputs[0];

    if (inputLaunchControl.type == 'controlchange') {
      console.log('hi');
    }
    var inputLaunchMini = WebMidi.getInputByName('Launchpad Mini');

    inputLaunchControl.addListener('noteon', 'all', function(e) {
      // console.log(
      //   "Received 'noteon' message (" + e.note.name + e.note.octave + ').'
      // );
    });

    // Listen to control change message on all channels
    inputLaunchControl.addListener('controlchange', 'all', function(e) {
      // console.log("Received 'controlchange' message.", e);
      // console.log('control number (' + e.controller.number + ')');
      // console.log('control value (' + e.value + ')');
      callback(e.controller, e.value);
    });

    return inputLaunchControl;
  });
}
