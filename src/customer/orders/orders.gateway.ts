import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const EVENT_NEW_ORDER = 'newOrder';
const EVENT_ORDER_UPDATE = 'orderUpdate';
const EVENT_ORDER_PICKED = 'orderPicked';

@WebSocketGateway({ namespace: 'events' }) // Ensure that the namespace is set
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private activeDeliveryAgents: Record<string, Socket> = {};
    private activeAdmins: Record<string, Socket> = {};

    // Handle new connections (for both delivery agents and admins)
    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);

        const { userType, userId } = client.handshake.query;

        if (userType === 'delivery') {
            console.log("deliveryyy");
            
            this.activeDeliveryAgents[userId as string] = client;
        } else if (userType === 'admin') {
            this.activeAdmins[userId as string] = client;
        }

        // Emit a connection event if needed (example)
        client.emit('connected', { message: 'You are connected to the events namespace!' });
    }

    // Handle disconnections
    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);

        for (const userId in this.activeDeliveryAgents) {
            if (this.activeDeliveryAgents[userId] === client) {
                delete this.activeDeliveryAgents[userId];
            }
        }

        for (const userId in this.activeAdmins) {
            if (this.activeAdmins[userId] === client) {
                delete this.activeAdmins[userId];
            }
        }
    }

    // Notify delivery agents about a new order
    notifyDeliveryAgents(order: any) {
        console.log('Notifying all delivery agents about a new order.', order);
        console.log("Active delivery agents:", this.activeDeliveryAgents); // Check if agents exist
    
        Object.values(this.activeDeliveryAgents).forEach((client) => {
            console.log(`Sending order to ${client.id}`); // Debugging
            client.emit(EVENT_NEW_ORDER, order); 
        });
    }
    // Notify admin about the order pickup
    notifyAdmin(order: any) {
        console.log('Notifying admin about order pickup.');
        Object.values(this.activeAdmins).forEach((client) => {
            client.emit(EVENT_ORDER_PICKED, order); // Emit 'orderPicked' event to admin in the events namespace
        });
    }

    // Broadcast any order update (e.g., status changes) to all connected clients in the events namespace
    sendOrderUpdate(order: any) {
        console.log(`Broadcasting order update: ${order._id}`);
        this.server.emit(EVENT_ORDER_UPDATE, order); // Emit 'orderUpdate' event to everyone in the events namespace
    }

    // Optional: You can subscribe to messages from clients as well
    @SubscribeMessage('orderUpdate')
    handleOrderUpdate(@MessageBody() data: any, client: Socket): void {
        console.log(`Received order update from ${client.id}:`, data);
        // You can implement any logic here if needed
    }
}
