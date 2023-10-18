const express = require("express");
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt')
const bodyParser = require("body-parser");
const connection = require("./database/database");





const empresaa = require("./models/empresa")
const empresa = require("./routes/empresa");
app.use("/", empresa);
const Usuario= require("./models/Usuario");
const UsuarioController = require("./routes/Usuariocontroller");

const Denuncia = require("./models/Denuncia");
const DenunciaController = require("./routes/DenunciaController");

const HomeController = require("./routes/homeController")
const MonitoramentoController = require("./routes/MonitoramentoController")



app.use(session({
    secret: 'b15dbe4792f5ef037e385bfce7f91e4e9b57a6397c8ad837dcfa9a787aaece498255187c69276304f214ef024f809084203abf4a7487a022e29e007633f7fe7esua-chave-secreta-aqui',
    resave: false,
    saveUninitialized: true,
    cookies:{
        maxAge: 180000

    }
}));

app.use("/", UsuarioController);
app.use("/", DenunciaController);
app.use("/", HomeController);
app.use("/", MonitoramentoController);



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


app.set('view engine', 'ejs');


app.use(express.static('public'));

app.listen(3000, ()=>{
    console.log("app rodando");
});




