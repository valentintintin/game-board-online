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

    groupId?: string;
}

export interface Image extends ImageDef, Id {
    x: number;
    y: number;

    lastUserId?: string;
}

