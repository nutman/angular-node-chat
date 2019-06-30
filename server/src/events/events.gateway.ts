import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import {Client, Server} from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer()
    server: Server;



    @SubscribeMessage('message')
    handleEvent(client: Client, data: any): any {
        console.log(' message data', data);
        const event = 'message';
        this.server.emit(event, data);
    }

    @SubscribeMessage('disconnect')
    identity(client: Client, data: unknown): WsResponse<unknown> {
        console.log('Client disconnected');
        const event = 'disconnect';
        return {event, data};
    }
}
