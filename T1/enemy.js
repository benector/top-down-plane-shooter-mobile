import * as THREE from  'three';

export default class Enemy extends THREE.Object3D{

    constructor(geometry, material,type,){
        super();
        var mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);
        this.speed = Math.random() * (1.4- 0.6) + 1.2;  
        //criei  um tipo pra cada inimigo agora que é terra e ar mas não cheguei a usar isso ainda, talvez nem precise 
        this.type = type// 1=air, 2 = earth 
        // id criado para diferenciar os inimigos, porque durante uma colisão existem vários pontos de
        //interseção, então a função que checa colisões retorna verdadeiro várias vezes, mas pro caso dos danos só
        //contabilziamos a primeira interseção, pra isso lá ná função de colisão há a checagem se a colisão 
        //que está sendo verificada é de um inimigo que acabou de ser verificado ou se é um novo, antes
        //de contabilizar o dano do avião
        this.enemyId = 0;
    
    }
    

    setId(value){
        this.enemyId= value;
    }

    getId(){
        return this.enemyId;
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