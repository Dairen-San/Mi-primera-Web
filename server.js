//Importaciones y configuración inicial
const express=require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app=express();
const PORT=3000;

app.get('/', (req, res) => {res.send('¡Hola! Tu servidor backend local está funcionando correctamente'); });
app.listen(PORT, () => {console.log(`Servidor corriendo en http://localhost:${PORT}`)});

// Middleware imprescindible para que express entienda datos en formato JSON enviados en el body de las peticiones(Traducción y archivos)
app.use(express.json());
app.use(express.static(__dirname));

//Datos de prueba y clave de firma/Clave secreta para firmar los tokens de sesión (en producción se guarda en variables de entorno)
const SECRET_KEY = 'clave_secreta_mi_portafolio';
//Usuario simulado (La contraseña real '123456' guardada como un hash seguro de bcrypt)
const usuarioSimulado = {email: "admin@portafolio.com",passwordHash: "$2a$10$76gXQeWpU7fK5K.0WkG2ye8eY.9z4YwX3VvM/lP8N9c1kO.hZqOae"};
//Hash generado previamente para la clave "123456"

//El procesador de login/Endpoint POST para procesar el inicio de sesión
app.post('/api/login', async (req, res) => {const {email, password} = req.body; 
//Validar si el usuario existe
if (email !== usuarioSimulado.email) {return res.status(401).json({ mensaje: "Credenciales incorrectas"});
//Comparar la contraseña ingresada contra el hash encriptado
const esCorrecta = await bcrypt.compare(password, usuarioSimulado.passwordHash); if (!esCorrecta) {return res.status(401).json({ mensaje: "Credenciales incorrectas"});}
//Generar el Token de JWT firmado si la autenticación es exitosa
const token = jwt.sign({ email: usuarioSimulado.email}, SECRET_KEY, {expiresIn: '1h' }); return res.json({mensaje: "¡Autenticación exitosa!", token: token});
}});

//Encendido del servidor
app.listen(PORT, () => {console.log(`Servidor de autenticación corriendo en http://localhost:${PORT}`);
})