import { Image, ImageDef } from './image';
import { Id } from './id';

export interface ImageCollection extends Id {
    images: Image[];
    name?: string;
    randomizeUrl?: boolean;
    canReset?: boolean;
    resetOnlyVisible?: boolean;
    canRemoveNotUsed?: boolean;
    allImageOptions?: ImageDef;
}

export interface Collection extends Id {
    name: string;
    imageUrl?: string[];
    images?:  Image[];
    initial?: ImageCollection[];
}

export interface Storage {
    collections: Collection[];
}
