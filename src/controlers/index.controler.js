const sql = require('mssql');

import config from '../config';

const DBsettings = {
    user: config.dbUser,
    password: config.dbPassword,
    server: config.dbServer,
    database: config.dbDataBase,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 3000
    },
    options: {
        encrypt: false, 
        trustServerCertificate: true
    }
}

async function getConnection(){
    try {
        const pool = await sql.connect(DBsettings);
        // const result = await pool.request().query('SELECT 1');
        return pool;
        // console.log(result);
    } catch (err){
        console.log(err);
    }
}

const getPersonas = async (req, res)=> {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('select * from ismst_personas');
        res.json(result.recordset);
        console.log(result);
    } catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const getPersonasByID = async (req, res) => {
    const {id} = req.params;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Char, id)
            .query('select * from ismst_personas where cod = @id');
        console.log(result);
        res.json(result.recordset[0]);
    } catch(error) {
        res.status(500);
        res.send(error.message);
    }
}

const addPersonas = async (req, res) => {
    const { cod, nombre, direccion, numero, localidad, descripcion, job_id } = req.body;
    if (nombre == null || job_id == null || cod == null){
        return res.status(400).json({msg: 'error hay un campo vacio'});
    }

    try { 
        const pool = await getConnection();
        const result = await pool.request()
            .input('cod', sql.Char, cod)
            .input('nombre', sql.Char, nombre)
            .input('direccion', sql.VarChar, direccion)
            .input('numero', sql.Char, numero)
            .input('localidad', sql.Char, localidad)
            .input('descripcion', sql.Text, descripcion)
            .input('job_id', sql.Numeric, job_id)
            .query('INSERT INTO ismst_personas (cod, nombre, direccion, numero, localidad, descripcion, job_id) VALUES (@cod, @nombre, @direccion, @numero, @localidad, @descripcion, @job_id)');
    
        console.log(`usuario ${nombre} añadido cod ${cod}`);
        console.log(result.recordset);
        res.json({
            message: 'Usuario añadido',
            body: {
                cod, 
                nombre, 
                direccion, 
                numero, 
                localidad, 
                descripcion, 
                job_id
            }
        })
    } catch(error){
        res.status(500);
        res.send(error.message);
    } 
}

const deletePersona = async (req, res) => {
    const {id} = req.params;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Char, id)
            .query('delete from ismst_personas where cod = @id');
        res.json(result);
    } catch(error) {
        res.status(500);
        res.send(error.message);     
    }
}

const updatePersona = async (req, res) => {
    const { nombre, direccion, numero, localidad, descripcion } = req.body;
    const {id} = req.params;
    // if (nombre == null || job_id == null || cod == null){
    //     return res.status(400).json({msg: 'error hay un campo vacio'});
    // }

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Char, id)
            .input('nombre', sql.Char, nombre)
            .input('direccion', sql.VarChar, direccion)
            .input('numero', sql.Char, numero)
            .input('localidad', sql.Char, localidad)
            .input('descripcion', sql.Text, descripcion)
            .query('update ismst_personas set cod = @id, nombre = @nombre, direccion = @direccion, numero = @numero, localidad = @localidad, descripcion = @descripcion where cod = @id');
            console.log(`usuario ${nombre} actualizado cod ${id}`);
            console.log(result.recordset);
            res.json({
                message: 'Usuario actualizado',
                body: {
                    id, 
                    nombre, 
                    direccion, 
                    numero, 
                    localidad, 
                    descripcion
                }
            })
    } catch(error) {
        res.status(500);
        res.send(error.message);
    }
}


module.exports = {
    getConnection,
    getPersonas,
    getPersonasByID,
    addPersonas,
    deletePersona,
    updatePersona
}