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
    secret: 'sua-chave-secreta-aqui',
    resave: false,
    saveUninitialized: true
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




