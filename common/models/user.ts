import { Id } from './id';

export interface User extends Id {
    socketId?: string;
    name: string;
}
