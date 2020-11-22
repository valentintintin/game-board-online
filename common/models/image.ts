import { Id } from './id';

export interface ImageDef {
    imageUrl: string;

    imageBackUrl?: string;
    showBack?: boolean;
    shouldTurnOnce?: boolean;

    width: number;
    height: number;

    rotation?: number;

    rotatable?: boolean;
    movable?: boolean;
    deletable?: boolean;
    changeIndex?: boolean;

    name?: string;
    hiddenFromOthers?: boolean;
}

export interface Image extends ImageDef, Id {
    x: number;
    y: number;

    lastUser?: string;
}

