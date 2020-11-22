import { User } from './user';

export interface ChatMessage {
    user?: User;
    message: string;
    date?: Date;
}
