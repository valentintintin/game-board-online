import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { Storage } from '../../common/models/storage';
import { WsStorage } from '../../common/models/ws-storage';

export class StorageService {
    public readonly db = new JsonDB(new Config('database', true, true, '/'));
    public readonly wsDb = new JsonDB(new Config('ws-database', true, true, '/'));

    public readonly storage: Storage = this.db.getData('/');
    public readonly wsStorage: WsStorage = this.wsDb.getData('/');

    constructor() {
        if (!this.storage) {
            this.storage = {
                collections: []
            };
        }
        if (!this.storage.collections) {
            this.storage.collections = [];
        }

        if (!this.wsStorage) {
            this.wsStorage = {
                users: [],
                drawing: [],
                chatMessages: [],
                currentCollectionId: null
            };
        }
        if (!this.wsStorage.users) {
            this.wsStorage.users = [];
        }
        if (!this.wsStorage.chatMessages) {
            this.wsStorage.chatMessages = [];
        }
        if (!this.wsStorage.drawing) {
            this.wsStorage.drawing = [];
        }
    }

    public saveWsStorage(): void {
        delete this.wsStorage.users;
        this.wsDb.push('/', this.wsStorage, true);
    }
}
