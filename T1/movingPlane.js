import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        initBasicMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0,5, 5)); // Init camera in this position
camera.translateY(5);
material = initBasicMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// create the ground plane 1

function createGroundPlaneWired(width, height, widthSegments = 10, heightSegments = 10, gcolor = null)
{
  if(!gcolor) gcolor = "rgb(60, 30, 150)";  
  
  //---------------------------------------------------------------------------------------
  // create the ground plane with wireframe
  var planeGeometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    planeGeometry.translate(0.0, 0, -0.2); // To avoid conflict with the axeshelper
  var planeMaterial = new THREE.MeshPhongMaterial({
    color: gcolor,
    polygonOffset: true,
    polygonOffsetFactor: 1, // positive value pushes polygon further away
    polygonOffsetUnits: 1
  });
  
  var wireframe = new THREE.WireframeGeometry( planeGeometry );
    var line = new THREE.LineSegments( wireframe );
    line.material.color.setStyle( "rgb(150, 150, 150)" );  

  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;  
    plane.add(line);
    plane.rotateX(-Math.PI/2);
  
  return plane;
}
//create ground plane 2
function createGroundPlaneWired2(width, height, widthSegments = 10, heightSegments = 10, gcolor = null)
{
  if(!gcolor) gcolor = "rgb(60, 60, 20)";  
  
  //---------------------------------------------------------------------------------------
  // create the ground plane with wireframe
  var planeGeometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    planeGeometry.translate(0.0, 30, -0.2); // To avoid conflict with the axeshelper
  var planeMaterial = new THREE.MeshPhongMaterial({
    color: gcolor,
    polygonOffset: true,
    polygonOffsetFactor: 1, // positive value pushes polygon further away
    polygonOffsetUnits: 1
  });
  
  var wireframe = new THREE.WireframeGeometry( planeGeometry );
    var line = new THREE.LineSegments( wireframe );
    line.material.color.setStyle( "rgb(150, 150, 150)" );  

  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;  
    plane.add(line);
    plane.rotateX(-Math.PI/2);
  
  return plane;
}

let plane = createGroundPlaneWired(30, 30,30,30)
scene.add(plane);
let plane2 = createGroundPlaneWired2(30, 30,30,30)
scene.add(plane2);

render();
function render()
{
  requestAnimationFrame(render);  
  if(plane.position.z > 15)
  {
    plane.position.set(0,0,-45);
  }
 plane.translateY(-0.1);

 if(plane2.position.z > 45)
 {
   plane2.position.set(0,0,-15);
 }
plane2.translateY(-0.1);
  renderer.render(scene, camera) // Render scene
}