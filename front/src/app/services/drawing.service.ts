import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Image, ImageDef } from '../../../../common/models/image';
import { Utils } from '../../../../common/utils';
import { ImageFn } from '../models/imageFn';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { UserService } from './user.service';

const oCanvas = require('ocanvas');

@Injectable({
  providedIn: 'root'
})
export class DrawingService {

  public imageDropDown: ImageFn;

  private canvas;
  private drawingDatas: ImageFn[] = [];
  private dropDownMenu: NzDropdownMenuComponent;

  constructor(private websocketService: WebsocketService, private nzContextMenuService: NzContextMenuService,
              private userService: UserService) {
    this.websocketService.getImageEvent().subscribe(event => {
      console.log('eventImage', event);

      if (event.name !== 'delete') {
        this.addOrSetImage(event.data);
      } else {
        this.deleteImage(event.data, false);
      }
    });

    this.websocketService.getInitialDrawing().subscribe(datas => {
      console.log('allDrawing', datas);

      while (this.drawingDatas.length) {
        this.deleteImage(this.drawingDatas[0], false);
      }

      setTimeout(_ => {
        this.canvas.redraw();

        setTimeout(_ => {
          datas.forEach(d => this.addOrSetImage(d));
        }, 100);
      }, 100);
    })
  }

  public createCanvas(canvasId: string, dropDownMenu: NzDropdownMenuComponent) {
    this.canvas = oCanvas.create({
      canvas: '#' + canvasId
    });
    this.dropDownMenu = dropDownMenu;
  }

  public addImage(imageDef: ImageDef): ImageFn {
    const image = this.addOrSetImage(imageDef);

    this.websocketService.sendImageEvent('add', this.setLastUserImage(image));

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
      image: this.shouldSeeImageFace(imageDef) ? imageDef.imageUrl : imageDef.imageBackUrl
    });
    if (imageDef.width) {
      image.width = imageDef.width;
    }
    if (imageDef.height) {
      image.height = imageDef.height;
    }
    image.guid = (imageDef as Image).guid ? (imageDef as Image).guid : Utils.uuidv4();
    image.groupId = imageDef.groupId;
    image.movable = imageDef.movable;
    image.rotatable = imageDef.rotatable;
    image.deletable = imageDef.deletable;
    image.imageUrl = imageDef.imageUrl;
    image.imageBackUrl = imageDef.imageBackUrl;
    image.shouldTurnOnce = imageDef.shouldTurnOnce;
    image.showBack = imageDef.showBack;
    image.hiddenFromOthers = imageDef.hiddenFromOthers;
    image.changeIndex = imageDef.changeIndex;
    image.lastUserId = (imageDef as Image).lastUserId;

    if (this.canDoActionOnImage(image)) {
      if (this.canMoveImage(image)) {
        image.dragAndDrop({
          changeZindex: image.changeIndex,
          end: () => {
            this.websocketService.sendImageEvent('move', this.setLastUserImage(image));
          }
        });
      }

      if (this.canDeleteImage(image) || this.canRotateImage(image)) {
        image.bind('click', (event) => {
          if (event.which === 2 && this.canRotateImage(image)) { // right
            this.rotateImage(image);
          } else if (event.which === 3 && this.canDeleteImage(image)) { // middle
            this.deleteImage(image);
          }
        });
      }

      if (this.canTurnImage(image)) {
        image.bind('dblclick', _ => {
          this.turnImage(image);
        });
      }

      image.bind('dbltap', event => {
        this.showDropDown(image, event);
      });
    }

    this.canvas.addChild(image);

    return image;
  }

  public canMoveImage(imageDef: ImageDef): boolean {
    return this.hasRightToDoActionOnImage(imageDef) && imageDef?.movable;
  }

  public canRotateImage(imageDef: ImageDef): boolean {
    return this.hasRightToDoActionOnImage(imageDef) && imageDef?.rotatable;
  }

  public canTurnImage(imageDef: ImageDef): boolean {
    return this.hasRightToDoActionOnImage(imageDef)
      && (Boolean(imageDef?.imageBackUrl) && (!imageDef?.shouldTurnOnce || imageDef?.showBack));
  }

  public canDeleteImage(imageDef: ImageDef): boolean {
    return this.hasRightToDoActionOnImage(imageDef) && imageDef?.deletable && (!this.imageHasBack(imageDef) || !imageDef?.showBack);
  }

  public isMyImage(imageDef: Image): boolean {
    return this.userService.isMe(imageDef?.lastUserId);
  }

  public imageHasBack(imageDef: ImageDef): boolean {
    return Boolean(imageDef?.imageBackUrl);
  }

  public canDoActionOnImage(imageDef: ImageDef): boolean {
    const actions = this.canMoveImage(imageDef)
      || this.canRotateImage(imageDef)
      || this.canDeleteImage(imageDef)
      || this.canTurnImage(imageDef);

    return actions && this.hasRightToDoActionOnImage(imageDef);
  }

  public hasRightToDoActionOnImage(imageDef: ImageDef): boolean {
    return !imageDef?.hiddenFromOthers || this.isMyImage(<Image> imageDef);
  }

  public shouldSeeImageFace(imageDef: ImageDef): boolean {
    if (!this.imageHasBack(imageDef)) {
      return true;
    }

    return this.canDoActionOnImage(imageDef) && !imageDef?.showBack;
  }

  public rotateImage(image: ImageFn, degrees = 22.5): void {
    image.rotate(degrees);
    this.canvas.redraw();
    this.websocketService.sendImageEvent('rotate', this.setLastUserImage(image));

    this.imageDropDown = null;
  }

  public turnImage(image: ImageFn): void {
    this.deleteImage(image);
    image.showBack = !image.showBack;
    this.addOrSetImage(image);
    this.websocketService.sendImageEvent('add', this.setLastUserImage(image));

    this.imageDropDown = null;
  }

  public deleteImagesByGroupId(groupId: string, state: 'touched' | 'not_touched' = null): ImageFn[] {
    const toDelete = this.getImagesByGroupId(groupId, state);
    toDelete.forEach(i => {
      setTimeout(_ => this.deleteImage(i), 100);
    });
    return toDelete;
  }

  public getImagesByGroupId(groupId: string, state: 'touched' | 'not_touched' = null): ImageFn[] {
    return this.drawingDatas.filter(i => i.groupId === groupId &&
      (!state ||
        (state === 'touched' && i.lastUserId)
        || (state === 'not_touched' && !i.lastUserId)
      )
    );
  }

  public deleteImage(image: Image, sendEvent = true): void {
    try {
      Utils.removeById(this.drawingDatas, image.guid).remove(true);
    } catch (e) {
      console.error(e);
    }

    if (sendEvent) {
      this.websocketService.sendImageEvent('delete', this.setLastUserImage(<ImageFn> image));
      this.imageDropDown = null;
    }
  }

  private getImageById(id: string): ImageFn {
    return Utils.getById(this.drawingDatas, id);
  }

  private setLastUserImage(image: ImageFn): ImageFn {
    if (!image.lastUserId || !image.hiddenFromOthers) {
      image.lastUserId = this.userService.userId;
    }

    return image;
  }

  private showDropDown(image: ImageFn, event): void {
    if (this.dropDownMenu) {
      this.imageDropDown = image;
      const touch: Touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
      this.nzContextMenuService.create({
        x: touch.clientX,
        y: touch.clientY
      }, this.dropDownMenu);
    } else {
      console.error('DropDown element null');
    }
  }
}
