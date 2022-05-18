import * as THREE from  'three';
import { Box3, Sphere } from '../build/three.module.js';

export function intersect(projectile, boxObj) {
    //projectile's bounding sphere
    let spherePosition = new THREE.Vector3();
    projectile.getWorldPosition(spherePosition);
    let sphere = new Sphere(spherePosition, projectile.children[0].geometry.boundingSphere.radius);
    //boxObj's bounding box
    let box = new Box3(new THREE.Vector3(), new THREE.Vector3());
    box.setFromObject(boxObj);  
    //check collision
    return box.intersectsSphere(sphere);
}