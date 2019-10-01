import { Component, OnInit } from '@angular/core';
import { Tesseract } from "tesseract.ts";
declare var $: any;
@Component({
  selector: 'app-tesseract',
  templateUrl: './tesseract.component.html',
  styleUrls: ['./tesseract.component.less']
})
export class TesseractComponent implements OnInit {
  outputText: any;
  canvas: any;
  ctx: any;
  rect: any;
  rectExtract: any;
  drag = false;
  imageObj = null;
  constructor() { }

  ngOnInit() {

    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.rect = { startX: 0, startY: 0, w: 0, h: 0 };
    this.rectExtract = { startX: 0, startY: 0, w: 0, h: 0 };
    this.drag = false;
    this.imageObj = null;




  }


  init(imageData) {
    this.imageObj = new Image();
    this.imageObj.onload = () => {

      this.canvas.setAttribute("width", this.imageObj.width);
      this.canvas.setAttribute("height", this.imageObj.height);
      this.ctx.drawImage(this.imageObj, 0, 0, this.imageObj.width, this.imageObj.height);
    };
    this.imageObj.src = imageData;


    this.canvas.addEventListener('mousedown', this.mouseDown.bind(this), false);
    this.canvas.addEventListener('mouseup', this.mouseUp.bind(this), false);
    this.canvas.addEventListener('mousemove', this.mouseMove.bind(this), false);
    $.contextMenu({
      // define which elements trigger this menu
      selector: "#canvas",
      // define the elements of the menu
      items: {
        extract: {
          name: "Extract", callback: (key, opt) => {

            const canvas = document.createElement('canvas') as HTMLCanvasElement;
            // this.rect.startX, this.rect.startY, this.rect.w, this.rect.h
            canvas.width = this.rect.w;
            canvas.height = this.rect.h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this.canvas, this.rect.startX, this.rect.startY, this.rect.w, this.rect.h, 0, 0, this.rect.w, this.rect.h);
            const result = canvas.toDataURL();
            console.log(result);
            Tesseract
              .recognize(result)
              .then((res: any) => {
                console.log(res);
                this.outputText = res.text;
              })
              .catch(console.error);
          }
        },
        cancel: {
          name: "Cancel", callback: (key, opt) => {

            this.drag = false;
            this.ctx.clearRect(0, 0, this.imageObj.width, this.imageObj.height);
            this.ctx.drawImage(this.imageObj, 0, 0);
          }
        }
        // there's more, have a look at the demos and docs...
      }
    });
  }

  mouseDown(e) {
    if (e.which == 1) {
      this.rect.startX = e.pageX - e.target.offsetLeft;
      this.rect.startY = e.pageY - e.target.offsetTop;
      this.drag = true;
    }

  }

  mouseUp() {
    this.drag = false;
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    // this.rect.startX, this.rect.startY, this.rect.w, this.rect.h
    canvas.width = this.rect.w;
    canvas.height = this.rect.h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.canvas, this.rect.startX, this.rect.startY, this.rect.w, this.rect.h, 0, 0, this.rect.w, this.rect.h);
    const result = canvas.toDataURL();
    console.log(result);
    Tesseract
      .recognize(result)
      .then((res: any) => {
        console.log(res);
        this.outputText = res.text;
      })
      .catch(console.error);
  }

  mouseMove(e) {
    if (this.drag) {
      this.ctx.clearRect(0, 0, this.imageObj.width, this.imageObj.height);
      this.ctx.drawImage(this.imageObj, 0, 0);
      this.rect.w = (e.pageX - e.target.offsetLeft) - this.rect.startX;
      this.rect.h = (e.pageY - e.target.offsetTop) - this.rect.startY;
      this.ctx.strokeStyle = 'red';
      this.ctx.strokeRect(this.rect.startX, this.rect.startY, this.rect.w, this.rect.h);
    }
  }



  readFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.init(e.target.result);

    };
    reader.readAsDataURL(file);
  }

}
