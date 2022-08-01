import * as THREE from  'three';
import { missile } from './geometries.js';
import { GAME_SPEED } from './main.js';

export default class Projectile extends THREE.Object3D{

    constructor(geometry, material, isEnemy = false, isGrounded = false, obj = null){
        super(); //Mesh constructor
        if(obj !== null){
            this.add(obj.clone());
        } else {
            this.add(new THREE.Mesh(geometry, material));
        }
        this.isEnemy = isEnemy;
        this.isGrounded = isGrounded;
        if(!this.isGrounded)
            this.children[0].geometry.computeBoundingSphere(); // gera bounding sphere do projétil
        Projectile.projectiles.push(this); // adiciona projétil a array de projéteis
        this.speed = 6;
        if(isEnemy){
            this.speed = 1.7;
        } else {
            this.speed = -7.7;
        }
        this.children[0].castShadow = true;
        this.rotationX = 0;
    }

    static projectiles = [];

    static moveProjectiles(scene){
        for(let i = 0; i<Projectile.projectiles.length; i++){
            Projectile.projectiles[i].updateMatrixWorld();
            // calcula posição do projétil em relação à origem
            let absolutePosition = new THREE.Vector3();
            Projectile.projectiles[i].children[0].localToWorld(absolutePosition);
            if(!Projectile.projectiles[i].isGrounded){
                Projectile.projectiles[i].translateZ(Projectile.projectiles[i].speed); // movimenta projétil para frente
            } else {  
                //movimentação do projétil terrestre
                Projectile.projectiles[i].translateZ(GAME_SPEED);
                if(Projectile.projectiles[i].position.y < 70){
                    // movimenta projétil para cima
                    Projectile.projectiles[i].translateY(Projectile.projectiles[i].speed/1.5);
                } else {
                    //rotaciona projétil
                    if(Projectile.projectiles[i].rotationX < 6){
                        Projectile.projectiles[i].children[0].rotateX(Math.PI/12);
                        Projectile.projectiles[i].rotationX++;
                    } else {
                        Projectile.projectiles[i].children[0].translateY(Projectile.projectiles[i].speed);
                    }
                }
            }

            if(absolutePosition.z <= -220 || absolutePosition.z >= 150 || absolutePosition.x >= 370 || absolutePosition.x <= -370){ 
                // remove projétil se estiver fora dos limites
                scene.remove(Projectile.projectiles[i]); 
                Projectile.projectiles.splice(i, 1); 
            } 
        }
    }
}
