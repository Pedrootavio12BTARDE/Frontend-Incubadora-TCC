import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }
});

app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') }));
app.use(express.json());

// attach io to app for routes/controllers
app.set('io', io);

// mount routes
app.use('/api/v1', routes);

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.emit('welcome', { msg: 'connected to EcoIncubadora backend' });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
