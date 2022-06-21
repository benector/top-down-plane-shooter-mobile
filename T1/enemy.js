import * as THREE from  'three';
import { Vector3 } from '../build/three.module.js';
import Projectile from './projectile.js';

export default class Enemy extends THREE.Object3D{

    constructor(geometry, material, type = 'D', direction = -1){
        super();
        var mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);
        this.direction = direction;
        this.ZSpeed = 1.1;
        if(type == 'D'){
                this.XSpeed = Math.sqrt(1.1/3) * direction;
                this.ZSpeed = Math.sqrt(1.1);
        } 
        
        this.type = type; 
        this.canShoot = true;
    }

    canMove(){
   
        if(this.position.z<170 && this.position.x < 287 && this.position.x > -287)
        return true;
        return false
    }

    move(){
        switch(this.type){
            case 'A':
                this.position.z+=this.ZSpeed;
                break;
            case 'B':
                this.position.x+=this.ZSpeed;
                break;
            case 'C':
                this.position.z+=this.ZSpeed/1.2;
                this.position.x = this.position.z * this.position.z * 0.01 * this.direction;
                break;
            case 'D':
                this.position.z+= this.ZSpeed;
                this.position.x+= this.XSpeed;
                break;
            
        }
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

    async shoot(playerPosition, scene){
        if(!this.canShoot)
            return;
            this.canShoot = false;
            let projectile = new Projectile(new THREE.SphereGeometry(2.8),
                                new THREE.MeshLambertMaterial( {color: "rgb(255, 150, 60)"} ),
                                true,
                                playerPosition)
            projectile.translateX(this.position.x);
            projectile.translateY(this.position.y);
            projectile.translateZ(this.position.z);
            projectile.lookAt(playerPosition);
            scene.add(projectile);
            await this.delay(5500);
            this.canShoot = true;
        //}

    }

    delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

}