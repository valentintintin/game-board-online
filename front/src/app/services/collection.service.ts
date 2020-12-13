import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Collection, ImageCollection } from '../../../../common/models/storage';
import { Utils } from '../../../../common/utils';
import { DrawingService } from './drawing.service';
import { Image } from '../../../../common/models/image';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  private _currentCollection$ = new BehaviorSubject<Collection>(null);
  private _collections$ = new BehaviorSubject<Collection[]>([]);

  constructor(private websocketService: WebsocketService, private drawingService: DrawingService) {
    this.websocketService.getInitialCollections().subscribe(collections => {
      console.log('allCollections', collections);
      this._collections$.next(collections);
    });

    this.websocketService.getCurrentCollectionId().subscribe(collection => {
      console.log('currentCollection', collection);
      if (collection) {
        this._currentCollection$.next(Utils.getById(this._collections$.value, collection));
      } else {
        this._currentCollection$.next(null);
      }
    });

    this.websocketService.connected$.subscribe(state => {
      if (!state) {
        this._currentCollection$.next(null);
      }
    });
  }

  public changeCurrentCollection(collection?: Collection): void {
    this.websocketService.sendCollectionEvent(collection);
  }

  public resetInitial(imageCollection: ImageCollection): void {
    console.log(imageCollection);

    if (imageCollection.resetOnlyVisible) {
      const imagesToShuffle = this.drawingService.getImagesByGroupId(imageCollection.guid, 'touched');
      console.log(imagesToShuffle);
      imagesToShuffle.forEach(i => {
        this.drawingService.deleteImage(i);
        i.x = imageCollection.images[0].x;
        i.y = imageCollection.images[0].y;
        i.lastUserId = null;
        i.showBack = imageCollection.images[0].showBack;
        this.drawingService.addImage(i);
      });
    } else {
      this.drawingService.deleteImagesByGroupId(imageCollection.guid);

      let randomImages: Image[] = null;
      if (imageCollection.randomizeUrl) {
        randomImages = Utils.shuffle(imageCollection.images);
      }

      imageCollection.images.forEach(i => {
        const image: Image = Utils.clone(i);
        image.guid = Utils.uuidv4();

        if (imageCollection.randomizeUrl) {
          const imageRandom = randomImages.pop();
          image.imageUrl = imageRandom.imageUrl;
          image.imageBackUrl = imageRandom.imageBackUrl;
        }

        this.drawingService.addImage(image);
      });
    }
  }

  public removeInitialNotUsed(imageCollection: ImageCollection): void {
    this.drawingService.deleteImagesByGroupId(imageCollection.guid, 'not_touched');
  }

  public get collections$(): Observable<Collection[]> {
    return this._collections$.asObservable();
  }

  public get currentCollection$(): Observable<Collection> {
    return this._currentCollection$.asObservable();
  }
}
