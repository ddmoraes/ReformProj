const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();
const Usuario = require("../models/Usuario");
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

router.get('/login', (req, res) => {
    res.render('../views/usuario/login');
});

router.post('/login', async (req, res) => {
    const { matricula, senha } = req.body;

    const usuario = await Usuario.findOne({ where: { matricula } });

    if (usuario) {
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (senhaCorreta) {
            req.session.usuario = {
                matricula: usuario.matricula,
                nome: usuario.nome,
                nivel: usuario.nivel 
            };

            if (usuario.nivel === 'admin') {
                res.render('../views/usuario/home_adm');
            } else {
                res.render('../views/usuario/home_Funcionario');
            }
        } else {
            res.render('../views/usuario/login', {
                error: 'Login ou senha incorretos'
            });
        }
    } else {
        res.render('../views/usuario/login', {
            error: 'Login ou senha incorretos'
        });
    }
});

router.get("/novo", (req, res) => {
    if (req.session.usuario.nivel === 'admin') {
        res.render("usuario/novo");
    } else {
        res.redirect("usuario/login");
    }
  
});


router.post("/salvarUsuario", async (req, res) => {
  var matricula = req.body.matricula;
    var senha = req.body.senha;
    var nome = req.body.nome;
    var email = req.body.email;
    var nivel = req.body.nivel; 

    const existingUsuario = await Usuario.findOne({
        where: {
            matricula: matricula
        }
    });

    if (existingUsuario) {
        res.render("usuario/novo", {
            error: 'Erro ao criar usuário, Matrícula já Existente'
        });
    } else {
        const hashedPassword = await bcrypt.hash(senha, 10);

        Usuario.create({
             matricula: matricula,
            senha: hashedPassword,
            email: email,
            nome: nome,
            nivel: nivel 
        })
        .then(() => {
            res.render("usuario/novo", {
                success: 'Usuário Criado com Sucesso'
            });
        })
        .catch((error) => {
            console.error("Erro ao criar usuário:", error);

            res.render("usuario/novo", {
                error: 'Erro ao criar usuário, verifique os dados e tente novamente'
            });
        });
    }
});

module.exports = router;
