import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        initBasicMaterial,
        onWindowResize, 
      createGroundPlaneWired} from "../libs/util/util.js";
import Airplane from './airplane.js';
import Enemy from './enemy.js';
import Projectile from './projectile.js';
import {intersectPlayer, intersectProjectile} from './collision.js';

let scene, renderer, camera, material, light, orbit, projectileGeometry, projectileMaterial; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 250, 80)); // Init camera in this position
material = initBasicMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.
projectileGeometry = new THREE.SphereGeometry(1);
projectileMaterial = new THREE.MeshLambertMaterial( {color: "rgb(255, 255, 0)"} );
var shooting = false;
var playerDead = false;

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Use to scale the cube
var scale = 1.0;

// To use the keyboard
var keyboard = new KeyboardState();

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneWired(150, 150)
scene.add(plane);


// criação do avião
var coneGeometry = new THREE.ConeGeometry( 5, 20, 32 );
var airplane = new Airplane(coneGeometry, material);
airplane.scale.set=(scale,scale,scale);
scene.add(airplane);


//criação e movimentação dos inimigos

//min e max são variáveis para serem o range daposição X dos inimigos para que sejam gerados dentro do plano

const min = -50;
const max = 50;

function createEnemy (){
    let cubeGeometry = new THREE.BoxGeometry(6,6,6);
    let cubeMaterial = initBasicMaterial();;
    cubeMaterial.color.setRGB(1,1,1);
    let enemy = new Enemy(cubeGeometry, cubeMaterial);
    enemy.position.set(Math.random() * (max - min + 1) + min +5,70.0, -100.0);
    scene.add(enemy);
    createdEnemies.push(enemy);
    // enemy.move();
}

//vetor para guardar todos os inimigos criados
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

setInterval(()=>{
  if (windowOnFocus && !playerDead)
  createEnemy()
}, 900);


render();

function keyboardUpdate() {
  
   keyboard.update();
  if ( keyboard.pressed("left") && !playerDead )     airplane.moveLeft();
  if ( keyboard.pressed("right") && !playerDead )    airplane.moveRight();
  if ( keyboard.pressed("up") && !playerDead )       airplane.moveUp();
  if ( keyboard.pressed("down") && !playerDead )      airplane.moveDown();


  if ( keyboard.pressed("F") )
  {
    airplane.fall();//simular queda doa vião
  }

}

//projectile behaviour

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function spawnProjectiles(){
  keyboard.update();
  while(keyboard.pressed("space")){
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
    if(intersectPlayer(airplane.children[0], createdEnemies[j])){
      playerDead = true;
    }
      
  }
}

function removeEnemies(){
  for(let i = 0; i<dyingEnemies.length; i++){
    dyingEnemies[i].scale.x -= 0.05;
    dyingEnemies[i].scale.y -= 0.05;
    dyingEnemies[i].scale.z -= 0.05;
    dyingEnemies[i].rotateY(0.1);
    if(dyingEnemies[i].scale.x<=0){
      dyingEnemies[i].children[0].geometry.dispose();
      dyingEnemies[i].children[0].material.dispose();
      scene.remove(dyingEnemies[i]);
      dyingEnemies.splice(i,1);
    }
  };
}

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

    createdEnemies.forEach(enemy => {
      scene.remove(enemy);
      enemy.children[0].geometry.dispose();
      enemy.children[0].material.dispose();
    });
    createdEnemies = [];

    dyingEnemies.forEach(enemy => {
      scene.remove(enemy);
      enemy.children[0].geometry.dispose();
      enemy.children[0].material.dispose();
    });
    dyingEnemies = [];
    
    playerDead = false;
  }
}


function render()
{
  keyboardUpdate();
  moveEnemies();
  // movePlane();
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
  if(!shooting)
    spawnProjectiles();
  Projectile.moveProjectiles(scene);
  checkCollisions();
  removeEnemies();
  if(playerDead)
    gameOver();
}
