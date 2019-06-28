import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import * as socketIo from 'socket.io-client';
import {Message} from "../../../models/message";
import {Event} from "../../../models/event";

const SERVER_URL = 'http://localhost:4000';

@Injectable()
export class SocketService {
  private socket;

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  public send(message: Message): void {
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}