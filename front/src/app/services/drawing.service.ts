import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Image, ImageDef } from '../../../../common/models/image';
import { Utils } from '../../../../common/utils';
import { ImageFn } from '../models/imageFn';

const oCanvas = require('ocanvas');

@Injectable({
  providedIn: 'root'
})
export class DrawingService {

  private canvas;
  private drawingDatas: ImageFn[] = [];

  constructor(private websocketService: WebsocketService) {
    this.websocketService.getImageEvent().subscribe(event => {
      console.log('eventImage', event);

      if (event.name !== 'delete') {
        this.addOrSetImage(event.data);
      } else {
        this.deleteImage(event.data.guid);
      }
    });

    this.websocketService.getInitialDrawing().subscribe(datas => {
      console.log('allDrawing', datas, this.drawingDatas);

      while (this.drawingDatas.length) {
        this.deleteImage(this.drawingDatas[0].guid);
      }

      setTimeout(_ => {
        this.canvas.redraw();

        setTimeout(_ => {
          datas.forEach(d => this.addOrSetImage(d));
        }, 100);
      }, 100);
    })
  }

  public createCanvas(canvasId: string) {
    this.canvas = oCanvas.create({
      canvas: '#' + canvasId
    });
  }

  public addImage(imageDef: ImageDef): ImageFn {
    const image = this.addOrSetImage(imageDef);

    this.websocketService.sendImageEvent('add', image);

    return image;
  }

  public addOrSetImage(imageDef: Image | ImageDef): ImageFn {
    let x = (imageDef as Image).x;
    let y = (imageDef as Image).y;

    if (x === undefined) {
      x = this.canvas.width / 2;
    }

    if (y === undefined) {
      y = this.canvas.height / 2;
    }

    let image = null;
    if ((imageDef as Image).guid) {
      try {
        image = this.getImageById((imageDef as Image).guid);
        image.moveTo(x, y);

        if (imageDef.rotation !== null) {
          image.rotateTo(imageDef.rotation);
        }
      } catch (e) {
        image = this.createImage(imageDef, x, y);
      }
    } else {
      image = this.createImage(imageDef, x, y);
    }

    this.canvas.redraw();

    Utils.replaceOrAddById(this.drawingDatas, image);

    return image;
  }

  private createImage(imageDef: Image | ImageDef, x: number, y: number): ImageFn {
    if (!imageDef.imageUrl || imageDef.showBack && !imageDef.imageBackUrl) {
      throw new Error('Creation of image impossible without url');
    }

    const image: ImageFn = this.canvas.display.image({
      x: x,
      y: y,
      rotation: imageDef.rotation ?? 0,
      origin: {x: "center", y: "center"},
      image: imageDef.showBack ? imageDef.imageBackUrl : imageDef.imageUrl
    });
    if (imageDef.width) {
      image.width = imageDef.width;
    }
    if (imageDef.height) {
      image.height = imageDef.height;
    }
    image.guid = (imageDef as Image).guid ? (imageDef as Image).guid : Utils.uuidv4();
    image.movable = imageDef.movable;
    image.rotatable = imageDef.rotatable;
    image.deletable = imageDef.deletable;
    image.imageUrl = imageDef.imageUrl;
    image.imageBackUrl = imageDef.imageBackUrl;
    image.showBack = imageDef.showBack;
    image.hiddenFromOthers = imageDef.hiddenFromOthers;
    image.changeIndex = imageDef.changeIndex;
    image.lastUser = (imageDef as Image).lastUser;

    if (imageDef.movable) {
      image.dragAndDrop({
        changeZindex: image.changeIndex,
        end: () => {
          this.websocketService.sendImageEvent('move', image);
        }
      });
    }

    if (imageDef.deletable || imageDef.rotatable) {
      image.bind('click', (event) => {
        if (event.which === 2 && imageDef.rotatable) { // right
          image.rotate(22.5);
          this.canvas.redraw();
          this.websocketService.sendImageEvent('rotate', image);
        } else if (event.which === 3 && imageDef.deletable) { // middle
          this.deleteImage(image.guid);
          this.websocketService.sendImageEvent('delete', image);
        }
      });
    }

    if (imageDef.imageBackUrl) {
      image.bind('dblclick', (event) => {
          console.log('dblclick invert showBack');
          this.deleteImage(image.guid);
          this.websocketService.sendImageEvent('delete', image);
          image.showBack = !image.showBack;
          this.addOrSetImage(image);
          this.websocketService.sendImageEvent('add', image);
      });
    }

    this.canvas.addChild(image);

    return image;
  }

  private deleteImage(id): void {
    try {
      Utils.removeById(this.drawingDatas, id).remove(true);
    } catch (e) {
      console.error(e);
    }
  }

  private getImageById(id): ImageFn {
    return Utils.getById(this.drawingDatas, id);
  }
}
