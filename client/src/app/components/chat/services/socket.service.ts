import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import * as socketIo from 'socket.io-client';
import {Message} from "../../../models/message";
import {Event} from "../../../models/event";
import {User} from "../../../models/user";

const SERVER_URL = 'http://localhost:4000';

@Injectable()
export class SocketService {
  private socket;

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
    this.socket.on('disconnect', (data: Message) => {
      this.socket.emit('disconnect', {});
    });

  }

  public send(message: Message): void {
    this.socket.emit('message', message);
  }

  public sendNotification(message: Message): void {
    this.socket.emit('notification', message);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => {
        return observer.next(data)
      });
    });
  }

  public onUser(): Observable<User[]> {
    return new Observable<User[]>(observer => {
      this.socket.on('notification', (data: User[]) => {
        return observer.next(data)
      });
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
