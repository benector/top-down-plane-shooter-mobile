import * as THREE from 'three';
import { buildHealerGeometry, E1, E2, E3, launcher } from './geometries.js';
import { createEnemy, createRecharge, finishLevel } from './main.js';


let rechargeGeometry = buildHealerGeometry();
let rechargeMaterial = new THREE.MeshLambertMaterial({ color: "rgb(255, 0, 0)" });
//TIPO A: createEnemy(-50, 70, -170, enemyGeometry, enemyMaterial);

var log = "{\n";
var totalTime = 0;

function delay(time) {
  totalTime += time * 60/1000;
  log += totalTime + ": ";
  return new Promise(resolve => setTimeout(resolve, time));
}

export default async function playLevel(currentFrame) {
  switch(currentFrame) {
    case 330: createEnemy(-100, 6, -250, launcher, 'A', true, -1); break;
    case 378: createEnemy(50, 70, -170, E1, 'A', false, -1); break;
    case 426: createEnemy(100, 70, -170, E1, 'A', false, -1); break;
    case 474: createEnemy(-100, 70, -170, E1, 'A', false, -1); break;
    case 522: createEnemy(150, 70, -170, E1, 'A', false, -1); break;
    case 570: createEnemy(70, 70, -170, E1, 'A', false, -1); break;
    case 618: createEnemy(-10, 70, -170, E1, 'A', false, -1); break;

    case 918: createEnemy(-100, 6, -250, launcher, 'A', true, -1); break;
    case 1248: createEnemy(150, 6, -250, launcher, 'A', true, -1); break;
    case 1296: createEnemy(70, 6, -250, launcher, 'A', true, -1);
               createEnemy(-50, 70, -170, E1, 'A', false, -1); break;
    case 1344: createRecharge(-50, 70, -170, rechargeGeometry, rechargeMaterial);
               createEnemy(-70, 6, -250, launcher, 'A', true, -1);
               createEnemy(-120, 70, -170, E1, 'A', false, -1); break;

    case 1734: createEnemy(0, 70, -200, E3, 'C', false, -1); break;
    case 1794: createEnemy(0, 70, -200, E3, 'C', false, -1); break;
    case 1854: createEnemy(0, 70, -200, E3, 'C', false, -1); break;
    case 1914: createEnemy(0, 70, -200, E3, 'C', false, -1); break;
    case 2046: createEnemy(0, 70, -200, E3, 'C', false, 1); break;
    case 2106: createEnemy(0, 70, -200, E3, 'C', false, 1); break;
    case 2166: createEnemy(0, 70, -200, E3, 'C', false, 1); break;
    case 2226: createEnemy(0, 70, -200, E3, 'C', false, 1); break;

    case 2676: createEnemy(-150, 6, -300, launcher, 'A', true, -1); break;
    case 2712: createEnemy(-100, 6, -300, launcher, 'A', true, -1); break;
    case 2748: createEnemy(50, 70, -150, E2, 'D', false, -1); break;
    case 2784: createEnemy(0, 70, -150, E2, 'D', false, -1);
               createRecharge(-30, 70, -170, rechargeGeometry, rechargeMaterial); break;
    case 2820: createEnemy(-50, 70, -150, E2, 'D', false, -1); break;
    case 2856: createEnemy(100, 6, -300, launcher, 'A', true, -1); break;
    case 2892: createEnemy(150, 6, -300, launcher, 'A', true, -1); break;

    case 3282: createEnemy(-150, 6, -300, launcher, 'A', true, -1); break;
    case 3318: createEnemy(-100, 6, -300, launcher, 'A', true, -1); 
               createEnemy(-360, 70, -120, E1, 'B', false, -1); break;
    case 3378: createEnemy(-360, 70, -120, E1, 'B', false, -1); break;
    case 3438: createEnemy(-360, 70, -120, E1, 'B', false, -1); break;
    case 3498: createEnemy(-360, 70, -120, E1, 'B', false, -1);
               createRecharge(-120, 70, -170, rechargeGeometry, rechargeMaterial); break;
    case 3558: createEnemy(-360, 70, -120, E1, 'B', false, -1); break;

    case 4008: createEnemy(0, 70, -200, E3, 'C', false, -1); break;
    case 4056: createEnemy(200, 70, -150, E2, 'D', false, -1); break;
    case 4104: createEnemy(0, 70, -200, E3, 'C', false, -1); break;
    case 4152: createEnemy(200, 70, -150, E2, 'D', false, -1); break;
    case 4200: createEnemy(0, 70, -200, E3, 'C', false, -1); break;
    case 4248: createEnemy(10, 6, -250, launcher, 'A', true, -1); break;
    case 4296: createEnemy(150, 6, -250, launcher, 'A', true, -1); break;
    case 4344: createEnemy(70, 6, -250, launcher, 'A', true, -1); break;
    case 4392: createEnemy(100, 6, -250, launcher, 'A', true, -1); break;

    case 4782: createEnemy(-150, 70, -170, E1, 'A', false, -1); 
               createEnemy(360, 70, -20, E1, 'B', false, 1); break;
    case 4830: createEnemy(-100, 70, -170, E1, 'A', false, -1); 
               createEnemy(360, 70, -70, E1, 'B', false, 1); break;
    case 4878: createEnemy(-50, 70, -170, E1, 'A', false, -1); 
               createEnemy(360, 70, -120, E1, 'B', false, 1); break;

    case 5328: createEnemy(360, 70, 140, E1, 'B', false, 1); break;
    case 5382: createEnemy(360, 70, 140, E1, 'B', false, 1); break;
    case 5406: createEnemy(150, 6, -250, launcher, 'A', true, -1); break;
    case 5436: createEnemy(360, 70, 140, E1, 'B', false, 1); break;
    case 5460: createEnemy(70, 6, -250, launcher, 'A', true, -1); break;
    case 5490: createEnemy(360, 70, 140, E1, 'B', false, 1); break;
    case 5514: createEnemy(10, 6, -250, launcher, 'A', true, -1);
               createRecharge(50, 70, -170, rechargeGeometry, rechargeMaterial); break;

    case 5964: createEnemy(0, 70, -170, E1, 'A', false, -1); 
               createEnemy(150, 6, -250, launcher, 'A', true, -1); 
               createEnemy(-150, 6, -250, launcher, 'A', true, -1); break;
    case 6024: createEnemy(-40, 70, -170, E1, 'A', false, -1); 
               createEnemy(40, 70, -170, E1, 'A', false, -1); break;
    case 6084: createEnemy(-80, 70, -170, E1, 'A', false, -1); 
               createEnemy(80, 70, -170, E1, 'A', false, -1);
               createRecharge(0, 70, -170, rechargeGeometry, rechargeMaterial); break;
    case 6144: createEnemy(-120, 70, -170, E1, 'A', false, -1); 
               createEnemy(120, 70, -170, E1, 'A', false, -1); break;
    case 6204: createEnemy(-160, 70, -170, E1, 'A', false, -1); 
               createEnemy(160, 70, -170, E1, 'A', false, -1); 
               createEnemy(0, 6, -250, launcher, 'A', true, -1); break;

    case 6594: createEnemy(-200, 70, -150, E2, 'D', false, 1); break;
    case 6642: createEnemy(200, 70, -150, E2, 'D', false, -1); break;
    case 6690: createEnemy(-200, 70, -150, E2, 'D', false, 1); break;
    case 6738: createEnemy(200, 70, -150, E2, 'D', false, -1); break;
    case 6786: createEnemy(-200, 70, -150, E2, 'D', false, 1); break;
    case 6834: createEnemy(200, 70, -150, E2, 'D', false, -1); break;

    case 7086: createEnemy(-360, 70, 0, E1, 'B', false, -1); 
               createEnemy(360, 70, 30, E1, 'B', false, 1); break;
    case 7134: createEnemy(-360, 70, 0, E1, 'B', false, -1);
               createEnemy(360, 70, 30, E1, 'B', false, 1); break;
    case 7152: createEnemy(-80, 70, -170, E1, 'A', false, -1);
               createEnemy(0, 70, -170, E1, 'A', false, -1);
               createEnemy(80, 70, -170, E1, 'A', false, -1);
               createEnemy(100, 6, -250, launcher, 'A', true, -1);
               createEnemy(-100, 6, -250, launcher, 'A', true, -1); break;
    case 8262: finishLevel()
}
}



