
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Empresa = require("../models/empresa"); 
const Denuncia = require("../models/Denuncia"); 
const Usuario = require("../models/Usuario"); 


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());






module.exports = router;
