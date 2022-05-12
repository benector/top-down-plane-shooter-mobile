import * as THREE from  'three';

export default class Projectile extends THREE.Object3D{

    constructor(geometry, material){
        super();
        var mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);
        Projectile.projectiles.push(this);
    }

    static projectiles = [];

    static moveProjectiles(cube){
        //console.log(Projectile.projectiles);
        for(let i = 0; i<Projectile.projectiles.length; i++){
            Projectile.projectiles[i].translateZ(-0.2);
            let absolutePosition = new THREE.Vector3();
            Projectile.projectiles[i].updateMatrixWorld();
            Projectile.projectiles[i].localToWorld(absolutePosition);
            if(absolutePosition.z <= -10){
                cube.remove(Projectile.projectiles[i]);
                Projectile.projectiles.splice(i, 1);
            } 
        }
    }
}
