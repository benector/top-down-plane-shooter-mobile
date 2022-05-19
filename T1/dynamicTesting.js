import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        initBasicMaterial,
        InfoBox,
        onWindowResize, 
        degreesToRadians,
        createGroundPlaneXZ,
      createGroundPlaneWired} from "../libs/util/util.js";
import Airplane from './airplane.js';
import Enemy from './enemy.js';

let scene, renderer, camera, material, light, orbit;; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 250, 80)); // Init camera in this position
material = initBasicMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

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
const createdEnemies = [];

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
  if (windowOnFocus)
  createEnemy()
}, 900);


render();

function keyboardUpdate() {
  
   keyboard.update();
  if ( keyboard.pressed("left") )     airplane.moveLeft();
  if ( keyboard.pressed("right") )    airplane.moveRight();
  if ( keyboard.pressed("up") )       airplane.moveUp();
  if ( keyboard.pressed("down") )      airplane.moveDown();


  if ( keyboard.pressed("F") )
  {
    airplane.fall();//simular queda doa vião
  }

}


function render()
{
  keyboardUpdate();
  moveEnemies();
  // movePlane();
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
}
