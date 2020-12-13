import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Image, ImageUtils } from '../../../../common/models/image';
import { Utils } from '../../../../common/utils';
import { ImageFn } from '../models/imageFn';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { UserService } from './user.service';
import { Pos } from '../../../../common/models/pos';

const oCanvas = require('ocanvas');

@Injectable({
  providedIn: 'root'
})
export class DrawingService {

  private static STEP_SCALE = 0.25;
  private static MAX_SCALE = 2.5;

  public imageDropDown: ImageFn;
  public currentScale = 1;
  public panPosition: Pos;

  private canvas;
  private canvasContext2d: CanvasRenderingContext2D;

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

      this.redraw();

      setTimeout(_ => {
        datas.forEach(d => this.addOrSetImage(d));
      }, 10);
    })
  }

  public createCanvas(canvas: HTMLCanvasElement, dropDownMenu: NzDropdownMenuComponent) {
    this.canvas = oCanvas.create({
      canvas: canvas
    });

    this.canvasContext2d = canvas.getContext("2d");

    this.resetZoomPanCanvas();

    this.dropDownMenu = dropDownMenu;

    console.log(this.canvas);
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

    this.redraw();

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
      image.bind('click', event => {
        if (event.which === 2) { // right
          this.showDropDown(image, event);
        } else if (event.which === 3 && this.canDeleteImage(image)) { // middle
          this.deleteImage(image);
        }
      });

      if (this.canMoveImage(image)) {
        image.dragAndDrop({
          changeZindex: image.changeIndex,
          end: () => {
            this.websocketService.sendImageEvent('move', this.setLastUserImage(image));
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

  public rotateImage(image: ImageFn, way: 'left' | 'right'): void {
    image.rotate((image.rotationStep ?? 22.5) * (way === 'left' ? -1 : 1));
    this.redraw();
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

  public openInNewTab(image: Image): void {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = this.shouldSeeImageFace(image) ?image.imageUrl : image.imageBackUrl;
    link.click();

    this.imageDropDown = null;
  }

  public zoomCanvas(direction: 'in' | 'out'): void {
    if (direction === 'in') {
      if (this.currentScale >= DrawingService.MAX_SCALE) {
        return;
      }

      this.currentScale += DrawingService.STEP_SCALE;
    } else {
      if (this.currentScale <= 1) {
        return;
      }

      this.currentScale -= DrawingService.STEP_SCALE;
    }

    this.redraw();
  }

  public panCanvas(direction: 'left' | 'right' | 'up' | 'down'): void {
    if (this.currentScale === 1) {
      return;
    }

    const widthScaled = this.canvas.width / this.currentScale;
    const heightScaled = this.canvas.height / this.currentScale;

    const midWidth = widthScaled / 2;
    const midHeight = heightScaled / 2;

    const center = {
      x: 0,
      y: 0
    };

    switch (direction) {
      case 'left':
        center.x = -midWidth;
        break;
      case 'right':
        center.x = midWidth;
        break;
      case 'up':
        center.y = -midHeight;
        break;
      case 'down':
        center.y = midHeight;
        break;
    }

    console.log(this.panPosition, center);

    this.panPosition.x += center.x;
    this.panPosition.y += center.y;

    console.log(this.panPosition, center);

    this.redraw();
  }

  public redraw() {
    setTimeout(_ => {
      const size: Pos = {
        x: this.canvas.width / 2,
        y: this.canvas.height / 2
      };
      let center: Pos = {
        x: this.panPosition.x - size.x,
        y: this.panPosition.y - size.y
      };

      // Blank screen
      this.canvasContext2d.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Save current state
      this.canvasContext2d.save();

      // Middle of screen (origin)
      this.canvasContext2d.translate(size.x, size.y);

      // Move to center defined by the user
      this.canvasContext2d.translate(center.x, center.y);

      // Scale to zoom defined by the user
      this.canvasContext2d.scale(this.currentScale, this.currentScale);

      // Scaled size and center
      size.x *= this.currentScale;
      size.y *= this.currentScale;
      center = {
        x: this.panPosition.x - size.x,
        y: this.panPosition.y - size.y
      };

      // Move to center defined by the user after scaled
      this.canvasContext2d.translate(-center.x, -center.y);

      // Middle of screen after scaled (origin)
      this.canvasContext2d.translate(-size.x, -size.y);

      // Refresh canvas
      this.canvas.redraw();

      // Reset to normal state
      this.canvasContext2d.restore();

      this.canvas.events.enabled = this.currentScale === 1;
    }, 30);
  }

  public resetZoomPanCanvas() {
    this.currentScale = 1;
    this.panPosition = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    };

    this.redraw();
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
