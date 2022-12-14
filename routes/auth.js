const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



router.post('/register', async (req, res) => {

    //Validar data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Ver si el usuario ya esta en la db
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email ya existe');

    //Hash contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Crear nuevo usuario
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
        });
    try{
        const savedUser = await user.save()
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err)
    }
});

//Login
router.post('/login', async (req,res) => {
    //Validar data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
        //Ver si el usuario ya esta en la db
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send('Email no se encuentra');
        //Contraseña correcta
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Contraseña incorrecta');

    //Crear y asignar token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    });

module.exports = router;