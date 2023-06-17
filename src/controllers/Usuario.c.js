import { consul } from "../db.js"
import helpers from '../lib/helpers.js';

export const IniciarSP = async (req, res) => {
    try {
        const {usua,contrasena} = req.body
        const Buser = await consul.query('SELECT usua,pasajero,conductor,contraseña FROM Usuario where usua = $1',[usua])
        if(Buser.rowCount > 0){
            if(await helpers.descriptar(contrasena,Buser.rows[0].contraseña)){
                res.status(200).json("Inicia Session Pasajero")                
            } else{
                res.status(200).json("Contraseña Incorrecta")
            }           
        }else{            
            res.status(200).json("El Usuario No Existe")
        }
        return    
    } catch (error) {
        res.send(error)
    }
}

export const IniciarSC = async (req, res) => {
    try {
        const {usua,contrasena} = req.body
        const Buser = await consul.query('SELECT usua,pasajero,conductor,contraseña FROM Usuario where usua = $1',[usua])
        if(Buser.rowCount > 0){
            if(Buser.rows[0].conductor == true ){
                if(await helpers.descriptar(contrasena,Buser.rows[0].contraseña)){
                    res.status(200).json("Inicia Session Conductor")
                }
            } else{
                if(Buser.rows[0].pasajero == true ){
                    if(await helpers.descriptar(contrasena,Buser.rows[0].contraseña)){
                        res.status(200).json("Usuario si Esta Registrado pero como pasajero, Registre su Vehiculo para Continuar")
                    }else{
                        res.status(200).json("Contraseña Incorrecta")
                    }
                }
            }           
        }else{            
            res.status(200).json("El Usuario No Existe")
        }
        return    
    } catch (error) {
        res.send(error)
    }
}

export const RegitrarP = async (req, res) => {
    try {
        const {usua,registro,correo,nombre,telefono,contrasena} = req.body
        const contra = await helpers.encriptar(contrasena)
        console.log(contra)
        const foto = req.file.filename
        const Buser = await consul.query('SELECT usua,pasajero,conductor FROM Usuario where usua = $1',[usua])
        if(Buser.rowCount > 0){
            if(Buser.rows[0].pasajero == true || Buser.rows[0].conductor == true){
                res.status(200).json("Usuario ya esta registrado")                
            }            
        }else{
            const pasajero = true
            const conductor = false
            const resp = await consul.query('INSERT INTO Usuario (usua, registro, correo, nombre, telefono, contraseña, foto, pasajero, conductor) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',[usua,registro,correo,nombre,telefono,contra,foto,pasajero,conductor])
            res.status(200).json("Se Registro con exito")
        }
        return    
    } catch (error) {
        res.send(error)
    }
}

export const RegitrarC = async (req, res) => {
    try {
        const {usua,registro,correo,nombre,telefono,contrasena} = req.body
        const contra = await helpers.encriptar(contrasena)
        const foto = req.file.filename
        const Buser = await consul.query('SELECT usua,pasajero,conductor FROM usuario where usua = $1',[usua])
        if(Buser.rowCount > 0){
            if(Buser.rows[0].pasajero == true && Buser.rows[0].conductor == true){
                res.status(200).json("Usuario ya esta registrado")   
            }
            if(Buser.rows[0].pasajero == true && Buser.rows[0].conductor == false){
                res.status(200).json("Usuario ya esta registrado solo Registre sus Vehiculo y brevet")   
            }
            if(Buser.rows[0].pasajero == false && Buser.rows[0].conductor == true){
                res.status(200).json("Usuario ya esta registrado como conductor")   
            }
        }else{
            const conductor = true
            const resp = await consul.query('INSERT INTO Usuario (usua, registro, correo, nombre, telefono, contraseña, foto, conductor) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',[usua,registro,correo,nombre,telefono,contra,foto,conductor])
            res.status(200).json("Se Registro con exito")
        }      
        return
    } catch (error) {
        res.send("Error")
    }
}