const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();
const Usuario = require("../models/Usuario");
const bodyParser = require("body-parser");
const session = require('express-session');

// Middleware de Autenticação
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
    secret: 'sua_chave_secreta', // Substitua pela sua chave secreta segura
    resave: false,
    saveUninitialized: true
}));

router.get('/login', (req, res) => {
    res.render('../views/usuario/login');
});

router.post('/login', async (req, res) => {
    const { matricula, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { matricula } });

        if (usuario) {
            const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

            if (senhaCorreta) {
                req.session.usuario = {
                    matricula: usuario.matricula,
                    nome: usuario.nome,
                    nivel: usuario.nivel,
                    empresa: usuario.empresa // Adicione a empresa à sessão
                };

                if (usuario.nivel === 'admin') {
                    res.render('../views/home/home_adm');
                } else {
                    res.render('../views/home/home_Funcionario');
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
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.render('../views/usuario/login', {
            error: 'Erro ao fazer login, tente novamente mais tarde'
        });
    }
});

router.get("/novo", (req, res) => {
    res.render("usuario/novo");
});

router.post("/salvarUsuario", async (req, res) => {
    var matricula = req.body.matricula;
    var senha = req.body.senha;
    var nome = req.body.nome;
    var email = req.body.email;
    var nivel = req.body.nivel;
    var empresa = req.body.empresa;

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);

        await Usuario.create({
            matricula: matricula,
            senha: hashedPassword,
            email: email,
            nome: nome,
            nivel: nivel,
            empresa: empresa
        });

        res.render("usuario/novo", {
            success: 'Usuário Criado com Sucesso'
        });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);

        res.render("usuario/novo", {
            error: 'Erro ao criar usuário, verifique os dados e tente novamente'
        });
    }
});

router.get("/FuncionariosCadastrados", (req, res) => {
    Usuario.findAll({ raw: true }).then(usuarios => {
        res.render("usuario/FuncionariosCadastrados", {
            usuarios: usuarios // Corrija o nome da variável para 'usuarios'
        });
    });
});

router.get("/pesquisarUsuarios", (req, res) => {
    if (req.session.usuario.nivel === 'admin') {
        res.render("usuario/FuncionariosCadastrados");
    } else {
        res.redirect("usuario/login");
    }
});

router.post("/pesquisarUsuarios", autenticacaoMiddleware, async (req, res) => {
    const nomeEmpresaLogada = req.session.usuario.empresa; // Obtém a empresa do usuário logado na sessão
    const nomeEmpresaPesquisa = req.body.nomeEmpresa;

    // Verifica se a empresa da pesquisa é a mesma da empresa logada
    if (nomeEmpresaLogada !== nomeEmpresaPesquisa) {
        return res.render("usuario/FuncionariosCadastrados", {
            error: 'Você não tem permissão para pesquisar usuários de outra empresa'
        });
    }

    try {
        const usuarios = await Usuario.findAll({
            where: {
                empresa: nomeEmpresaPesquisa
            },
            raw: true
        });

        if (usuarios.length === 0) {
            res.render("usuario/FuncionariosCadastrados", {
                error: 'Nenhum usuário encontrado para a empresa especificada'
            });
        } else {
            res.render("usuario/ListaFuncionarios", {
                usuarios: usuarios
            });
        }
    } catch (error) {
        console.error("Erro ao pesquisar usuários:", error);
        res.render("usuario/FuncionariosCadastrados", {
            error: 'Erro ao pesquisar usuários, verifique os dados e tente novamente'
        });
    }
});

module.exports = router;
