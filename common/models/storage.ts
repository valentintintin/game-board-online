import { Image, ImageDef } from './image';
import { Id } from './id';

export interface ImageCollection extends Id {
    images: Image[];
    name?: string;
    randomizeUrl?: boolean;
    schemaPosition?: ImagePosition;
    canReset?: boolean;
    resetOnlyVisible?: boolean;
    canRemoveNotUsed?: boolean;
    allImageOptions?: ImageDef;
}

export interface ImagePosition {
    x: number;
    y: number;
    offsetX?: number;
    offsetY?: number;
    schema: string[]
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
