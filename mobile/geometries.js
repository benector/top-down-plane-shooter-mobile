import * as THREE from  'three';
import {GLTFLoader} from '../../build/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from '../../build/jsm/loaders/OBJLoader.js';
import {MTLLoader} from '../../build/jsm/loaders/MTLLoader.js';
import {getMaxSize, degreesToRadians} from "../../libs/util/util.js";
import { Object3D } from '../../build/three.module.js';
import { CSG } from '../../libs/other/CSGMesh.js' 
import { Water } from '../../build/jsm/objects/Water.js';  // Water shader in here
import { onStartButtonPressed } from './appMobile.js';

// Create the loading manager
const loadingManager = new THREE.LoadingManager( () => {
  let loadingScreen = document.getElementById( 'loading-screen' );
  loadingScreen.transition = 0;
  loadingScreen.style.setProperty('--speed1', '0');  
  loadingScreen.style.setProperty('--speed2', '0');  
  loadingScreen.style.setProperty('--speed3', '0');      

  let button  = document.getElementById("myBtn")
  button.style.backgroundColor = '#8f8eff';
  button.innerHTML = 'Iniciar';
  button.addEventListener("click", onStartButtonPressed);


});


export function buildHealerGeometry(){
    let auxMat = new THREE.Matrix4();
    // Base objects
    let cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 10))
    let cubeMesh2 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 10))
    let cylinderMesh = new THREE.Mesh( new THREE.CylinderGeometry(7.5, 7.5, 2.5, 32))
    
    // CSG holders
    let csgObject, csgObject2, cubeCSG, cubeCSG2,cylinderCSG
 
     // Object 4 - Cube UNION cube
    cubeMesh2.rotateX(degreesToRadians(90))
    cubeMesh2.rotateY(degreesToRadians(90))
    cubeMesh2.position.set(0.0, 0.0, 0) // reset position
    cubeMesh2.matrixAutoUpdate = false;
    cubeMesh2.updateMatrix();
    cubeCSG2 = CSG.fromMesh(cubeMesh2)
    cubeCSG = CSG.fromMesh(cubeMesh)
    csgObject = cubeCSG.union(cubeCSG2) // Execute union
    let mesh3 = CSG.toMesh(csgObject, auxMat)
    mesh3.material = new THREE.MeshPhongMaterial({color: 'indianred'})
    mesh3.position.set(-4, 0, 1.02)
    
   /// Object 5 - Cross SUBTRACT cylinder
    cylinderCSG = CSG.fromMesh(cylinderMesh)   
    csgObject2 = cylinderCSG.subtract(csgObject) // Execute subtraction
    let mesh1 = CSG.toMesh(csgObject2, auxMat)
    return mesh1.geometry;
}

export function loadGLTFFile(modelName, visibility, desiredScale, object)
{
  var loader = new GLTFLoader( );
  loader.load( "assets/" + modelName + '.gltf', function ( gltf ) {
    var obj = gltf.scene;
    obj.name = modelName;
    obj.visible = visibility;
    obj.traverse( function ( child ) {
      if ( child ) {
          child.castShadow = true;
      }
    });
    obj.traverse( function( node )
    {
      if( node.material ) node.material.side = THREE.DoubleSide;
    });

    var obj = normalizeAndRescale(obj, desiredScale);
    var obj = fixPosition(obj);
    //console.log(object);
    if(modelName == "vale"){
      object.add(obj.children[0].clone());
    } else {
      obj.children[0].children[(modelName == "plane" ? 0 : 1)].children.forEach(mesh => {
          if(modelName == "E1")
              mesh.rotateY(Math.PI/2)
          object.add(mesh.clone());
      });
    }
    }, onProgress, onError);
}


function loadOBJFile(modelName, visibility, desiredScale, object)
{

  var mtlLoader = new MTLLoader( loadingManager );
  mtlLoader.setPath( "assets/" );
  mtlLoader.load( modelName + '.mtl', function ( materials ) {
        materials.preload();

        var objLoader = new OBJLoader( loadingManager );
        objLoader.setMaterials(materials);
        objLoader.setPath("assets/");
        objLoader.load( modelName + ".obj", function ( obj ) {
          obj.name = modelName;
          obj.visible = visibility;
          // Set 'castShadow' property for each children of the group
          obj.traverse( function (child)
          {
            child.castShadow = true;
          });

          obj.traverse( function( node )
          {
            if( node.material ) node.material.side = THREE.DoubleSide;
          });

          var obj = normalizeAndRescale(obj, desiredScale);
          var obj = fixPosition(obj);

          obj.children.forEach(mesh => {
            object.add(mesh.clone());
        });

          // Pick the index of the first visible object
          if(modelName == 'launcher')
          {
            activeObject = objectArray.length-1;
          }

        }, onProgress, onError );
  });
}




function onError() { };

function onProgress ( xhr, model ) { }

function normalizeAndRescale(obj, newScale)
{
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(newScale * (1.0/scale),
                newScale * (1.0/scale),
                newScale * (1.0/scale));
  return obj;
}

function fixPosition(obj)
{
  // Fix position of the object over the ground plane
  var box = new THREE.Box3().setFromObject( obj );
  if(box.min.y > 0)
    obj.translateY(-box.min.y);
  else
    obj.translateY(-1*box.min.y);
  return obj;
}

export let plane = new Object3D;
loadGLTFFile("plane", true, 1, plane);
plane.rotateY(Math.PI);

export let E1 = new Object3D;
loadGLTFFile("E1", true, 1, E1);

export let E2 = new Object3D;
loadGLTFFile("E2", true, 1, E2);

export let E3 = new Object3D;
loadGLTFFile("E3", true, 1, E3);

export let launcher = new Object3D;
loadOBJFile("launcher", true, 1, launcher);
launcher.scale.x = 0.01
launcher.scale.y = 0.01
launcher.scale.z = 0.01

export let vale = new Object3D;
loadGLTFFile("vale", true, 1, vale);
vale.rotateX(degreesToRadians(90));

export let vale2 = new Object3D;
loadGLTFFile("vale", true, 1, vale2);
vale2.rotateX(degreesToRadians(90));