import * as THREE from  'three';
export default class Missile extends THREE.Mesh{

    constructor(geometry, material){
        super(geometry, material); //Mesh constructor
        this.rotation.x -= 5;
        this.geometry.computeBoundingBox();
        Missile.missiles.push(this); // adiciona míssil a array de mísseis
        this.castShadow = true;
    }

    static missiles = [];

    static moveMissiles(scene){
        for(let i = 0; i<Missile.missiles.length; i++){
            if(Missile.missiles[i].rotation.x <0){
               Missile.missiles[i].rotation.x-=0.0085;
            }
            Missile.missiles[i].position.z+=-3.6;
            Missile.missiles[i].position.y+=-3.6;

            let absolutePosition = new THREE.Vector3();
            Missile.missiles[i].updateMatrixWorld();
            Missile.missiles[i].localToWorld(absolutePosition); // calcula posição do projétil em relação à origem
            if(absolutePosition.y <= 0){ // remove projétil se estiver fora dos limites
                scene.remove(Missile.missiles[i]); 
                Missile.missiles.splice(i, 1); 
            } 
        }
    }
}
