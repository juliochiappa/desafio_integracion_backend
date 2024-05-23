import mongoose from "mongoose";
import express from 'express';
import handlebars from 'express-handlebars';

import config from './config.js';
import initSocket from './sockets.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from './routes/views.routes.js';


const app = express();

const expressInstance = app.listen(config.PORT, async() => {
     await mongoose.connect(config.MONGODB_URI);
     console.log(`App activa en puerto ${config.PORT} conectada a bbdd ${config.SERVER}`);
});

const socketServer = initSocket(expressInstance);
app.set('socketServer', socketServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter(socketServer));
app.use('/api/products', productsRouter(socketServer));
app.use('/api/carts', cartsRouter(socketServer));


app.use('/static', express.static(`${config.DIRNAME}/public`));
    