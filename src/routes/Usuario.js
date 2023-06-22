import { Router } from "express"
import {Añadir, IniciarSC, IniciarSP, RegitrarB, RegitrarC, RegitrarP, RegitrarV, estado, refresh, solicitudes } from "../controllers/Usuario.c.js";
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import multer from 'multer';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, join(__dirname,'../public/images'))
    },
    filename: (req,file,cb) =>{
        const ext = file.originalname.split('.').pop()
        cb(null,`${Date.now()}.${ext}`)
    }
})

const usua = Router();
const upload = multer({storage})

usua.post('/IniciarSP',IniciarSP)
usua.post('/IniciarSC',IniciarSC)
usua.post('/RegisP',upload.single("foto"),RegitrarP)
usua.post('/RegisC',upload.single("foto"),RegitrarC)
usua.post('/RegisB',upload.single("foto"),RegitrarB)
usua.post('/RegisV',upload.single("foto"),RegitrarV)
usua.post('/posicion/:usaurio/:ci',refresh)
usua.post('/AñadirS',Añadir)
usua.get('/solicitudes',solicitudes)
usua.post('/posicion/estado/:usaurio/:ci',estado)

export default usua