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
import {intersectBoxes, intersectSphereBox} from './collision.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import playLevel from './level.js';
import Missile from './missile.js';
import { damageInfo } from './damageView.js';

export var scene;
let renderer, camera, light, orbit, projectileGeometry, projectileMaterial, missileGeometry, missileMaterial; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 300, 200)); // Init camera in this position
//orbit = new OrbitControls( camera, renderer.domElement );
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
projectileGeometry = new THREE.SphereGeometry(1.5);
projectileMaterial = new THREE.MeshLambertMaterial( {color: "rgb(255, 255, 0)"} );
missileGeometry = new THREE.CylinderGeometry(1.8, 1.8, 8, 32);
missileMaterial = new THREE.MeshLambertMaterial( {color: "white"} );

var godMode = false;
var shooting = false;
var playerDead = false;
export const GAME_SPEED = 0.8;

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
var coneGeometry = new THREE.ConeGeometry( 5, 20, 32 );
var airplane = new Airplane(coneGeometry, new THREE.MeshLambertMaterial( {color: "rgb(255, 0, 0)"} ));
scene.add(airplane);

export default function getPlayerPosition(){
  return airplane.position;
}

//criação e movimentação dos inimigos

//min e max são variáveis para serem o range daposição X dos inimigos para que sejam gerados dentro do plano

const min = -170;
const max = 170;

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
      enemies[i].children[0].geometry.dispose();
      enemies[i].children[0].material.dispose();
      enemies.splice(i, 1);
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

playLevel();


render();

// disparo de projéteis

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

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
function launchMissile(){
  if(playerDead)
    return;
  let missile= new Missile(missileGeometry, missileMaterial);
  missile.position.set(airplane.position.x, airplane.position.y, airplane.position.z - 10);
  scene.add(missile);
}

window.addEventListener('keydown', function(e) {
  if(e.key == ' ')
    launchMissile();
  if(e.key == 'g')
    godMode = !godMode;
});

function checkCollisions(){
  //colidir inimigos aéreos com projéteis
  for(let j = 0; j<enemies.length; j++){
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
    //colidir inimigos com jogador

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
      enemy.children[0].geometry.dispose();
      enemy.children[0].material.dispose();
    });
    enemies = [];

    dyingEnemies.forEach(enemy => {
      scene.remove(enemy);
      enemy.children[0].geometry.dispose();
      enemy.children[0].material.dispose();
    });
    dyingEnemies = [];
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

// controle do avião por teclado

function keyboardUpdate() {
  
  keyboard.update();
 if ( keyboard.pressed("left") && !playerDead )     airplane.moveLeft();
 if ( keyboard.pressed("right") && !playerDead )    airplane.moveRight();
 if ( keyboard.pressed("up") && !playerDead )       airplane.moveUp();
 if ( keyboard.pressed("down") && !playerDead )      airplane.moveDown();
 if ( keyboard.pressed("enter") && playerDead )      window.location.reload();;

}

//Interfacepra mapa de teclas
let controls = new InfoBox();
  controls.add("Plane Shooter");
  controls.addParagraph();
  controls.add("Mapa de teclas");
  controls.add("* Seta para cima move o avião para frente");
  controls.add("* Seta para baixo move o avião para atrás");
  controls.add("* Setas para direita e esquerda movem o avião nessas respectivas direções");
  controls.add("* CTRL para atirar projéteis");
  controls.add("* Espaço para lançar mísseis");
  controls.add("* Tecla G para ativar modo de testes");

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
  Projectile.moveProjectiles(scene);
  Missile.moveMissiles(scene);
  checkCollisions();
  removeEnemies();
  checkPlaneDamage();

  if(playerDead){
    gameOver();
  }

}
