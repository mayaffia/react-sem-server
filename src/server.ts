
// app.ts
import express, { Request, Response } from 'express';
//import fetch from 'node-fetch';
import { Server } from 'socket.io';
import http from 'http';
import { AddressInfo } from 'net';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT: number = Number(process.env.PORT) || 3000;
const BASE_URL: string = 'https://jsonplaceholder.typicode.com';

// Контроллер для получения всех постов
app.get('/posts', async (req: Request, res: Response) => {
    try {
        const response = await fetch(`${BASE_URL}/posts`);
        const posts = await response.json();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения данных' });
    }
});

// Контроллер для получения поста по ID
app.get('/posts/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const response = await fetch(`${BASE_URL}/posts/${id}`);
        const post = await response.json();
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения данных' });
    }
});

// WebSocket для общения пользователей
io.on('connection', (socket) => {
    console.log('Пользователь подключен');
    
    socket.on('message', (msg: string) => {
        console.log('Сообщение: ', msg);
        io.emit('message', msg); // Отправляем сообщение всем подключённым клиентам
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключен');
    });
});

server.listen(PORT, () => {
    const { port } = server.address() as AddressInfo;
    console.log(`Сервер запущен на порту ${port}`);
});
