const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const Usuario= require("./models/Usuario");
const UsuarioController = require("./routes/Usuariocontroller");

const Denuncia = require("./models/Denuncia");
const DenunciaController = require("./routes/DenunciaController")

app.use("/", UsuarioController);
app.use("/", DenunciaController);

connection
    .authenticate()
    .then(()=>{
        console.log("conexao feita com o db");
    })
    .catch((msgErro)=>{
        console.log(msgErro);
    })

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//EJS como view engine
app.set('view engine', 'ejs');

//definindo a pasta de arquivos estaticos
app.use(express.static('public'));

app.listen(3000, ()=>{
    console.log("app rodando");
});

app.get("/", (req, res)=>{
    res.render('index');
});

app.get("/produtos", (req, res)=>{
    Usuario.findAll({ raw : true}).then(usuario=> {
        res.render("produtoslist", {
            usuario : usuario
        });
    });
    
});

app.get("/produto/novo", (req, res)=>{
    res.render("produto");
});



