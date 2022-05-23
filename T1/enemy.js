import * as THREE from  'three';

export default class Enemy extends THREE.Object3D{

    constructor(geometry, material){
        super();
        var mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);
        this.speed = Math.random() * (1.4- 0.6) + 1.2;    
    }

    canMove(){
   
        if(this.position.z<170)
        return true;
        return false
    }

    move(){
        this.position.z+=this.speed;
    }
    
    fall(){
        if(this.scale.x > 0){
            this.rotation.y+=0.08;
            this.position.y-=0.6;
            this.scale.x -= 0.02;
            this.scale.y -= 0.02;
            this.scale.z -= 0.02;
        }
    }

}