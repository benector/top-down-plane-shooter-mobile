import * as THREE from  'three';

export default class Projectile extends THREE.Mesh{

    constructor(geometry, material){
        super(geometry, material); //Mesh constructor
        this.geometry.computeBoundingSphere(); // gera bounding sphere do projétil
        Projectile.projectiles.push(this); // adiciona projétil a array de projéteis
    }

    static projectiles = [];

    static moveProjectiles(scene){
        for(let i = 0; i<Projectile.projectiles.length; i++){
            Projectile.projectiles[i].translateZ(-5); // movimenta projétil
            let absolutePosition = new THREE.Vector3();
            Projectile.projectiles[i].updateMatrixWorld();
            Projectile.projectiles[i].localToWorld(absolutePosition); // calcula posição do projétil em relação à origem
            if(absolutePosition.z <= -170){ // remove projétil se estiver fora dos limites
                scene.remove(Projectile.projectiles[i]); 
                Projectile.projectiles.splice(i, 1); 
            } 
        }
    }
}
