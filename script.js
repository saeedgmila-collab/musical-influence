const container=document.getElementById("container");
let current=0;
const total=7;

function updateSlide(){
container.style.transform=`translateX(-${current*100}vw)`;
}

/* Swipe & Keyboard */
document.addEventListener("keydown",e=>{
if(e.key==="ArrowRight"&&current<total-1){current++;updateSlide();}
if(e.key==="ArrowLeft"&&current>0){current--;updateSlide();}
});

let startX=0;
document.addEventListener("touchstart",e=>startX=e.touches[0].clientX);
document.addEventListener("touchend",e=>{
let endX=e.changedTouches[0].clientX;
if(startX-endX>50&&current<total-1){current++;updateSlide();}
if(endX-startX>50&&current>0){current--;updateSlide();}
});

/* Dark Mode */
document.getElementById("darkBtn").addEventListener("click",()=>{
document.body.classList.toggle("dark");
});

/* AUDIO SYSTEM */
const audioCtx=new(window.AudioContext||window.webkitAudioContext)();
let analyser=audioCtx.createAnalyser();
analyser.fftSize=128;
const bufferLength=analyser.frequencyBinCount;
const dataArray=new Uint8Array(bufferLength);

let currentOsc=null;
let gainNode=audioCtx.createGain();
gainNode.gain.value=0.15;
analyser.connect(gainNode);
gainNode.connect(audioCtx.destination);

function stopSound(){
if(currentOsc){
currentOsc.stop();
currentOsc.disconnect();
currentOsc=null;
}
}

function createTone(freq,type="sine",duration=4){
stopSound();
let osc=audioCtx.createOscillator();
osc.type=type;
osc.frequency.value=freq;
osc.connect(analyser);
osc.start();
currentOsc=osc;

visualize();

setTimeout(()=>{stopSound()},duration*1000);
}

function visualize(){
const viz=document.getElementById("viz");
if(!viz) return;

viz.innerHTML="";
for(let i=0;i<40;i++){
let bar=document.createElement("div");
bar.className="bar";
viz.appendChild(bar);
}

function draw(){
requestAnimationFrame(draw);
analyser.getByteFrequencyData(dataArray);
let bars=document.querySelectorAll(".bar");
bars.forEach((bar,i)=>{
bar.style.height=(dataArray[i])+"px";
});
}
draw();
}

/* SOUND MODES */

function playFocus(){
createTone(432,"sine",5);
}

function playCalm(){
createTone(220,"triangle",5);
}

function playEnergy(){
createTone(880,"sawtooth",5);
}

function playMinor(){
createTone(330,"sine",4);
}

function playMajor(){
createTone(660,"triangle",4);
}

/* Emotion Test Logic */

function emotionTest(){
createTone(500,"sine",3);
setTimeout(()=>{
document.getElementById("result").innerText=
"Your emotional response suggests balanced auditory-emotional processing. You demonstrate adaptive limbic activation and healthy tonal sensitivity patterns.";
},3000);
}

/* Floating Notes */
for(let i=0;i<20;i++){
let note=document.createElement("div");
note.classList.add("note");
note.innerHTML="♪";
note.style.left=Math.random()*100+"vw";
note.style.animationDuration=(8+Math.random()*10)+"s";
document.body.appendChild(note);
}