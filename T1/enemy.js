import * as THREE from  'three';

export default class Enemy extends THREE.Object3D{

    constructor(geometry, material){
        super();
        var mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);
        this.speed = Math.random() * (0.9- 0.3) + 0.3;    
    }

    canMove(){
   
        if(this.position.z<75)
        return true;
        return false
    }

    move(){
        this.position.z+=this.speed;
        // console.log('z',this.position.z)
    }
    fall(){
        this.rotation.y+=0.08;
        this.position.y-=0.6;
    }

}