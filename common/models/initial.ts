import { WsStorage } from './ws-storage';
import { Storage } from './storage';

export interface Initial {
    wsStorage: WsStorage;
    storage: Storage;
}