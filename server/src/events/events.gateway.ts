import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import {Client, Server} from 'socket.io';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    users = []

    async handleConnection() {
        console.log('handleConnection')
        // Notify connected clients of current users

    }

    async handleDisconnect(client) {
        console.log('handleConnection', client.conn.id)
        // Notify connected clients of current users
        const event = 'notification';

        this.users = this.users.filter(function( obj ) {
            return obj.id !== client.conn.id;
        });

        this.server.emit(event, this.users);

    }

    @SubscribeMessage('message')
    handleMessage(client: Client, data: any): any {
        console.log(' message data', client, data);
        const event = 'message';
        this.server.emit(event, data);
    }

    @SubscribeMessage('notification')
    handleNotification(client: Client, data: any): any {
        console.log(' message data', client.conn.id, data);
        const event = 'notification';
        this.users.push({...data.from, id: client.conn.id})
        this.server.emit(event, this.users);
    }

    @SubscribeMessage('disconnect')
    identity(client: Client, data: unknown): WsResponse<unknown> {
        console.log('Client disconnected');
        const event = 'disconnect';
        return {event, data};
    }
}
