const express = require("express");
const router = express.Router();
const Denuncia = require("../models/Denuncia");
const bodyParser = require("body-parser");


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/denuncias', (req, res) => {
    res.render('../views/denuncia/denuncias');
});

// Rota POST para processar o envio de denúncias
router.post("/denuncias", (req, res) => {
    var texto = req.body.texto;
    var imagem = req.body.imagem;
    var video = req.body.video;
    Denuncia.create({
        texto: texto,
        imagem: imagem,
        video: video,
    }).then(() => {
        res.redirect("/denuncias"); // Redireciona para a página de denúncias após a criação da denúncia
    });
});
module.exports = router;