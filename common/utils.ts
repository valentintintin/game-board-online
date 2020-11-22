import { Id } from './models/id';

export class Utils {

  public static uuidv4(): string {
    function S4() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
  }

  public static hashCode(input: string): number {
    return input.split('').reduce((a,b) => {
      a = (( a << 5 ) - a) + b.charCodeAt(0);
      return a & a
    }, 0);
  }

  public static replaceOrAddById<T extends Id>(array: T[], element: T): void {
    const elementIndex = array.findIndex(d => d.guid === element.guid);

    if (elementIndex === -1) {
      array.push(element);
      return;
    }

    array[elementIndex] = element;
  }

  public static getById<T extends Id>(array: T[], id: string): T {
    const element = array.find(d => d.guid === id);

    if (!element) {
      throw new Error('Object not found with id ' + id);
    }

    return element;
  }

  public static getBy<T>(array: T[], predicate: (a: T) => boolean): T {
    const element = array.find(predicate);

    if (!element) {
      throw new Error('Object not found');
    }

    return element;
  }

  public static removeById<T extends Id>(array: T[], id: string): T {
    const elementIndex = array.findIndex(d => d.guid === id);

    if (elementIndex === -1) {
      throw new Error('Object not found with id ' + id);
    }

    return array.splice(elementIndex, 1)[0];
  }

  public static removeBy<T>(array: T[], predicate: (a: T) => boolean): T {
    const elementIndex = array.findIndex(predicate);

    if (elementIndex === -1) {
      throw new Error('Object not found');
    }

    return array.splice(elementIndex, 1)[0];
  }

  public static shuffle<T>(array: T[]): T[] {
    return array.slice().sort(() => Math.random() - 0.5);
  }

  public static randomBool(): boolean {
    return Math.random() > 0.5;
  }

  public static clone<T>(toClone: T): T {
    return JSON.parse(JSON.stringify(toClone));
  }
}
