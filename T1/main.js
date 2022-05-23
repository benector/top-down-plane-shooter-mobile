import * as THREE from  'three';
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
camera = initCamera(new THREE.Vector3(0, 300, 200)); // Init camera in this position
material = initBasicMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
projectileGeometry = new THREE.SphereGeometry(1.5);
projectileMaterial = new THREE.MeshLambertMaterial( {color: "rgb(255, 255, 0)"} );
var shooting = false;
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
    let enemy = new Enemy(cubeGeometry, cubeMaterial);
    enemy.position.set(Math.random() * (max - min + 1) + min +5,70.0, -170.0);
    scene.add(enemy);
    createdEnemies.push(enemy);
    // enemy.move();
}

//vetore para guardar os inimigos criados e os inimigos que estão morrendo
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

// controle do avião por teclado

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

// checagem de colisões entre inimigos e projéteis ou entre inimigos e o avião

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
  checkCollisions();
  removeEnemies();
  if(playerDead)
    gameOver();
}
