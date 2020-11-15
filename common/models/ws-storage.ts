import { Image } from './image';
import { User } from './user';
import { ChatMessage } from './chatMessage';

export interface WsStorage {
    users: User[];
    drawing: Image[];
    chatMessages: ChatMessage[];
    currentCollectionId?: string;
}
