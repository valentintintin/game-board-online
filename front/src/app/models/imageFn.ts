import { Image } from '../../../../common/models/image';

export interface ImageFn extends Image {
    remove(redraw: boolean): void;

    rotate(angle: number): void;

    rotateTo(angle: number): void;

    moveTo(x: number, y: number): void;

    dragAndDrop(options: {
      changeZindex?: boolean,
      start?: () => void,
      move?: () => void,
      end?: () => void,
    }): void;

    bind(eventName: string, closure: (event) => void): ImageFn;
}
