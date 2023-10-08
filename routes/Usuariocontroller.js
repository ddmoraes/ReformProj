const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();
const Usuario = require("../models/Usuario");
const Empresa = require("../models/empresa"); 
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
    secret: 'sua_chave_secreta', 
    resave: false,
    saveUninitialized: true
}));

router.get('/login', (req, res) => {
    res.render('usuario/login');
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
                    
                    empresaId: usuario.empresaId, 
                };

                if (usuario.nivel === 'admin') {
                    res.render('home/home_adm');
                } else {
                    res.render('home/home_Funcionario');
                }
            } else {
                res.render('usuario/login', {
                    error: 'Login ou senha incorretos'
                });
            }
        } else {
            res.render('usuario/login', {
                error: 'Login ou senha incorretos'
            });
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.render('usuario/login', {
            error: 'Erro ao fazer login, tente novamente mais tarde'
        });
    }
});

router.get("/novo", (req, res) => {
    res.render("usuario/novo");
});

router.post("/salvarUsuario", async (req, res) => {
    const { matricula, senha, nome, email, nivel, empresaId } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);

        await Usuario.create({
            matricula,
            senha: hashedPassword,
            email,
            nome,
            nivel,
            empresaId 
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

router.get("/FuncionariosCadastrados", autenticacaoMiddleware, (req, res) => {
    Usuario.findAll({ raw: true }).then(usuarios => {
        res.render("usuario/FuncionariosCadastrados", {
            usuarios
        });
    });
});

router.get("/buscarFuncionariosPorEmpresa", autenticacaoMiddleware, async (req, res) => {
    try {
        const empresas = await Empresa.findAll(); 
        res.render("usuario/buscar_funcionarios_por_empresa", { empresas });
    } catch (error) {
        console.error("Erro ao carregar empresas:", error);
        res.status(500).send("Erro ao carregar empresas");
    }
});

router.post("/buscarFuncionariosPorEmpresa", autenticacaoMiddleware, async (req, res) => {
    const usuarioLogado = req.session.usuario;
    const empresaIdPesquisa = req.body.empresaId;

    try {
        if (usuarioLogado.nivel === "admin") {
            const empresaUsuarioLogado = await Empresa.findByPk(usuarioLogado.empresaId); 

            if (!empresaUsuarioLogado) {
                res.status(404).json({
                    error: "Empresa não encontrada para o usuário logado",
                });
                return;
            }

            if (empresaIdPesquisa !== empresaUsuarioLogado.id.toString()) {
                return res.render("usuario/buscar_funcionarios_por_empresa", {
                    error: "Você não tem permissão para pesquisar usuários de outra empresa",
                });
            }

            const funcionarios = await Usuario.findAll({
                where: {
                    empresaId: empresaIdPesquisa,
                },
                raw: true,
            });

            if (funcionarios.length === 0) {
                res.render("usuario/buscar_funcionarios_por_empresa", {
                    error: "Nenhum usuário encontrado para a empresa especificada",
                });
            } else {
                res.render("usuario/resultado_pesquisa_funcionarios", {
                    funcionarios,
                });
            }
        } else {
            res.status(403).json({
                error: "Acesso negado. Você não tem permissão de administrador.",
            });
        }
    } catch (error) {
        console.error("Erro ao pesquisar usuários:", error);
        res.render("usuario/FuncionariosCadastrados", {
            error: "Erro ao pesquisar usuários, verifique os dados e tente novamente",
        });
    }
});



module.exports = router;
