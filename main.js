import Phaser from 'phaser';
import './style.css';

const W=960,H=540, KEY='guardianes-progreso-v1';
const missions=[
 {name:'El mensaje misterioso',question:'¡Ganaste 1.000 gemas! Entra al enlace y escribe tu contraseña. ¿Qué haces?',answers:['Abro el enlace','No abro el enlace ni comparto datos','Se lo envío a mis amigos'],correct:1,tip:'Un premio inesperado que pide contraseñas es una señal de engaño.',reward:'Lupa de la Verdad'},
 {name:'El cofre de los secretos',question:'¿Cuál de estos datos NO deberías compartir con desconocidos?',answers:['Mi color favorito','La dirección de mi casa','Mi animal favorito'],correct:1,tip:'La dirección de tu casa es información privada.',reward:'Fragmento del Conocimiento'},
 {name:'El puente de confianza',question:'Alguien te envía un mensaje incómodo. ¿Cuál es la mejor decisión?',answers:['Buscar ayuda de una persona adulta de confianza','Responder con insultos','Guardar el secreto para siempre'],correct:0,tip:'Pedir ayuda es una forma de protegerte.',reward:'Insignia Explorador Digital'}
];
const getSave=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{done:0}}catch{return {done:0}}};
const save=(done)=>{try{localStorage.setItem(KEY,JSON.stringify({done}))}catch{}};
function label(scene,x,y,text,size=20,color='#ffffff'){return scene.add.text(x,y,text,{fontFamily:'Arial',fontSize:size,color,wordWrap:{width:820},lineSpacing:5})}
function button(scene,x,y,text,action,width=390){
 const bg=scene.add.rectangle(x,y,width,52,0x167e88).setStrokeStyle(2,0x8cf0db).setInteractive({useHandCursor:true});
 const t=scene.add.text(x,y,text,{fontFamily:'Arial',fontSize:'18px',color:'#ffffff',align:'center',wordWrap:{width:width-20}}).setOrigin(.5);
 bg.on('pointerdown',action);bg.on('pointerover',()=>bg.setFillStyle(0x229da6));bg.on('pointerout',()=>bg.setFillStyle(0x167e88));
 return [bg,t];
}
class Menu extends Phaser.Scene{
 constructor(){super('Menu')}
 create(){
  this.cameras.main.setBackgroundColor('#102b36');
  this.add.circle(760,100,85,0x3aada6,.22);this.add.circle(180,430,135,0x38bba2,.12);
  label(this,110,100,'GUARDIANES DEL\nMUNDO DIGITAL',49,'#9cf7d7');
  label(this,110,240,'La fortaleza de los secretos · Nivel 1',24);
  label(this,110,300,'Explora Conexia, resuelve acertijos y aprende a protegerte.',20,'#d7e9ee');
  button(this,300,405,getSave().done?'Continuar aventura':'Comenzar aventura',()=>this.scene.start('Forest'));
  label(this,110,487,'Prototipo educativo · Identidad institucional pendiente de aprobación',13,'#b3cdd2');
 }
}
class Forest extends Phaser.Scene{
 constructor(){super('Forest')}
 create(){
  this.done=Math.min(3,getSave().done);this.busy=false;this.near=-1;
  this.physics.world.setBounds(0,0,1800,H);this.cameras.main.setBounds(0,0,1800,H);
  this.add.rectangle(900,270,1800,540,0x173f52);
  for(let i=0;i<26;i++){let x=i*76+25;this.add.rectangle(x,370,24,190,0x26584b);this.add.circle(x,290,65,0x287b68,.8)}
  this.add.rectangle(900,495,1800,90,0x306a53);
  for(let i=0;i<20;i++)this.add.circle(i*95+30,455,9,0xf1d277,.6);
  this.player=this.add.container(100,414);
  this.player.add([this.add.circle(0,-26,17,0xffd0a0),this.add.rectangle(0,4,31,48,0x39d4ba),this.add.rectangle(-8,35,10,20,0x17313d),this.add.rectangle(8,35,10,20,0x17313d)]);
  this.physics.add.existing(this.player);this.player.body.setSize(32,88).setOffset(-16,-53).setCollideWorldBounds(true).setAllowGravity(false);
  this.targets=[390,850,1330];
  this.targets.forEach((x,i)=>{this.add.circle(x,375,36,i<this.done?0x63edbc:0xf0c66a).setStrokeStyle(4,0xffffff,.6);label(this,x-58,430,`MISIÓN ${i+1}`,16)});
  this.bit=this.add.circle(155,360,17,0x74e7f3).setStrokeStyle(3,0xffffff);
  this.add.circle(149,356,3,0x122b38);this.add.circle(161,356,3,0x122b38);
  this.cursors=this.input.keyboard.createCursorKeys();this.wasd=this.input.keyboard.addKeys('W,A,S,D,E,SPACE');
  this.input.keyboard.on('keydown-E',()=>this.interact());this.input.keyboard.on('keydown-SPACE',()=>this.interact());
  this.cameras.main.startFollow(this.player,true,.09,.09,200,0);
  this.hud=this.add.text(16,14,'',{fontSize:'18px',fontFamily:'Arial',color:'#ffffff',backgroundColor:'#102b36',padding:{x:12,y:8}}).setScrollFactor(0).setDepth(10);
  this.hint=this.add.text(16,60,'',{fontSize:'17px',fontFamily:'Arial',color:'#fff1a9',backgroundColor:'#102b36',padding:{x:12,y:8}}).setScrollFactor(0).setDepth(10);
  this.controls={left:false,right:false};
  const ctl=(x,text,k)=>{let b=this.add.circle(x,475,31,0x166d7a,.85).setScrollFactor(0).setDepth(11).setInteractive();this.add.text(x,475,text,{fontSize:'25px'}).setOrigin(.5).setScrollFactor(0).setDepth(12);b.on('pointerdown',()=>{if(k==='act')this.interact();else this.controls[k]=true});b.on('pointerup',()=>this.controls[k]=false);b.on('pointerout',()=>this.controls[k]=false)};
  ctl(62,'◀','left');ctl(142,'▶','right');ctl(884,'✦','act');
  this.updateHud();
  if(this.done===3)this.showMessage('¡Nivel 1 completado!','Has conseguido el Cristal del Conocimiento y la insignia Explorador Digital. Los próximos mundos están en desarrollo.');
 }
 updateHud(){this.hud.setText(`🌟 Bosque de las Señales  |  Misiones ${this.done}/3`)}
 update(){
  if(this.busy){this.player.body.setVelocityX(0);return}
  let dir=(this.cursors.left.isDown||this.wasd.A.isDown||this.controls.left?-1:0)+(this.cursors.right.isDown||this.wasd.D.isDown||this.controls.right?1:0);
  this.player.body.setVelocityX(dir*230);
  this.bit.x=this.player.x+55;this.bit.y=360+Math.sin(this.time.now/300)*9;
  this.near=this.targets.findIndex((x,i)=>i===this.done&&Math.abs(this.player.x-x)<90);
  this.hint.setText(this.near>=0?'Pulsa E o ✦ para investigar':'Explora con ← → o los botones táctiles');
 }
 interact(){if(this.busy||this.near<0)return;this.showMission(this.near)}
 overlay(title,body){
  this.busy=true;let c=this.add.container(0,0).setScrollFactor(0).setDepth(30);
  c.add(this.add.rectangle(W/2,H/2,W,H,0x06151e,.89));
  c.add(this.add.rectangle(W/2,H/2,850,420,0x143c49).setStrokeStyle(3,0x65dcc2));
  c.add(this.add.text(90,92,title,{fontFamily:'Arial',fontSize:'29px',color:'#a6ffdb'}));
  c.add(this.add.text(90,148,body,{fontFamily:'Arial',fontSize:'21px',color:'#ffffff',wordWrap:{width:775},lineSpacing:6}));
  return c;
 }
 showMessage(title,msg){
  let c=this.overlay(title,msg);
  const [b,t]=button(this,480,400,'Continuar',()=>{c.destroy();b.destroy();t.destroy();this.busy=false});
  b.setScrollFactor(0).setDepth(31);t.setScrollFactor(0).setDepth(32);
 }
 showMission(i){
  const m=missions[i],c=this.overlay(`Misión ${i+1}: ${m.name}`,m.question);
  const extras=[];
  const clear=()=>{c.destroy();extras.forEach(o=>o.destroy());this.busy=false};
  m.answers.forEach((answer,j)=>{
   const [b,t]=button(this,480,242+j*57,answer,()=>{
    if(j===m.correct){clear();this.done++;save(this.done);this.updateHud();this.showMessage('¡Misión superada!',`¡Muy bien! ${m.tip}\n\nRecompensa: ${m.reward}`)}
    else{clear();this.showMessage('Bit te da una pista',`${m.tip}\n\nPuedes volver a intentarlo. ¡Aprender es explorar!`)}
   },730);
   b.setScrollFactor(0).setDepth(31);t.setScrollFactor(0).setDepth(32);extras.push(b,t);
  });
 }
}
new Phaser.Game({type:Phaser.AUTO,parent:'game',width:W,height:H,backgroundColor:'#102b36',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},physics:{default:'arcade',arcade:{debug:false}},scene:[Menu,Forest]});
