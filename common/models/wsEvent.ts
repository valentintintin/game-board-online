export interface WsEvent<T> {
    name: string;
    data: T;
}