import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Image, ImageUtils } from '../../../../common/models/image';
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
        }, 10);
      }, 10);
    })
  }

  public createCanvas(canvasId: string, dropDownMenu: NzDropdownMenuComponent) {
    this.canvas = oCanvas.create({
      canvas: '#' + canvasId
    });
    this.dropDownMenu = dropDownMenu;
  }

  public addImage(imageDef: Image): ImageFn {
    const image = this.addOrSetImage(imageDef);

    this.websocketService.sendImageEvent('add', this.setLastUserImage(image));

    return image;
  }

  public addOrSetImage(imageDef: Image): ImageFn {
    let x = imageDef.x
    let y = imageDef.y;

    if (x === undefined) {
      x = this.canvas.width / 2;
    }

    if (y === undefined) {
      y = this.canvas.height / 2;
    }

    let image = null;
    if (imageDef.guid) {
      try {
        image = this.getImageById(imageDef.guid);
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

    image = ImageUtils.assignValueToImage(image, imageDef);

    Utils.replaceOrAddById(this.drawingDatas,image);

    return image;
  }

  private createImage(imageDef: Image, x: number, y: number): ImageFn {
    if (!imageDef.imageUrl ||imageDef.showBack && !imageDef.imageBackUrl) {
      throw new Error('Creation ofimage impossible without url');
    }

    const image: ImageFn = this.canvas.display.image({
      x: x,
      y: y,
      rotation: imageDef.rotation ?? 0,
      origin: {x: "center", y: "center"},
      image: this.shouldSeeImageFace(imageDef) ?imageDef.imageUrl : imageDef.imageBackUrl
    });
    ImageUtils.assignValueToImage(image, imageDef);
    image.guid = image.guid ?image.guid : Utils.uuidv4();

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
        image.bind('click', event => {
          if (event.which === 2 && this.canRotateImage(image)) { // right
            this.showDropDown(image, event);
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

    image.bind('click', _ => {
      console.log(ImageUtils.getValueImage(image));
    });

    this.canvas.addChild(image);

    return image;
  }

  public canMoveImage(image: Image): boolean {
    return this.hasRightToDoActionOnImage(image) && image?.movable;
  }

  public canRotateImage(image: Image): boolean {
    return this.hasRightToDoActionOnImage(image) && image?.rotatable;
  }

  public canTurnImage(image: Image): boolean {
    return this.hasRightToDoActionOnImage(image)
      && (Boolean(image?.imageBackUrl) && (!image?.shouldTurnOnce || image?.showBack));
  }

  public canShowToAllImage(image: Image): boolean {
    return this.hasRightToDoActionOnImage(image)
      && (image?.hiddenFromOthers && image?.canUnhiddenFromOthers);
  }

  public canDeleteImage(image: Image): boolean {
    return this.hasRightToDoActionOnImage(image) && image?.deletable && (!this.imageHasBack(image) || !image?.showBack);
  }

  public isMyImage(image: Image): boolean {
    return this.userService.isMe(image?.lastUserId);
  }

  public imageHasBack(image: Image): boolean {
    return Boolean(image?.imageBackUrl);
  }

  public canDoActionOnImage(image: Image): boolean {
    const actions = this.canMoveImage(image)
      || this.canRotateImage(image)
      || this.canDeleteImage(image)
      || this.canTurnImage(image);

    return actions && this.hasRightToDoActionOnImage(image);
  }

  public hasRightToDoActionOnImage(image: Image): boolean {
    return image?.showBack || !image?.hiddenFromOthers || this.isMyImage(image);
  }

  public shouldSeeImageFace(image: Image): boolean {
    if (!this.imageHasBack(image)) {
      return true;
    }

    return this.canDoActionOnImage(image) && !image?.showBack;
  }

  public rotateImage(image: ImageFn): void {
    image.rotate(image.rotationStep ?? 22.5);
    this.canvas.redraw();
    this.websocketService.sendImageEvent('rotate', this.setLastUserImage(image));

    this.imageDropDown = null;
  }

  public turnImage(image: ImageFn): void {
    this.deleteImage(image);
    image.showBack = !image.showBack;

    setTimeout(_ => {
      this.websocketService.sendImageEvent('add', this.addOrSetImage(this.setLastUserImage(image)));
    }, 10);

    this.imageDropDown = null;
  }

  public showImageToAll(image: ImageFn): void {
    image.hiddenFromOthers = false;
    image.showBack = true;

    this.turnImage(image);
  }

  public deleteImagesByGroupId(groupId: string, state: 'touched' | 'not_touched' = null): ImageFn[] {
    const toDelete = this.getImagesByGroupId(groupId, state);
    toDelete.forEach(i => {
      setTimeout(_ => this.deleteImage(i), 10);
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
      Utils.removeById(this.drawingDatas,image.guid).remove(true);
    } catch (e) {
      console.error(e);
    }

    if (sendEvent) {
      this.websocketService.sendImageEvent('delete', this.setLastUserImage(<ImageFn>image));
      this.imageDropDown = null;
    }
  }

  private getImageById(id: string): ImageFn {
    return Utils.getById(this.drawingDatas, id);
  }

  private setLastUserImage(image: ImageFn): ImageFn {
    image.lastUserId = this.userService.userId;

    return image;
  }

  private showDropDown(image: ImageFn, event): void {
    if (this.dropDownMenu) {
      this.imageDropDown = image;
      console.log(event.originalEvent);
      let pos = null;
      if (event.originalEvent instanceof MouseEvent) {
        pos = event.originalEvent;
      } else if (event.or() instanceof TouchEvent) {
        pos = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
      }
      this.nzContextMenuService.create({
        x: pos?.clientX,
        y: pos?.clientY
      }, this.dropDownMenu);
    } else {
      console.error('DropDown element null');
    }
  }
}
