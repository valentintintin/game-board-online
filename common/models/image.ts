import { Id } from './id';

export interface ImageDef {
    x: number;
    y: number;

    imageUrl: string;

    imageBackUrl?: string;
    showBack?: boolean;
    shouldTurnOnce?: boolean;
    hiddenFromOthers?: boolean;
    canUnhiddenFromOthers?: boolean;

    width: number;
    height: number;

    rotation?: number;
    rotationStep?: number;

    rotatable?: boolean;
    movable?: boolean;
    deletable?: boolean;
    changeIndex?: boolean;
}

export interface Image extends Id, ImageDef {
    name?: string;

    groupId?: string;

    lastUserId?: string;
}

export class ImageUtils {

    public static assignValueToImage(source: any, image: ImageDef | Image): Image {
        source.x = image.x ?? source.x;
        source.y = image.y ?? source.y;

        source.rotation = image.rotation ?? source.rotation;

        source.width = image.width ?? source.width;
        source.height = image.height ?? source.height;

        source.guid = (<Image>image).guid ?? source.guid;

        source.groupId = (<Image> image).groupId ?? source.groupId;

        source.changeIndex = image.changeIndex ?? source.changeIndex;

        source.imageUrl = image.imageUrl ?? source.imageUrl;
        source.imageBackUrl = image.imageBackUrl ?? source.imageBackUrl;

        source.rotationStep = image.rotationStep ?? source.rotationStep;

        source.deletable = image.deletable ?? source.deletable;
        source.movable = image.movable ?? source.movable;
        source.rotatable = image.rotatable ?? source.rotatable;

        source.showBack = image.showBack ?? source.showBack;

        source.shouldTurnOnce = image.shouldTurnOnce ?? source.shouldTurnOnce;
        source.hiddenFromOthers = image.hiddenFromOthers ?? source.hiddenFromOthers;
        source.canUnhiddenFromOthers = image.canUnhiddenFromOthers ?? source.canUnhiddenFromOthers;

        source.lastUserId = (<Image> image).lastUserId ?? source.lastUserId;

        return source;
    }

    public static getValueImage(image: Image): Image {
        return ImageUtils.assignValueToImage({}, image);
    }
}
