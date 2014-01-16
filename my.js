(navigator.getUserMedia || navigator.mozGetUserMedia ||
 navigator.webkitGetUserMedia).call(navigator, { audio: true }, gum, err);

function gum (stream) {
  var context = new AudioContext;
  var source = context.createMediaStreamSource(stream);
  var rec = new Recorder(source, { workerPath: 'Recorderjs/recorderWorker.js' });
  rec.record();
  setTimeout(function () {
    rec.stop();
    var start = performance.now();
    rec.exportWAV(function (blob) {
      console.log(performance.now() - start);
      console.log(blob);
      rec.clear();
      var url = URL.createObjectURL(blob);
      var audio = new Audio;
      audio.src = url;
      audio.play();
      audio.onended = function () { URL.revokeObjectURL(url); };
    });
  }, 3000);
};
function err () { console.err(arguments); };

