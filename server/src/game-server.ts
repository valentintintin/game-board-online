import * as express from 'express';
import { Server } from 'http';
import * as SocketIO from 'socket.io';
import { Socket } from 'socket.io';
import { StorageService } from './storage.service';
import * as config from './config';
import { Utils } from '../../common/utils';
import { WsEvent } from '../../common/models/wsEvent';
import { Initial } from '../../common/models/initial';
import { User } from '../../common/models/user';
import { Image } from '../../common/models/image';
import { ChatMessage } from '../../common/models/chatMessage';
import { Pos } from '../../common/models/pos';
import { Pointer } from '../../common/models/pointer';

export class GameServer {
    public readonly storageService = new StorageService();

    private readonly app: express.Application = express();
    private readonly server: Server = require('http').createServer(this.app);

    private readonly io: SocketIO.Server = require('socket.io')(this.server);
    private readonly clients: SocketIO.Socket[] = [];

    constructor() {
        this.app.use(express.static('public'));
        this.app.use('/assets/collections', express.static('collections'));

        this.app.use((error, req, res, next) => {
            console.error('Error : ' + error);
            res.statusCode = 500;
            res.send(error.message);
        });

        this.app.get('*', function (req, res) {
            res.redirect('/');
        });

        // setInterval(() => this.sendAllInitialData(), 60 * 1000);

        this.server.listen(config.API_PORT, () => console.log('Ready on port ' + config.API_PORT + ' !'));

        this.io.on('connection', (socket) => {
            this.clients.push(socket);
            console.log('connect', socket.id);

            socket.on('disconnect', () => {
                console.log('disconnect', socket.id);

                let user = null;
                try {
                    user = Utils.removeBy(this.storageService.wsStorage.users, u => u.socketId === socket.id)
                } catch (e) {
                }

                if (user) {
                    this.sendAll('userEvent', {
                        name: 'delete',
                        data: user
                    } as WsEvent<User>);
                }

                Utils.removeBy(this.clients, c => c.id === socket.id);
            });

            socket.on('collectionEvent', (event: WsEvent<string>) => {
                console.log(socket.id, 'collectionEvent', event);

                if (event.name === 'delete') {
                    for (const user of this.storageService.wsStorage.users) {
                        user.shouldPlay = false;
                    }

                    this.storageService.wsStorage.currentCollectionId = null;
                    this.storageService.wsStorage.drawing.length = 0;
                    this.storageService.wsStorage.chatMessages.length = 0;
                } else {
                    const collection = Utils.getById(this.storageService.storage.collections, event.data);

                    this.storageService.wsStorage.currentCollectionId = event.data;

                    this.storageService.wsStorage.drawing.length = 0;
                    collection.initial.forEach(c => {
                        let randomImages: Image[] = null;
                        if (c.randomizeUrl) {
                            randomImages = Utils.shuffle(c.images);
                        }

                        c.images.forEach(i => {
                            const image: Image = Utils.clone(i);
                            image.guid = Utils.uuidv4();

                            if (c.randomizeUrl) {
                                const imageRandom = randomImages.pop();
                                image.imageUrl = imageRandom.imageUrl;
                                image.imageBackUrl = imageRandom.imageBackUrl;
                            }

                            this.storageService.wsStorage.drawing.push(image);
                        });
                    });
                }

                this.sendAllInitialData();
            });

            socket.on('chatEvent', (event: WsEvent<ChatMessage>) => {
                console.log(socket.id, 'chatEvent', event);

                event.data.user = Utils.getBy(this.storageService.wsStorage.users, u => u.socketId === socket.id);
                event.data.date = new Date();

                this.storageService.wsStorage.chatMessages.unshift(event.data);

                this.sendAll('chatEvent', event);
            });

            socket.on('pointerEvent', (event: WsEvent<Pos>) => {
                console.log(socket.id, 'pointerEvent', event);

                const user = Utils.getBy(this.storageService.wsStorage.users, u => u.socketId === socket.id);

                (event.data as Pointer).color = user.color;

                this.sendAll('pointerEvent', event, user.socketId);
            });

            socket.on('userEvent', (event: WsEvent<User>) => {
                console.log(socket.id, 'userEvent', event);

                if (!event.data.name?.trim() || !event.data.color?.trim()) {
                    return;
                }

                event.data.socketId = socket.id;

                switch (event.name) {
                    case 'set':
                        Utils.replaceOrAddById(this.storageService.wsStorage.users, event.data);

                        this.send(socket, 'userEvent', {
                            name: 'me',
                            data: event.data
                        });

                        setTimeout(_ => this.sendInitialData(socket), 250);
                        break;
                    case 'shouldPlay':
                        for (const user of this.storageService.wsStorage.users) {
                            const shouldPlayUser = user.guid === event.data.guid;
                            user.shouldPlay = shouldPlayUser;

                            Utils.replaceOrAddById(this.storageService.wsStorage.users, user);

                            if (shouldPlayUser && socket.id !== user.socketId) {
                                this.sendInitialDataToUser(user);
                                this.sendToUser(user, 'userEvent', {
                                    name: 'me',
                                    data: user
                                });
                            }
                        }
                        break;
                }

                this.sendUsersToAll();
            });

            socket.on('imageEvent', (event: WsEvent<Image>) => {
                console.log(socket.id, 'imageEvent', event);

                if (event.name === 'delete') {
                    try {
                        Utils.removeById(this.storageService.wsStorage.drawing, event.data.guid);
                    } catch (e) {
                    }
                } else {
                    Utils.replaceOrAddById(this.storageService.wsStorage.drawing, event.data);
                }

                this.sendAll('imageEvent', event, socket.id);
            });
        });
    }

    public sendAll(eventName, data, excludeId: string = null): void {
        for (const user of this.storageService.wsStorage.users) {
            if (user.socketId !== excludeId) {
                try {
                    this.send(Utils.getBy(this.clients, c => c.id === user.socketId), eventName, data);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }

    public sendToUser(user: User, eventName: string, data: WsEvent<any>): void {
        this.send(Utils.getBy(this.clients, c => c.id === user.socketId), eventName, data);
    }

    public send(socket: Socket, eventName: string, data: WsEvent<any>): void {
        console.log('send ' + eventName, data, socket.id);
        socket.emit(eventName, data);
    }

    public sendInitialData(socket: Socket): void {
        this.send(socket, 'allDatas', this.getInitalDataEvent());
    }

    public sendInitialDataToUser(user: User): void {
        this.sendToUser(user, 'allDatas', this.getInitalDataEvent());
    }

    public sendAllInitialData(): void {
        this.sendAll('allDatas', this.getInitalDataEvent());
    }

    public sendUsersToAll(): void {
        this.sendAll('allUsers', {
            name: 'allUsers',
            data: this.storageService.wsStorage.users
        });
    }

    public saveBeforeExit(): void {
        this.storageService.saveWsStorage();
    }

    private getInitalDataEvent(): WsEvent<Initial> {
        return {
            name: 'initial',
            data: {
                wsStorage: this.storageService.wsStorage,
                storage: this.storageService.storage
            }
        };
    }
}
