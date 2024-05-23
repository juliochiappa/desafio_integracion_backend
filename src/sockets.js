import { Server } from 'socket.io';
import messageModel from './dao/models/messages.models.js';

const initSocket = (httpServer) => {
    const io = new Server(httpServer);

    io.on('connection', async (client) => {
        console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);
        
        // Enviar historial de mensajes al cliente recién conectado
        try {
            const messages = await messageModel.find().lean();
            client.emit('chatLog', messages);
        } catch (error) {
            console.error('Error al obtener los mensajes:', error);
        }
        
        client.on('newMessage', async (data) => {
            try {
                const newMessage = new messageModel(data);
                await newMessage.save();
                console.log(`Mensaje recibido desde ${client.id}: ${data.user} ${data.message}`);
                io.emit('messageArrived', data);
            } catch (error) {
                console.error('Error al guardar el mensaje:', error);
            }
        });
    });
    return io;
}

export default initSocket;
