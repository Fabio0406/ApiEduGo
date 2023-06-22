import { consul } from "../db.js"
import helpers from '../lib/helpers.js';

export const IniciarSP = async (req, res) => {
    try {
        const {usua,contrasena} = req.body
        const Buser = await consul.query('SELECT * FROM Usuario where usua = $1',[usua])
        if(Buser.rowCount > 0){
            if(await helpers.descriptar(contrasena,Buser.rows[0].contraseña)){
                res.status(200).json(Buser)                
            } else{
                res.status(401).json("Contraseña Incorrecta")
            }           
        }else{            
            res.status(401).json("El Usuario No Existe")
        }
        return    
    } catch (error) {
        res.send(error)
    }
}

export const refresh = async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.params)
        const {usua,ci} = req.params
        const{longitud , latitud} = req.body
        await consul.query('UPDATE Conductor SET longitud = $1 , latitud = $2  WHERE ci = $3 AND usua = $4 ',[longitud,latitud,ci,usua])
        res.status(200).json("se actualizo Ubicacion")   
    } catch (error) {
        res.send(error)
    }
}

export const estado = async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.params)
        const {usua,ci} = req.params
        const{estado} = req.body
        await consul.query('UPDATE Conductor SET estado = $1  WHERE ci = $3 AND usua = $4 ',[estado,ci,usua])
        res.status(200).json("se actualizo Estado")   
    } catch (error) {
        res.send(error)
    }
}

export const Añadir = async (req, res) => {
    try {
        const {longitud_origen, latitud_origen, longitud_destino, latitud_destino, hora, monto, conductor} = req.body
        const resp = await consul.query('INSERT INTO solicitud (longitud_origen, latitud_origen, longitud_destino, latitud_destino, hora, monto, conductor) VALUES ($1,$2,$3,$4,$5,$6,$7)',[longitud_origen, latitud_origen, longitud_destino, latitud_destino, hora, monto, conductor])
        res.status(200).json("Se Registro con exito")        
        return    
    } catch (error) {
        console.log(error)
        res.send()     
    }
}

export const solicitudes = async (req, res) => {
    try {
        const resp = await consul.query('SELECT s.id, s.longitud_origen, s.latitud_origen, s.longitud_destino, s.latitud_destino, s.hora, s.monto,c.ci, u.nombre, v.modelo FROM solicitud s, Conductor c, Usuario u, vehiculo v WHERE s.conductor = c.ci AND c.usua = u.usua AND c.ci = v.ci_conductor AND c.estado = TRUE',[longitud_origen, latitud_origen, longitud_destino, latitud_destino, hora, monto, conductor])
        res.status(200).json(resp.rows)        
        return    
    } catch (error) {
        console.log(error)
        res.send()     
    }
}

//INSERT INTO solicitud (longitud_origen, latitud_origen, longitud_destino, latitud_destino, hora, monto, conductor)VALUES (37.7749, -122.4194, 37.3352, -121.8811, '2023-06-22 10:30:00', 50.00, 123456);

export const IniciarSC = async (req, res) => {
    try {
        const {usua,contrasena} = req.body
        const Buser = await consul.query('SELECT usua,pasajero,conductor,contraseña FROM Usuario where usua = $1',[usua])
        const C = await consul.query('select * from conductor where usua = $1',[usua])
        if(Buser.rowCount > 0){
            if(Buser.rows[0].conductor == true || C.rowCount > 0){
                if(await helpers.descriptar(contrasena,Buser.rows[0].contraseña)){
                    const Resp= await consul.query('SELECT * FROM Usuario,brevet,vehiculo where Usuario.usua = $1 and brevet.numero = $2, vehiculo.ci_conductor = $3  ',[usua,C.rows[0].ci,C.rows[0].ci])
                    res.status(200).json(Resp)
                }
            } else{
                if(Buser.rows[0].pasajero == true ){
                    if(await helpers.descriptar(contrasena,Buser.rows[0].contraseña)){
                        res.status(200).json("Usuario si Esta Registrado pero como pasajero, Registre su brevet y Vehiculo para Continuar")
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
        const {usua,registro,correo,nombre,telefono,contraseña} = req.body
        const contra = await helpers.encriptar(contraseña)
        const foto = "default"
        const Buser = await consul.query('SELECT usua,pasajero,conductor FROM Usuario where usua = $1',[usua])
        if(Buser.rowCount > 0){
            if(Buser.rows[0].pasajero == true || Buser.rows[0].conductor == true){
                console.log("si pasa")
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
        console.log(error)
        res.send()     
    }
}

export const RegitrarC = async (req, res) => {
    try {
        const {usua,registro,correo,nombre,telefono,contrasena} = req.body
        const contra = await helpers.encriptar(contrasena)
        const foto = "default.jpg"
        const Buser = await consul.query('SELECT usua,pasajero,conductor FROM usuario where usua = $1',[usua])
        if(Buser.rowCount > 0){
            if(Buser.rows[0].pasajero == true && Buser.rows[0].conductor == true){
                res.status(200).json("3")   
            }
            if(Buser.rows[0].pasajero == true && Buser.rows[0].conductor == false){
                res.status(200).json("1")   
            }
            if(Buser.rows[0].pasajero == false && Buser.rows[0].conductor == true){
                res.status(200).json("0")   
            }
        }else{
            const conductor = true
            const resp = await consul.query('INSERT INTO Usuario (usua, registro, correo, nombre, telefono, contraseña, foto, conductor) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',[usua,registro,correo,nombre,telefono,contra,foto,conductor])
            res.status(200).json("2")
        }      
        return
    } catch (error) {
        res.send("Error")
    }
}

export const RegitrarB = async (req, res) => {
    try {
        const {numero,fecha_e,fecha_v,categoria,usua} = req.body
        const foto = "default.jpg"
        const Buser = await consul.query('SELECT numero FROM brevet where numero = $1',[numero])
        if(Buser.rowCount > 0){
            res.status(200).json("Ya Registrado")
        }else{
            if(fecha_e<fecha_v){
                await consul.query('INSERT INTO conductor (usua, ci) VALUES ($1 , $2)',[usua,numero])
                const resp = await consul.query('INSERT INTO brevet (numero, fecha_e, fecha_v, categoria, foto)VALUES ($1,$2,$3,$4,$5)',[usua,fecha_e,fecha_v,categoria,foto])
                res.status(200).json("Se Registro con exito")
            }else{
                res.status(200).json("Brevet vencida")
            }            
        }      
        return
    } catch (error) {
        res.send("Error")
    }
}

export const RegitrarV = async (req, res) => {
    try {
        const {placa,modelo,año,capacidad,extra,ci} = req.body
        const foto = "default.jpg"
        const Buser = await consul.query('SELECT * FROM vehiculo where placa = $1',[placa])
        if(Buser.rowCount > 0){
            res.status(200).json("Este Vehiculo esta Registrado")
        }else{
            const resp = await consul.query('INSERT INTO vehiculo (placa, modelo, año, capacidad, foto, extra, ci_conductor)VALUES ($1,$2,$3,$4,$5,$6,$7);',[placa,modelo,año,capacidad,foto,extra,ci])
            res.status(200).json("Se Registro con exito")
        }      
        return
    } catch (error) {
        res.send("Error")
    }
}