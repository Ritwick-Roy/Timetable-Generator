import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({path:__dirname+'/../.env'});


const SERVER_PORT: string | undefined = process.env.SERVER_PORT;
const MONGO_URI: string | undefined = process.env.MONGO_URI;

if (!SERVER_PORT) {
  console.error('Server port not specified in the environment variables.');
  process.exit(1);
}

if (!MONGO_URI) {
  console.error('MongoDB URI not specified in the environment variables.');
  process.exit(1);
}

const app: express.Application = express();

app.use(cors({
  credentials:true,
}))
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(SERVER_PORT,()=>(
  console.log( `Server running on http://localhost:${SERVER_PORT}/`)
))

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI);
mongoose.connection.on('error',(error:Error) => console.log(error));