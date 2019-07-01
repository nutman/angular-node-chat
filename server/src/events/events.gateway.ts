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
    users = [];

    async handleConnection() {
        console.log('handleConnection')
        // Notify connected clients of current users
    }

    async handleDisconnect(client) {
        const event = 'notification';

        this.users = this.users.filter(function( obj ) {
            return obj.id !== client.conn.id;
        });
        this.server.emit(event, this.users);
    }

    @SubscribeMessage('message')
    handleMessage(client: Client, data: any): any {
        const event = 'message';
        this.server.emit(event, data);
    }

    @SubscribeMessage('notification')
    handleNotification(client: Client, data: any): any {
        const event = 'notification';
        if (data.action === 2) {
            this.users.map((user) => {
                if (user.name === data.content.previousUsername) {
                    user.name = data.content.username;
                }
                return user;
            });
            this.server.emit(event, this.users);
        } else {
            this.users.push({...data.from, id: client.conn.id})
            this.server.emit(event, this.users);
        }
    }

    @SubscribeMessage('disconnect')
    identity(client: Client, data: unknown): WsResponse<unknown> {
        const event = 'disconnect';
        return {event, data};
    }
}
