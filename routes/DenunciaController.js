const express = require("express");
const router = express.Router();
const Denuncia = require("../models/Denuncia");
const bodyParser = require("body-parser");
const session = require('express-session');

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


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/denuncias', autenticacaoMiddleware, (req, res) => {
    res.render('../views/denuncia/denuncias');
});


router.post("/denuncias", autenticacaoMiddleware, (req, res) => {
    var texto = req.body.texto;
    var imagem = req.body.imagem;
    var video = req.body.video;
    Denuncia.create({
        texto: texto,
        imagem: imagem,
        video: video,
    }).then(() => {
        res.render("denuncia/denuncias", {
            success: 'Denuncia Enviada com sucesso'
        });
});
});
module.exports = router;