export class InfoBox {
    constructor() {
      this.infoBox = document.createElement('div');
      this.infoBox.id = "InfoxBox";
      var header = 
      this.infoBox.style.minWidth = "100px";
      this.infoBox.style.padding = "6px 14px";
      this.infoBox.style.position = "fixed";
      this.infoBox.style.top = "0";
      this.infoBox.style.right = "0";
      this.infoBox.style.backgroundColor = "black";
      this.infoBox.style.color = "white";
      this.infoBox.style.fontFamily = "sans-serif";
      this.infoBox.style.userSelect = "none";
      this.infoBox.style.textAlign = "left";
    }
  
    addParagraph() {
      const paragraph = document.createElement("br")
      this.infoBox.appendChild(paragraph);              ;
    }
  
    add(text) {
      var textnode = document.createTextNode(text);
      this.infoBox.appendChild(textnode);
      this.addParagraph();
    }
  
    show() {
      document.body.appendChild(this.infoBox);
    }

    open(){

    }
    close(){

    }
}