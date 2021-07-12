import React,{Component,useEffect} from "react";
import ReactDOM from "react-dom";
import './objectdetection.css'
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
// 1. TODO - Import required model here
class ObjectDetection extends Component{

    model = true

    runCoco = async (event) => {
      let self = this
      // 3. TODO - Load network 
      // e.g. const net = await cocossd.load();
      const net = await cocoSsd.load();
      //  Loop and detect hands
      setInterval(() => {
        self.predictWebcam(net);
      }, 100);
    };
    
    constructor(props) {
        super(props)
    }

    

    componentDidMount() {

        
        let self = this
        this.video = document.getElementById('webcam');
        this.liveView = document.getElementById('liveView');
        this.demosSection = document.getElementById('demos');
        this.enableWebcamButton = document.getElementById('webcamButton');
        this.children = []
    }

    loadScript(src) {
        let self = this
        return new Promise(function(resolve, reject){
          var script = document.createElement('script');
          script.async = true;
          script.src = src;
          script.addEventListener('load', function () {
            resolve();
          });
          script.addEventListener('error', function (e) {
            reject(e);
          });
          self.od_class.appendChild(script);
        })
      }

    getUserMediaSupported()  {
        return !!(navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia);
      }
      
      
    enableCam(event) {

        let self = this

        if(!this.getUserMediaSupported()) {
            console.log("webcam is not Supported")
            return 0;
        }
        

        // Only continue if the COCO-SSD has finished loading.
        
        // Hide the button once clicked.
        event.target.classList.add('removed');  
        
        // getUsermedia parameters to force video but not audio.
        const constraints = {
          video: true
        };
      
        // Activate the webcam stream.
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
          self.video.srcObject = stream;
        });

      }
    
    predictWebcam(net) {
        let self = this
        // Now let's start classifying a frame in the stream.
        net.detect(self.video).then(function (predictions) {
          // Remove any highlighting we did previous frame.
          for (let i = 0; i < self.children.length; i++) {
            self.liveView.removeChild(self.children[i]);
          }
          self.children.splice(0);
          
          // Now lets loop through predictions and draw them to the live view if
          // they have a high confidence score.
          for (let n = 0; n < predictions.length; n++) {
            // If we are over 66% sure we are sure we classified it right, draw it!
            if (predictions[n].score > 0.66) {
              const p = document.createElement('p');
              p.innerText = predictions[n].class  + ' - with ' 
                  + Math.round(parseFloat(predictions[n].score) * 100) 
                  + '% confidence.';
              p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
                  + (predictions[n].bbox[1] - 10) + 'px; width: ' 
                  + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

              const highlighter = document.createElement('div');
              highlighter.setAttribute('class', 'highlighter');
              highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
                  + predictions[n].bbox[1] + 'px; width: ' 
                  + predictions[n].bbox[2] + 'px; height: '
                  + predictions[n].bbox[3] + 'px;';

              self.liveView.appendChild(highlighter);
              self.liveView.appendChild(p);
              self.children.push(highlighter);
              self.children.push(p);
            }
          }
          
        });
      }

    render () {

        return <div className="od_class" ref={el => (this.od_class = el)}>


                <h1>Object Detection with React and TensorFlow.js</h1>

                    <section id="demos">

                    <p> Click "Start Webcam" below and accept access to the webcam when the browser asks (check the top left of your window)</p>
                    
                    <div id="liveView" className="camView">
                        <button id="webcamButton" onClick={e => this.enableCam(e)}>Start Webcam</button>
                        <video id="webcam" ref={el => (this.video = el)} autoPlay onLoadedData={e => this.runCoco(e)} width="640" height="480"></video>
                    </div>
                    </section>

                </div>

    }
    

}


export default ObjectDetection