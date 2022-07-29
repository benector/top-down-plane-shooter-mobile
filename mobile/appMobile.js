import * as THREE from  'three';
import KeyboardState from '../../libs/util/KeyboardState.js';

import {initRenderer, 
        initCamera,
        onWindowResize, 
      createGroundPlaneWired} from "../../libs/util/util.js";
import Airplane from './airplane.js';
import Enemy from './enemy.js';
import Projectile from './projectile.js';
import {intersectBoxes, intersectSphereBox} from './collision.js';
import playLevel from './level.js';
import Missile from './missile.js';
import Recharge from './recharge.js';
import { damageInfo } from './damageView.js';
import { DirectionalLight, Vector3 } from '../../build/three.module.js';
import { InfoBox } from './infobox.js';

export var scene;
let renderer, camera, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 300, 200)); // Init camera in this position

var godMode = false;
var shooting = false;
var playerDead = false;
var levelFinished;
export const GAME_SPEED = 0.8;

//iluminação

var light = new DirectionalLight("rgb(255, 255, 255)");
light.position.copy(new Vector3(20, 100, 100));
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.castShadow = true;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 900;
light.shadow.camera.left = -900;
light.shadow.camera.right = 900;
light.shadow.camera.top = 900;
light.shadow.camera.bottom = -900;
light.name = "Direction Light";
scene.add(light);

var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambientLight );



// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// To use the keyboard
var keyboard = new KeyboardState();

// create the 2 ground planes
let plane = createGroundPlaneWired(485, 600,40,40)
scene.add(plane);
let plane2 = createGroundPlaneWired(485, 600,40,40,"rgb(100,100,20)")
plane2.translateY(600);
scene.add(plane2);


// criação do avião
var airplane = new Airplane();
scene.add(airplane);

addJoysticks();

export default function getPlayerPosition(){
  return airplane.position;
}

//criação e movimentação dos inimigos


export function createEnemy 
  (x, y, z,
  obj,
  type = 'A',
  isGrounded = false,
  direction = -1)
{
  let enemy = new Enemy(obj, type, isGrounded, direction);
  enemy.position.set(x, y, z);
  scene.add(enemy);
  enemies.push(enemy);
}

//vetor para guardar os inimigos criados e os inimigos que estão morrendo
var enemies = [];

var dyingEnemies = [];

function moveEnemies(){
  for(var i =0; i < enemies.length; i++)
  {
    if(enemies[i].canMove()){
      enemies[i].move();
      enemies[i].shoot();
    }
    else{
      //remove um inimigo do vetor e também da cena quando atingir os limites do plano
      scene.remove(enemies[i]);
      enemies.splice(i, 1);
    }
  }
}

//recargas 
const min = -170;
const max = 170;
let recharges = [];

export function createRecharge(x, y, z, geometry, material){
  let recharge = new Recharge(geometry,material);
  recharge.position.set(x, y, z);
  scene.add(recharge);
  recharges.push(recharge);

}

function moveRecharges(){
  for(let i =0; i < recharges.length; i++)
  {
    if(recharges[i].canMove()){
      recharges[i].move();
    }
    else{
      scene.remove(recharges[i]);
      recharges[i].geometry.dispose();
      recharges[i].material.dispose();
      recharges.splice(i, 1);
    }
  }
}
let windowOnFocus = true

//verifica se janela está aberta

// document.addEventListener("visibilitychange", (event) => {
//   if (document.visibilityState !== "visible") {
//     windowOnFocus = false
//   } else {
//    windowOnFocus = true
//   }
// });

//criação e movimentação dos inimigos e recargas
//playLevel();

render();

// disparo de projéteis

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

let projectileGeometry = new THREE.SphereGeometry(1.5);
let projectileMaterial = new THREE.MeshLambertMaterial( {color: "rgb(255, 255, 0)"} );

async function spawnProjectiles(){
  keyboard.update();
  while(keyboard.pressed("ctrl")){
    if(playerDead)
      break;
    shooting = true;
    let projectile = new Projectile(projectileGeometry, projectileMaterial);
    projectile.position.set(airplane.position.x, airplane.position.y, airplane.position.z - 10);
    scene.add(projectile);
    await delay(500);
  }
  shooting = false;
}

//lançamento de misseis

let missileGeometry = new THREE.CylinderGeometry(1.8, 1.8, 8, 32);
let missileMaterial = new THREE.MeshLambertMaterial( {color: "white"} );

function launchMissile(){
  if(playerDead)
    return;
  let missile= new Missile(missileGeometry, missileMaterial);
  missile.position.set(airplane.position.x, airplane.position.y, airplane.position.z - 10);
  scene.add(missile);
}

//modo de testes

window.addEventListener('keydown', function(e) {
  if(e.key == ' ')
    launchMissile();
  if(e.key == 'g')
    godMode = !godMode;
});

//colisões

function checkCollisions(){
  for(let j = 0; j<enemies.length; j++){
    //colidir inimigos aéreos com projéteis
    for(let i = 0; i<Projectile.projectiles.length; i++){
      if(!(Projectile.projectiles[i].isEnemy) && enemies[j].position.y > 60){
        if(intersectSphereBox(Projectile.projectiles[i], enemies[j])){
          enemies[j].isDead = true;
          dyingEnemies.push(enemies[j]);
          enemies.splice(j,1);
          scene.remove(Projectile.projectiles[i]);
          Projectile.projectiles[i].geometry.dispose();
          Projectile.projectiles[i].material.dispose();
          Projectile.projectiles.splice(i, 1);
        }
      }
    }
    //colidir inimigos com mísseis
    for(let i = 0; i<Missile.missiles.length; i++){
      if(enemies[j].position.y < 60){
        if(intersectBoxes(Missile.missiles[i], enemies[j])){
          dyingEnemies.push(enemies[j]);
          enemies[j].isDead = true;
          enemies.splice(j,1);
          scene.remove(Missile.missiles[i]);
          Missile.missiles[i].geometry.dispose();
          Missile.missiles[i].material.dispose();
          Missile.missiles.splice(i, 1);
        }
      }
    }

    //colisão do avião com inimigo do ar, dano 2
    if(intersectBoxes(airplane.children[0], enemies[j])){
      dyingEnemies.push(enemies[j]);
      enemies[j].isDead = true;
      enemies.splice(j,1);
      if(!godMode)
        airplane.hit(2);
      updateDamageView();
    } 
  }
  
  //colidir projéteis do inimigo com jogador
  for(let i = 0; i<Projectile.projectiles.length; i++){
    if(Projectile.projectiles[i].isEnemy){
      if(intersectSphereBox(Projectile.projectiles[i], airplane.children[0])){
        if(!godMode)
          airplane.hit(1);
        updateDamageView();
        scene.remove(Projectile.projectiles[i]);
        Projectile.projectiles[i].geometry.dispose();
        Projectile.projectiles[i].material.dispose();
        Projectile.projectiles.splice(i, 1);
      } 
    }
  }

  //colisão avião e itens de recarga
  for(let i =0; i<recharges.length; i++){
    if(intersectSphereBox(recharges[i], airplane.children[0])){
      if(!godMode)
        airplane.fix();
        scene.remove(recharges[i]);
        recharges.splice(i,1);
        updateDamageView();
    }
  }
}

//checagem de danos
function checkPlaneDamage(){
  if(airplane.getDamage() >= 5)
  {
    playerDead = true;
    airplane.resetDamage();
    damageControl.gameOver();
  }
}

// animação de morte e remoção de inimigos 
function removeEnemies(){
  
  for(let i = 0; i<dyingEnemies.length; i++){
    dyingEnemies[i].fall();
    if(dyingEnemies[i].children[0].scale.x<=0){
      scene.remove(dyingEnemies[i]);
      dyingEnemies.splice(i,1);
    }  

  };
}

// animação de queda do avião e reinício do jogo
function gameOver(){
  airplane.fall();
  if(airplane.position.y < 0){

    scene.remove(airplane);

    Projectile.projectiles.forEach(projectile => {
      scene.remove(projectile);
      projectile.geometry.dispose();
      projectile.material.dispose();
    });
    Projectile.projectiles = [];

    Missile.missiles.forEach(missile => {
      scene.remove(missile);
      missile.geometry.dispose();
      missile.material.dispose();
    });
    Missile.missiles = [];

    enemies.forEach(enemy => {
      scene.remove(enemy);
      enemy.isDead = true;
    });
    enemies = [];

    dyingEnemies.forEach(enemy => {
      scene.remove(enemy);
    });
    dyingEnemies = [];

    recharges.forEach(recharge=>{
      scene.remove(recharge)
    })
    recharges = [];
  }
}

// movimenta os planos do chão, dando sensação de movimento

function movingPlanes()
{
  if(plane.position.z > 450) 
  {
    plane.position.set(0,0,-750);
  }
 plane.translateY(-GAME_SPEED);

 if(plane2.position.z > 450)
 {
   plane2.position.set(0,0,-750);
 }
plane2.translateY(-GAME_SPEED);
}

//controle do avião porjoystick

function addJoysticks(){
   
  // Details in the link bellow:
  // https://yoannmoi.net/nipplejs/

  let joystickL = nipplejs.create({
    zone: document.getElementById('joystickWrapper1'),
    mode: 'static',
    position: { top: '-80px', left: '80px' }
  });
  
  joystickL.on('move', function (evt, data) {
    const forward = data.vector.y
    const turn = data.vector.x

    if (forward > 0) 
      airplane.moveUp();
    else if (forward < 0)
    airplane.moveDown();

    if (turn > 0) 
      airplane.moveRight()
    else if (turn < 0)
      airplane.moveLeft()
  })

  joystickL.on('end', function (evt) {
    bkdValue = 0
    fwdValue = 0
    lftValue = 0
    rgtValue = 0
  })

  let joystickR = nipplejs.create({
    zone: document.getElementById('joystickWrapper2'),
    mode: 'static',
    lockY: true, // only move on the Y axis
    position: { top: '-80px', right: '80px' },
  });

  joystickR.on('move', function (evt, data) {
    const move = data.vector.y;
    console.log(move)

  if(move>0)
    spawnProjectiles();
  else
    launchMissile();


    previousScale = changeScale;
  })
}
// controle do avião por teclado

function keyboardUpdate() {
  
  keyboard.update();
 if ( keyboard.pressed("left") && !playerDead && !levelFinished )     airplane.moveLeft();
 if ( keyboard.pressed("right") && !playerDead && !levelFinished )    airplane.moveRight();
 if ( keyboard.pressed("up") && !playerDead && !levelFinished )       airplane.moveUp();
 if ( keyboard.pressed("down") && !playerDead && !levelFinished )      airplane.moveDown();
 if ( keyboard.pressed("enter") && (levelFinished || playerDead) )      window.location.reload();;

}

//Interface pra mapa de teclas
let controls = new InfoBox();
  controls.add("Como jogar");
  controls.addParagraph();
  controls.add("* Setas movem o avião nas respectivas direções");
  controls.add("* CTRL para atirar projéteis");
  controls.add("* Espaço para lançar mísseis");
  controls.add("* Tecla G para ativar modo de testes");
  controls.add("* Tecla ENTER para reiniciar o jogo caso perca ou chegue no final");

  controls.show();

//Interface de danos
const damageControl = new damageInfo();
damageControl.show();
damageControl.updateDamage(airplane.getDamage())

function updateDamageView(){
  damageControl.updateDamage(airplane.getDamage(), playerDead)
}

//Terminar jogo
export function finishLevel(){
  levelFinished = true;
}

function render()
{
 // movingPlanes();
  keyboardUpdate();
 // moveEnemies();
 // moveRecharges();
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
  if(!levelFinished){
    if(!shooting)
      spawnProjectiles();
    Projectile.moveProjectiles(scene);
    Missile.moveMissiles(scene);
    checkCollisions();
    removeEnemies();
    checkPlaneDamage();
  }
  if(playerDead){
    gameOver();
  }

}
