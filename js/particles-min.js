/**
 * particles.js
 * Current version : 1.2
 * Author(s) : Lilian Gallon (N3ROO)
 * Troubleshooting : Instructions are available on the github page.
 * Contribute here : https://github.com/N3ROO/particles.js
 * GPL-3.0 License
 */
class ParticlesHandler{constructor(canvas_id,settings,verbose){this.canvas_id=canvas_id;this.running=!1;this.starting=!1;this.resizing=!1;this.settings=settings;if(verbose===undefined){this.verbose=!1}else{this.verbose=verbose}
this.isMouseOver=!1}
start(){this.running=!0;this.starting=!0;this.run()}
stop(){this.running=!1}
setMultiplierIn(multiplierIn){this.settings.multiplierIn=multiplierIn}
setMultiplierOut(multiplierOut){this.settings.multiplierOut=multiplierOut}
run(){if(this.starting){if(this.verbose){console.log("First start, we need to init everything.")}
this.init();this.initParticleList();this.starting=!1;if(this.verbose&&this.running){console.log("Everything is ready.")}else if(this.verbose){console.log("A problem occurred during init.")}}
if(this.running){this.update();this.draw();this.requestRedraw()}else{if(this.verbose){console.log("Loop stopped.")}}}
requestRedraw(){let self=this;window.requestAnimationFrame(function(){self.run()})}
init(){if(this.verbose){console.log("particlesHandler initialization.")}
this.canvas=document.getElementById(this.canvas_id);if(this.canvas===null){console.error({error:"The canvas id '"+this.canvas_id+"' was not found.",troubleshooting:"Make sure that it is spelled corretly, and that it does not have the # prefix.",impact:"Cancelling particlesHandler initialization."});this.stop();return}
this.canvas.width=window.getComputedStyle(this.canvas.parentNode).getPropertyValue("width").replace("px","");this.canvas.height=window.getComputedStyle(this.canvas.parentNode).getPropertyValue("height").replace("px","");this.canvas.style.width=window.getComputedStyle(this.canvas.parentNode).getPropertyValue("width");this.canvas.style.height=window.getComputedStyle(this.canvas.parentNode).getPropertyValue("height");if(this.canvas.width===0||this.canvas.height===0){let error_msg="";if(this.canvas.width===0){error_msg+="The canvas as a width of 0. "}
if(this.canvas.height===0){error_msg+="The canvas as an height of 0. "}
console.error({error:error_msg,troubleshooting:"Make sure that the canvas is in a parent div and that the parent div has a non-null size.",impact:"Cancelling particlesHandler initialization."});this.stop();return}
if(this.verbose){console.log("Canvas size (w, h) : ("+this.canvas.width+","+this.canvas.height+")")}
this.context=this.canvas.getContext("2d");this.loadSettings(this.settings);let self=this;this.canvas.parentElement.addEventListener("mouseover",self.mouseOver.bind(this),!1);this.canvas.parentElement.addEventListener("mouseout",self.mouseOut.bind(this),!1);window.addEventListener('resize',self.onResize.bind(this))}
loadSettings(settings){if(this.verbose){console.log("Loading settings.")}
if(settings===undefined){if(this.verbose){console.log("Settings variable is undefined, we need to create it.")}
settings={amount:-1,tolerance:-1,lineWidth:-1,sizeMin:-1,sizeMax:-1,positionXMin:-1,positionXMax:-1,positionYMin:-1,positionYMax:-1,speedMin:-1,speedMax:-1,directionMin:-1,directionMax:-1,colorMin:-1,colorMax:-1,multiplierIn:-1,multiplierOut:-1}};this.loadSetting(settings,"amount",this.canvas.width*this.canvas.height/6000,0,Number.MAX_SAFE_INTEGER);this.loadSetting(settings,"tolerance",150,0,Number.MAX_SAFE_INTEGER);this.loadSetting(settings,"lineWidth",3,0,Number.MAX_SAFE_INTEGER);this.loadSetting(settings,"sizeMin",2,0,Number.MAX_SAFE_INTEGER);this.loadSetting(settings,"sizeMax",6,0,Number.MAX_SAFE_INTEGER);this.loadSetting(settings,"positionXMin",settings.sizeMax+1,settings.sizeMax+1,this.canvas.width-settings.sizeMax-1);this.loadSetting(settings,"positionXMax",this.canvas.width-settings.sizeMax,settings.sizeMax+1,this.canvas.width-settings.sizeMax-1);this.loadSetting(settings,"positionYMin",settings.sizeMax+1,settings.sizeMax+1,this.canvas.height-settings.sizeMax-1);this.loadSetting(settings,"positionYMax",this.canvas.height-settings.sizeMax,settings.sizeMax+1,this.canvas.height-settings.sizeMax-1);this.loadSetting(settings,"speedMin",200,0,Number.MAX_SAFE_INTEGER);this.loadSetting(settings,"speedMax",400,0,Number.MAX_SAFE_INTEGER);this.loadSetting(settings,"directionMin",0,0,Math.PI*2);this.loadSetting(settings,"directionMax",Math.PI*2,0,Math.PI*2);this.loadSetting(settings,"colorMin",0,0,360);this.loadSetting(settings,"colorMax",360,0,360);this.loadSetting(settings,"multiplierIn",1.5,0.001,Number.MAX_SAFE_INTEGER);this.loadSetting(settings,"multiplierOut",1,0.001,Number.MAX_SAFE_INTEGER);this.settings=settings}
loadSetting(settings,settingName,defaultValue,minValue,maxValue){let status;if(settings[settingName]===undefined){settings[settingName]=defaultValue;status="undefined"}else if(settings[settingName]===-1){settings[settingName]=defaultValue;status="default"}else if(settings[settingName]<minValue){settings[settingName]=minValue;status="too low"}else if(settings[settingName]>maxValue){settings[settingName]=maxValue
status="too high"}
if(this.verbose){console.log("Loaded setting '"+settingName+"', status : "+status+".")}}
initParticleList(){if(this.verbose){console.log("Creating "+this.settings.amount+" particles.")}
this.particles=[];for(let i=0;i<this.settings.amount;i++){let size=ParticlesHandler.random(this.settings.sizeMin,this.settings.sizeMax);let x=ParticlesHandler.random(this.settings.positionXMin,this.settings.positionXMax);let y=ParticlesHandler.random(this.settings.positionYMin,this.settings.positionYMax);let speed=ParticlesHandler.random(this.settings.speedMin,this.settings.speedMax);let direction=ParticlesHandler.random(this.settings.directionMin,this.settings.directionMax);let color=ParticlesHandler.random(this.settings.colorMin,this.settings.colorMax);let dot=new Particle(x,y,size,speed/1000,direction,color);this.particles.push(dot)}}
update(){for(let index in this.particles){this.particles[index].update(this.canvas.width,this.canvas.height)}}
draw(){this.context.clearRect(0,0,this.canvas.width,this.canvas.height);for(let index in this.particles){for(let neighbor_index in this.particles){if(neighbor_index!==index){let dist=this.particles[index].distanceTo(this.particles[neighbor_index]);if(dist<this.settings.tolerance){this.context.beginPath();this.context.strokeWidth=this.settings.lineWidth;this.context.strokeStyle="rgba(255,255,255,"+(1-dist/this.settings.tolerance)+")";this.context.moveTo(this.particles[index].x,this.particles[index].y);this.context.lineTo(this.particles[neighbor_index].x,this.particles[neighbor_index].y);this.context.stroke();this.context.closePath()}}}}
for(let index in this.particles){this.particles[index].draw(this.context)}}
mouseOver(){if(!this.isMouseOver){if(this.verbose){console.log("Mouse in, changing multiplier to "+this.settings.multiplierIn+".")}
for(let index in this.particles){this.particles[index].setMultiplier(this.settings.multiplierIn)}
this.isMouseOver=!0}}
mouseOut(){if(this.isMouseOver){if(this.verbose){console.log("Mouse out, changing multiplier to "+this.settings.multiplierOut+".")}
for(let index in this.particles){this.particles[index].setMultiplier(this.settings.multiplierOut)}
this.isMouseOver=!1}}
onResize(){let oldWidth=this.canvas.width;let oldHeight=this.canvas.height;this.canvas.width=window.getComputedStyle(this.canvas.parentNode).getPropertyValue("width").replace("px","");this.canvas.height=window.getComputedStyle(this.canvas.parentNode).getPropertyValue("height").replace("px","");this.canvas.style.width=window.getComputedStyle(this.canvas.parentNode).getPropertyValue("width");this.canvas.style.height=window.getComputedStyle(this.canvas.parentNode).getPropertyValue("height");this.settings.positionXMax+=this.canvas.width-oldWidth;this.settings.positionYMax+=this.canvas.height-oldHeight;this.initParticleList()}
static random(min,max){return Math.random()*((max+1)-min)+min}}
class Particle{constructor(x,y,size,speed,direction,color){this.x=x;this.y=y;this.size=size;this.vx=Math.cos(direction)*speed;this.vy=Math.sin(direction)*speed;this.color=color;this.multiplier=1;return this}
update(width,height){let multiplier_increment=0;if(this.multiplier!==1){multiplier_increment=this.multiplier/2}
this.setSpeed(this.getSpeed()+multiplier_increment);if(this.x+this.size>width||this.x-this.size<0){this.vx*=-1;this.x=this.x+this.size>width?width-this.size:this.size}else{this.x+=this.vx}
if(this.y+this.size>height||this.y-this.size<0){this.vy*=-1;this.y=this.y+this.size>height?height-this.size:this.size}else{this.y+=this.vy}
this.setSpeed(this.getSpeed()-multiplier_increment)}
draw(context){context.beginPath();context.arc(this.x,this.y,this.getSize(),0,Math.PI*2,!1);let brightness=100;if(this.multiplier>1){brightness=100-(this.multiplier*10)}
context.fillStyle='hsl('+this.color+', 100%, '+brightness+'%, 100%)';context.fill();context.closePath()}
getSize(){return this.size*this.multiplier}
getSpeed(){return Math.sqrt(this.vx*this.vx+this.vy*this.vy)}
setSpeed(speed){const direction=this.getDirection();this.vx=Math.cos(direction)*speed;this.vy=Math.sin(direction)*speed}
getDirection(){return Math.atan2(this.vy,this.vx)}
setDirection(direction){const speed=this.getSpeed();this.vx=Math.cos(direction)*speed;this.vy=Math.sin(direction)*speed}
setMultiplier(multiplier){this.multiplier=multiplier}
distanceTo(particle){let dx=particle.x-this.x;let dy=particle.y-this.y;return Math.sqrt(dx*dx+dy*dy)}}