import * as THREE from  'three';
import { Box3, Sphere } from '../build/three.module.js';

// verificar intersecção entre projétil e inimigo

export function intersectSphereBox(sphere, box) {
    //bounding sphere do projétil
    let spherePosition = new THREE.Vector3();
    sphere.getWorldPosition(spherePosition);
    let BSphere = new Sphere(spherePosition, sphere.geometry.boundingSphere.radius);
    //bounding box do inimigo
    let BBox = new Box3(new THREE.Vector3(), new THREE.Vector3());
    BBox.setFromObject(box);  
    //checar colisão
    return BBox.intersectsSphere(BSphere);
}

// verificar intersecção entre jogador e inimigo

export function intersectBoxes(box1, box2) {
    //bounding box do jogador
    let BBox1 = new Box3(new THREE.Vector3(), new THREE.Vector3());
    BBox1.setFromObject(box1); 
    //bounding box do inimigo
    let BBox2 = new Box3(new THREE.Vector3(), new THREE.Vector3());
    BBox2.setFromObject(box2);  
    //checar colisão
    return BBox2.intersectsBox(BBox1);
}