import * as THREE from  'three';

export default class Projectile extends THREE.Object3D{

    constructor(geometry, material){
        super(); //Object3D constructor
        var mesh = new THREE.Mesh(geometry, material);
        this.add(mesh); //add mesh to projectile
        mesh.geometry.computeBoundingSphere(); //compute projectile's bounding sphere
        Projectile.projectiles.push(this); //add projectile to array of projectiles
    }

    static projectiles = [];

    static moveProjectiles(airplane){
        for(let i = 0; i<Projectile.projectiles.length; i++){
            Projectile.projectiles[i].translateZ(-0.2); //translate projectile
            let absolutePosition = new THREE.Vector3();
            Projectile.projectiles[i].updateMatrixWorld();
            Projectile.projectiles[i].localToWorld(absolutePosition); //get projectile's position relative to world coordinates
            if(absolutePosition.z <= -10){ //remove projectile from scene if it is out of bounds
                airplane.remove(Projectile.projectiles[i]); 
                Projectile.projectiles.splice(i, 1); 
            } 
        }
    }
}
