const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");
const bodyParser = require("body-parser");


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/login', (req, res) => {
    res.render('../views/usuario/login');
});

router.post('/login', async (req, res) => {
    const { matricula, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { matricula, senha } });

    if (usuario) {
        // Verifique se a matrícula é a matrícula específica que você deseja redirecionar
        if (usuario.matricula === 'admin') {
            res.render('../views/usuario/home_adm'); // Redirecione para a página específica
        } else {
            res.render('../views/usuario/home_Funcionario'); // Redirecione para a página padrão
        }
    } else {
        res.render('../views/usuario/erro_login'); // Redirecione para a página de erro
    }
});

router.get("/produto/novo", (req, res) => {
    res.render("usuario/novo");
});

router.post("/salvarUsuario", (req, res) => {
    var matricula = req.body.matricula;
    var senha = req.body.senha;
    var nome = req.body.nome
    var email = req.body.email
    Usuario.create({
        matricula: matricula,
        senha: senha,
        email: email,
        nome: nome
    }).then(() => {
        res.redirect("/produtos");
    });
});



module.exports = router;