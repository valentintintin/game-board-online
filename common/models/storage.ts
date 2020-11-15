import { Image, ImageDef } from './image';
import { Id } from './id';

export interface ImageCollection {
    images: Image[];
    randomizeUrl?: boolean;
}

export interface Collection extends Id {
    name: string;
    imageUrl?: string[];
    images: ImageDef[];
    initial: ImageCollection[];
}

export interface Storage {
    collections: Collection[];
}
