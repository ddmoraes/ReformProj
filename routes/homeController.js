const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const session = require('express-session');
const Usuario = require("../models/Usuario");

function autenticacaoMiddleware(req, res, next) {
    if (req.session && req.session.usuario) {

        next();
    } else {

        res.redirect("/login");
    }
}

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.use(session({
    secret: 'b15dbe4792f5ef037e385bfce7f91e4e9b57a6397c8ad837dcfa9a787aaece498255187c69276304f214ef024f809084203abf4a7487a022e29e007633f7fe7e',
    resave: false,
    saveUninitialized: true
}));


router.get("/home2", autenticacaoMiddleware, (req, res) => {
    res.render("../views/usuario/home_Funcionario");
});

router.get("/home1", autenticacaoMiddleware, (req, res) => {
    if (req.session.usuario.nivel === 'admin') {
        res.render("../views/usuario/home_adm");
    } else {
        res.redirect("usuario/login");
    }
  
});

module.exports = router;