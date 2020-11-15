import { Id } from './id';
import { User } from './user';

export interface ImageDef {
    imageUrl: string;

    imageBackUrl?: string;
    showBack?: boolean;

    width: number;
    height: number;

    rotation?: number;

    rotatable?: boolean;
    movable?: boolean;
    deletable?: boolean;
    changeIndex?: boolean;

    name?: string;
    hiddenFromOthers?: boolean; // todo
}

export interface Image extends ImageDef, Id {
    x: number;
    y: number;

    lastUser?: User;
}

