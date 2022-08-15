const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//Importar Routes
const authRoute = require('./routes/auth');


dotenv.config();

//connectar a db
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true},
    () => console.log('conectado a la db')
    );

//Middleware
app.use(express.json());

//Route middelware
app.use('/api/user', authRoute);

app.listen(3000, () => console.log('Sv anda'));