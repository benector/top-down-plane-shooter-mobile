import * as THREE from  'three';
import KeyboardState from '../libs/util/KeyboardState.js';

import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        initBasicMaterial,
        onWindowResize, 
        InfoBox,
      createGroundPlaneWired} from "../libs/util/util.js";
import Airplane from './airplane.js';
import Enemy from './enemy.js';
import Projectile from './projectile.js';
import Missile from './missile.js';
import {intersectPlayer, intersectProjectile, intersectMissile} from './collision.js';
import { damageInfo } from './damageView.js';

let scene, renderer, camera, material, light, projectileGeometry, projectileMaterial, missileGeometry, missileMaterial; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 300, 200)); // Init camera in this position
material = initBasicMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
projectileGeometry = new THREE.SphereGeometry(1.5);
projectileMaterial = new THREE.MeshLambertMaterial( {color: "rgb(255, 255, 0)"} );
missileGeometry = new THREE.CylinderGeometry(0.75, 0.75, 6, 32);
missileMaterial = new THREE.MeshLambertMaterial( {color: "white"} );
var shooting = false;
var launching = false;
var playerDead = false;

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Use to scale the cube
var scale = 1.0;

// To use the keyboard
var keyboard = new KeyboardState();

// create the 2 ground planes
let plane = createGroundPlaneWired(485, 600,40,40)
scene.add(plane);
let plane2 = createGroundPlaneWired(485, 600,40,40,"rgb(100,100,20)")
plane2.translateY(600);
scene.add(plane2);


// criação do avião
var coneGeometry = new THREE.ConeGeometry( 5, 20, 32 );
var airplane = new Airplane(coneGeometry, material);
airplane.scale.set=(scale,scale,scale);
scene.add(airplane);


//criação e movimentação dos inimigos

//min e max são variáveis para serem o range daposição X dos inimigos para que sejam gerados dentro do plano

const min = -170;
const max = 170;

function createEnemy (){
    let cubeGeometry = new THREE.BoxGeometry(12,12,12);
    let cubeMaterial = initBasicMaterial();;
    cubeMaterial.color.setRGB(1,1,1);
    let enemy = new Enemy(cubeGeometry, cubeMaterial,1);
    enemy.setId(iterations + createdEnemies.length);
    enemy.position.set(Math.random() * (max - min + 1) + min +5,70.0, -170.0);
    scene.add(enemy);
    createdEnemies.push(enemy);
    enemy.move();
}

//simulação dos inimigos de terra
var createdEarthEnemies = [];

let creatingEarthEnemies = false;
function createEarthEnemies(){
  if(!creatingEarthEnemies){
    creatingEarthEnemies = true;
    let cubeGeometry = new THREE.BoxGeometry(8,8,8);
    let cubeMaterial = new THREE.MeshLambertMaterial( {color: "white"} );
    for(let i =0; i<20; i++){
      let enemy = new Enemy(cubeGeometry, cubeMaterial, 2);
      enemy.position.set(Math.random() * (max - min + 1) + min +5,4.0, Math.random() * (300 - (-300)+ 1) + -300 );
      scene.add(enemy);
      createdEarthEnemies.push(enemy);
    }
    creatingEarthEnemies = false;
  }
 
}

createEarthEnemies();


//vetor para guardar os inimigos criados e os inimigos que estão morrendo
var createdEnemies = [];

var dyingEnemies = [];

function moveEnemies(){
  for(var i =0; i < createdEnemies.length; i++)
  {
    if(createdEnemies[i].canMove())
    createdEnemies[i].move();
    else{
      //remove um inimigo do vetor e também da cena quando atingir os limites do plano
      scene.remove(createdEnemies[i]);
      createdEnemies.splice(i, 1);
    }
  }
}

let windowOnFocus = true

document.addEventListener("visibilitychange", (event) => {
  if (document.visibilityState !== "visible") {
    windowOnFocus = false
  } else {
   windowOnFocus = true
  }
});

//criação e movimentação dos inimigos
let iterations = 0;

setInterval(()=>{
  iterations++;
  if (windowOnFocus && !playerDead)
  createEnemy()
}, 900);


render();

// disparo de projéteis

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function spawnProjectiles(){
  keyboard.update();
  while(keyboard.pressed("space")||keyboard.pressed("ctrl")){
    if(playerDead)
      break;
    shooting = true;
    let projectile = new Projectile(projectileGeometry, projectileMaterial);
    projectile.position.set(airplane.position.x, airplane.position.y, airplane.position.z - 10);
    scene.add(projectile);
    await delay(200);
  }
  shooting = false;
}

//lançamento de misseis
async function launchMissiles(){
  keyboard.update();
  while(keyboard.pressed("Z")){
    if(playerDead)
      break;
    launching = true;
    let missile= new Missile(missileGeometry, missileMaterial);
    missile.position.set(airplane.position.x, airplane.position.y, airplane.position.z - 10);
    scene.add(missile);
    await delay(2000);
  }
  launching = false;
}

// checagem de colisões entre inimigos e projéteis ou entre inimigos e o avião
var collidingEnemyId = null;

function checkCollisions(){
  for(let j = 0; j<createdEnemies.length; j++){
    for(let i = 0; i<Projectile.projectiles.length; i++){
      if(intersectProjectile(Projectile.projectiles[i], createdEnemies[j])){
        dyingEnemies.push(createdEnemies[j]);
        createdEnemies.splice(j,1);
        scene.remove(Projectile.projectiles[i]);
        Projectile.projectiles[i].geometry.dispose();
        Projectile.projectiles[i].material.dispose();
        Projectile.projectiles.splice(i, 1);
      }
    }
    //colisão do avião com inimigo do ar, dano 2
    if(intersectPlayer(airplane.children[0], createdEnemies[j])){
      let enemyId = createdEnemies[j].getId();
      if(collidingEnemyId !== enemyId){
        //console.log(collidingEnemyId + " !==" + enemyId);
        dyingEnemies.push(createdEnemies[j]);
        airplane.hit(2);
        updateDamageView();
      }
      collidingEnemyId = enemyId;
    }
      
  }
}

//checagem de colisões entre mísseis e inimigos de terra
function checkMissileEnemyCollisions(){
  for(let j = 0; j<createdEarthEnemies.length; j++){
    for(let i = 0; i<Missile.missiles.length; i++){
      if(intersectMissile(Missile.missiles[i], createdEarthEnemies[j])){
        console.log("colission!");
        dyingEnemies.push(createdEarthEnemies[j]);
        createdEarthEnemies.splice(j,1);
        scene.remove(Missile.missiles[i]);
        Missile.missiles[i].geometry.dispose();
        Missile.missiles[i].material.dispose();
        Missile.missiles.splice(i, 1);
      }
    }
  }
}

//checagem de danos
function checkPlaneDamage(){
  if(airplane.getDamage() >= 5)
  {
    console.log(airplane.getDamage())
    playerDead = true;
    airplane.resetDamage();
    damageControl.gameOver();
  }
}

// animação de morte e remoção de inimigos 
function removeEnemies(){
  for(let i = 0; i<dyingEnemies.length; i++){
    dyingEnemies[i].fall();
    if(dyingEnemies[i].scale.x<=0){
      dyingEnemies[i].children[0].geometry.dispose();
      dyingEnemies[i].children[0].material.dispose();
      scene.remove(dyingEnemies[i]);
      dyingEnemies.splice(i,1);
    }
  };
}

// animação de queda do avião e reinício do jogo
function gameOver(){
  airplane.fall();
  if(airplane.position.y < 0){
    airplane.position.set(0.0, 70.0, 40.0);
    airplane.rotation.set(0, 0, 0);

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

    createdEnemies.forEach(enemy => {
      scene.remove(enemy);
      enemy.children[0].geometry.dispose();
      enemy.children[0].material.dispose();
    });
    createdEnemies = [];

    createdEarthEnemies.forEach(enemy => {
      scene.remove(enemy);
      enemy.children[0].geometry.dispose();
      enemy.children[0].material.dispose();
    });
    createdEarthEnemies = [];

    dyingEnemies.forEach(enemy => {
      scene.remove(enemy);
      enemy.children[0].geometry.dispose();
      enemy.children[0].material.dispose();
    });
    dyingEnemies = [];
    
    playerDead = false;
  }
}

// movimenta os planos do chão, dando sensação de movimento

function movingPlanes()
{
  if(plane.position.z > 450) 
  {
    plane.position.set(0,0,-750);
  }
 plane.translateY(-1.2);

 if(plane2.position.z > 450)
 {
   plane2.position.set(0,0,-750);
 }
plane2.translateY(-1.2);
}

// controle do avião por teclado

function keyboardUpdate() {
  
  keyboard.update();
 if ( keyboard.pressed("left") && !playerDead )     airplane.moveLeft();
 if ( keyboard.pressed("right") && !playerDead )    airplane.moveRight();
 if ( keyboard.pressed("up") && !playerDead )       airplane.moveUp();
 if ( keyboard.pressed("down") && !playerDead )      airplane.moveDown();
 if ( keyboard.pressed("X") && !playerDead )      createEarthEnemies();

}

//Interfacepra mapa de teclas
let controls = new InfoBox();
  controls.add("Plane Shooter");
  controls.addParagraph();
  controls.add("Mapa de teclas");
  controls.add("* Seta para cima move o avião para frente");
  controls.add("* Seta para baixo move o avião para atrás");
  controls.add("* Setas para direita e esquerda movem o avião nessas respectivas direções");
  controls.add("* Teclas Espaço ou CTRL para atirar projéteis");
  controls.add("* Tecla Z para lançar mísseis");
  controls.add("* Tecla X pra carregar mais inimigos do solo (simulação)");

  controls.show();

//Interface de danos
const damageControl = new damageInfo();
damageControl.show();
damageControl.updateDamage(airplane.getDamage())

function updateDamageView(){
  damageControl.updateDamage(airplane.getDamage())
}

function render()
{
  movingPlanes();
  keyboardUpdate();
  moveEnemies();
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
  if(!shooting)
    spawnProjectiles();
  if(!launching)
    launchMissiles();
  Projectile.moveProjectiles(scene);
  Missile.moveMissiles(scene);
  checkCollisions();
  checkMissileEnemyCollisions();
  removeEnemies();
  checkPlaneDamage();

  if(playerDead){
    gameOver();
  }

}
