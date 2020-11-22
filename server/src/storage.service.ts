import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { Storage } from '../../common/models/storage';
import { WsStorage } from '../../common/models/ws-storage';
import { Utils } from '../../common/utils';

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

        this.storage.collections.forEach(c => {
            c.guid = Utils.hashCode(c.name).toString();
            c.initial.forEach(i => {
                i.guid = Utils.hashCode(i.name).toString();
                i.images.forEach(ii => ii.groupId = i.guid);
            });
        });

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
        console.log('Sauvegarde de l\'état effectué');
    }
}
