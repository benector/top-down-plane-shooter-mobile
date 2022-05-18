import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { Box3, Sphere } from '../build/three.module.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        initBasicMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

import Projectile from './projectile.js';
import {intersect} from './collision.js';

let scene, renderer, camera, material, light, orbit; // variables 
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = initBasicMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.
let projectileGeometry = new THREE.SphereGeometry(0.2);
let projectileMaterial = new THREE.MeshLambertMaterial( {color: "rgb(255, 255, 0)"} );
var keyboard = new KeyboardState();
var shooting = false;
var dyingEnemies = [];

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a cube
let cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
let cubeMaterial = new THREE.MeshLambertMaterial( {color: "rgb(0, 50, 255)"} );
let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// position the cube
cube.position.set(0.0, 2.0, 8.0);
// add the cube to the scene
scene.add(cube);

//create enemy
let enemyMaterial = new THREE.MeshLambertMaterial( {color: "rgb(255, 0, 0)"} );
let enemy = new THREE.Mesh(cubeGeometry, enemyMaterial);
// position the cube
enemy.position.set(0.0, 2.0, -8.0);
// add the cube to the scene
scene.add(enemy);

render();


function render()
{
  if(!shooting)
    spawnProjectiles();
  Projectile.moveProjectiles(cube);
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
  keyboard.update();
  if(keyboard.pressed("A"))
    console.log(cube.children[0]);
  checkCollisions();
  removeEnemies();
}

//controls

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

//projectile behaviour

async function spawnProjectiles(){
  keyboard.update();
  while(keyboard.pressed("space")){
    shooting = true;
    let projectile = new Projectile(projectileGeometry, projectileMaterial);
    cube.add(projectile);
    await delay(200);
  }
  shooting = false;
}

function checkCollisions(){
  for(let i = 0; i<Projectile.projectiles.length; i++){
    if(intersect(Projectile.projectiles[i], enemy)){
      //enemy.translateX(20);
      dyingEnemies.push(enemy);
      enemy = undefined;
      cube.remove(Projectile.projectiles[i]);
      console.log(enemy);
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
      dyingEnemies[i].geometry.dispose();
      dyingEnemies[i].material.dispose();
      scene.remove(dyingEnemies[i]);
      dyingEnemies.splice(i,1);
    }
  };
}

