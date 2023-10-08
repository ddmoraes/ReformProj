const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const session = require('express-session');
const Denuncia = require("../models/Denuncia");
const Empresa = require("../models/empresa");
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


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/denuncias', autenticacaoMiddleware, (req, res) => {
    res.render('../views/denuncia/denuncias');
});



router.get("/buscarDenunciaPorEmpresa", autenticacaoMiddleware, async (req, res) => {
    try {
        const empresas = await Empresa.findAll(); 
        res.render("denuncia/buscar_denuncia_por_empresa", { empresas });
    } catch (error) {
        console.error("Erro ao carregar empresas:", error);
        res.status(500).send("Erro ao carregar empresas");
    }
});

router.post("/denuncias", autenticacaoMiddleware, async (req, res) => {
    try {
        const { texto, imagem, video } = req.body;
        const empresaId = req.session.usuario.empresaId; 
        const matriculaUsuario = req.session.usuario.matricula;
        
        
        
        const empresa = await Empresa.findOne({ where: { id: empresaId } });

        if (!empresa) {
            return res.render("denuncia/denuncias", {
                error: 'Empresa não encontrada. Verifique o ID da empresa na sessão e tente novamente.'
            });
        }
 
        
        await Denuncia.create({
            texto: texto,
            imagem: imagem,
            video: video,
            empresaId: empresaId,
            matriculaUsuario: matriculaUsuario
        });

        res.render("denuncia/denuncias", {
            success: 'Denúncia enviada com sucesso'
        });
    } catch (error) {
        console.error("Erro ao criar denúncia:", error);
        res.render("denuncia/denuncias", {
            error: 'Erro ao criar denúncia, verifique os dados e tente novamente'
        });
    }
});

router.post('/buscarDenunciaPorEmpresa', autenticacaoMiddleware, async (req, res) => {
    const empresaUsuarioLogado = req.session.usuario.empresaId;
    console.log('Empresa na sessão:', empresaUsuarioLogado);

    try {
        const denuncias = await Denuncia.findAll({
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    where: {
                        empresaId: empresaUsuarioLogado,
                    },
                    required: true,
                },
            ],
        });

       
        const empresas = await Empresa.findAll();

        if (denuncias.length === 0) {
            res.render("denuncia/buscar_denuncia_por_empresa", {
                error: "Nenhuma denúncia encontrada para a sua empresa",
                empresas: empresas, 
            });
        } else {
            res.render("denuncia/resultado_pesquisa_denuncia", {
                denuncias,
                empresas: empresas, 
            });
        }
    } catch (error) {
        console.error("Erro ao buscar denúncias pela empresa do usuário:", error);
        res.status(500).json({
            error: "Erro ao buscar denúncias pela empresa do usuário",
        });
    }
});
/*SELECT u.*, e.nome AS nome_empresa
FROM usuarios u
LEFT JOIN empresas e ON u.empresaId = e.id
WHERE u.matricula = '4803';*/
module.exports = router;