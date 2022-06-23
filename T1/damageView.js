export class damageInfo {
    constructor() {
        //info box
      this.infoBox = document.createElement('div');
      this.infoBox.id = "InfoxBox";
      this.infoBox.style.padding = "6px 14px";
      this.infoBox.style.position = "fixed";
      this.infoBox.style.bottom = "0";
      this.infoBox.style.left = "0";
      this.infoBox.style.backgroundColor = "rgba(255,255,255,0.2)";
      this.infoBox.style.color = "white";
      this.infoBox.style.fontFamily = "sans-serif";
      this.infoBox.style.userSelect = "none";
      this.infoBox.style.textAlign = "left";

      this.infoBox.appendChild( document.createTextNode("Controle de danos do avião"));
      this.infoBox.appendChild(document.createElement("br"));
      this.infoBox.appendChild(document.createElement("br")); 
      
      //barra de danos
      this.damageBar = document.createElement('div');
      this.damageBar.style.width = "200px";
      this.damageBar.style.height = "20px";
      this.damageBar.style.border = "solid 1px black"
      this.damageBar.style.display= "flex";
      this.damageBar.style.flexDirection="row"
      this.infoBox.appendChild(this.damageBar);  

      //contador de dados
      this.damageCounter = document.createElement('div');
      this.infoBox.appendChild(this.damageCounter);  

    }

    newDamageBar(){
        this.damageBar = document.createElement('div');
        this.damageBar.style.width = "200px";
        this.damageBar.style.height = "20px";
        this.damageBar.style.border = "solid 1px black"
        this.damageBar.style.display= "flex";
        this.damageBar.style.flexDirection="row"
        this.infoBox.appendChild(this.damageBar);  
    }

    deleteDamageBar(){
        this.infoBox.removeChild(this.damageBar);
    }

    newDamageCounter(damage){
        this.damageCounter = document.createElement('div');
        this.damageCounter.appendChild(document.createElement("br"));
        var text = damage + " / 5 danos sofridos"
        if(damage >= 5)
        text = "Avião abatido :(";
        var textnode = document.createTextNode(text);
        this.damageCounter.appendChild(textnode);
        this.infoBox.appendChild(this.damageCounter);
    }

    deleteDamageCounter(){
        this.infoBox.removeChild(this.damageCounter);
    }
    
    updateDamage(damage){
         //a cada update de dano os elementos da barra de danos e contador são resetados e recriados
         this.deleteDamageBar();
         this.deleteDamageCounter();
         this.newDamageBar();
         this.newDamageCounter(damage);
       if(damage<=5)
       {
        for(let i =0; i<(5-damage); i++)
        {
            let damageBlock = document.createElement('div');
            damageBlock.style.width = "40px";
            damageBlock.style.height = "20px";
            damageBlock.style.border = "solid 1px black"
            damageBlock.style.padding = "0";
            damageBlock.style.margin = "0";
    
            if(damage<2)
            damageBlock.style.backgroundColor = "rgba(124,252,0,0.5)";
            if(damage==2)
            damageBlock.style.backgroundColor = "rgba(255,215,0,0.5)";
            if(damage>2)
            damageBlock.style.backgroundColor = "rgba(255,0,0,0.5)";
    
            this.damageBar.appendChild(damageBlock);
        }
       }
    }

    show() {
        document.body.appendChild(this.infoBox);
    }
    
    delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
      }

    async gameOver(){
       await this.delay(2000);
       // this.updateDamage(0);
    }
}