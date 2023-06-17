import express from 'express'
import bodyParser from "body-parser"
import morgan from "morgan"
import usua from './routes/Usuario.js';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(join(__dirname, 'public'))) 

app.use(usua)

app.listen(process.env.PORT||5000)