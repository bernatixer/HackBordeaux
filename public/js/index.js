
var socket = io.connect('http://localhost:3000');
var sourceImageUrl = '';

var jsonaaa;

$(function(){
    var video = $('video')[0];
    var canvas = $('canvas')[0];

    var getCameraAccess = function(){
      
      // Normalize the various vendor prefixed versions of getUserMedia.
  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || 
                            navigator.msGetUserMedia);


  
  // Check that the browser supports getUserMedia.
  // If it doesn't show an alert, otherwise continue.
  if (navigator.getUserMedia) {
    // Request the camera.
    navigator.getUserMedia(
      // Constraints
      {
        video: true
      },
  
      // Success Callback
      function(localMediaStream) {
        // Get a reference to the video element on the page.
        var vid = document.getElementById('video');
        
        // Create an object URL for the video stream and use this 
        // to set the video source.
        vid.src = window.URL.createObjectURL(localMediaStream);
      },
  
      // Error Callback
      function(err) {
        // Log the error to the console.
        console.log('The following error occurred when trying to use getUserMedia: ' + err);
      }
    );
  
  } else {
    alert('Sorry, your browser does not support getUserMedia');
  }
    };

    var takeSnapshot = function(){
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        canvas.getContext('2d').drawImage(video, 0, 0);
    };
  
    socket.on('detect', function (data) {
      sourceImageUrl = data.url;
      processImage();
    });

     // when the start button is clicked, take a snapshot
    $('#snapshot').on('click', function(){
        takeSnapshot();
        socket.emit('image', { src: document.getElementById('canvas').toDataURL() });
    });

    window.onload = function() {
      getCameraAccess();
    };

    function processImage() {
      // **********************************************
      // *** Update or verify the following values. ***
      // **********************************************

      // Replace the subscriptionKey string value with your valid subscription key.
      var subscriptionKey = "4865490905414c64a184a4b431d7edc6";

      // Replace or verify the region.
      //
      // You must use the same region in your REST API call as you used to obtain your subscription keys.
      // For example, if you obtained your subscription keys from the westus region, replace
      // "westcentralus" in the URI below with "westus".
      //
      // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
      // a free trial subscription key, you should not need to change this region.
      var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

      // Request parameters.
      var params = {
          "returnFaceId": "true",
          "returnFaceLandmarks": "false",
          "returnFaceAttributes": "emotion",
      };

      // document.querySelector("#sourceImage").src = sourceImageUrl;
      // Perform the REST API call.
      $.ajax({
          url: uriBase + "?" + $.param(params),

          // Request headers.
          beforeSend: function(xhrObj){
              xhrObj.setRequestHeader("Content-Type","application/json");
              xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
          },

          type: "POST",

          // Request body.
          data: '{"url": ' + '"' + sourceImageUrl + '"}',
      })

      .done(function(data) {
          // Show formatted JSON on webpage.
          // var json = JSON.stringify(data, null, 2);
          jsonaaa = data;
          var sad_face = "<img src='../imgs/sad_face.png'></img>";
          var happy_face =  "<img src='../imgs/not_sad.png'></img>";
          $('.img').empty();
          $(".img").append(data[0].faceAttributes.emotion.sadness > 0.5 ? sad_face:happy_face);
      })

      .fail(function(jqXHR, textStatus, errorThrown) {
          // Display error message.
          var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
          errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
              jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
          alert(errorString);
      });
   };
});