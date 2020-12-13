import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { Storage } from '../../common/models/storage';
import { WsStorage } from '../../common/models/ws-storage';
import { Utils } from '../../common/utils';
import { ImageUtils } from '../../common/models/image';
import fs = require('fs');

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

        this.storage.collections.forEach(collection => {
            collection.guid = Utils.hashCode(collection.name).toString();

            collection.imageUrl.forEach(imageUrl => this.testAssetExist(imageUrl));
            collection.images?.forEach(image => this.testAssetExist(image.imageUrl));

            collection.initial?.forEach(imagesInitial => {
                imagesInitial.guid = Utils.hashCode(imagesInitial.name).toString();

                if (imagesInitial.schemaPosition && imagesInitial.allImageOptions) {
                    let imageI = 0;
                    let y = imagesInitial.schemaPosition.y;

                    for (const row of imagesInitial.schemaPosition.schema) {
                        let x = imagesInitial.schemaPosition.x;

                        for (let rowX of row) {
                            if (rowX !== ' ') {
                                imagesInitial.images[imageI].x = x;
                                imagesInitial.images[imageI].y = y;

                                imageI++;
                            }

                            x += imagesInitial.allImageOptions.width + (imagesInitial.schemaPosition?.offsetX ?? 0);
                        }

                        y += imagesInitial.allImageOptions.height + (imagesInitial.schemaPosition?.offsetY ?? 0);
                    }
                }

                imagesInitial.images.forEach(image => {
                    image.groupId = imagesInitial.guid;

                    if (imagesInitial.allImageOptions) {
                        ImageUtils.assignValueToImage(image, imagesInitial.allImageOptions);
                    }

                    this.testAssetExist(image.imageUrl);
                    if (image.imageBackUrl) {
                        this.testAssetExist(image.imageBackUrl);
                    }
                });
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

    public testAssetExist(filePath: string): void {
        const path = __dirname + '/..' + filePath.replace('/assets', '');
        if (!fs.existsSync(path)) {
            throw new Error(path + ' n\'existe pas');
        }
    }
}
