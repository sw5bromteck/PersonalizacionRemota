const Client = require('../models/Client');
const valoresEdit = require("../data/valoresEdit.json");
const fs = require('fs');
const path = require('path');

let clientFilePath = path.join(__dirname, '../data/clients.json');
let sections = JSON.parse(fs.readFileSync(clientFilePath, 'utf-8'));

const controller = {
  create: function (req, res) {
    res.render('./admin/create', { name: 'create', title: 'AGREGAR' });
  },
  processCreate: function (req, res) {

    let client = req.body.company;
    let url = `url('http://networkbroadcast.servepics.com/Clientes/${client}/assets/tv-web-${client}/version-01/`;
    let urlSplash = `${url}splash')`;
    let urlBackground = `${url}background')`;
    let urlLogo = `${url}logo')`;

    let newClient = {
      client,
      "personalizacion": {
        ".splashPersonalizado": {
         "background-image": urlSplash
        },
        ".backgroundPersonalizado": {
         "background-image": urlBackground
        },
        ".logoPersonalizado": {
         "content": urlLogo,
         "width": "20%"
        },
        ".contenedorLogoPersonalizado": {
         "justify-content": "start"
        },
        ".contenedorHoraPersonalizado": {
         "display": "block"
        },
        ".temaPersonalizado": {
         "color": "#fff",
         "background-color": "#49474c"
        },
        ".botonDeAnunciosPersonalizado": {
         "color": "#fff",
         "background-color": "#000"
        },
        ".colorLetraAnunciosPersonalizado": {
         "color": "#fff"
        }
       }
    }
    // newClient.image = req.file;
    Client.create(newClient);
    res.redirect('/');
  },
  guardarEnArchivo: () => {
		let personalizacionJSON = JSON.stringify(sections);
		fs.writeFileSync(clientFilePath, personalizacionJSON);
	},
  edit: function (req, res) {
    let clientFound = Client.findByPk(req.params.id);

    console.log(clientFound);

    const companies = valoresEdit.companies;
    const size = valoresEdit.size;
    const positioning = valoresEdit.positioning;
    const visibility = valoresEdit.visibility;

    res.send("asd");
    // res.render('./admin/edit', { clientFound, companies, size, positioning, visibility, name: 'edit', title : 'EDITAR' });
  },
  update: function (req, res) {
    let clientFound = Client.findByPk(req.params.id);

    let client = req.body.backgroundImageSplash;
    let url = `url('http://networkbroadcast.servepics.com/Clientes/${client}/assets/tv-web-${client}/version-01/`;
    let urlSplash = `${url}splash')`;
    let urlBackground = `${url}background')`;
    let urlLogo = `${url}logo')`;

    clientFound["personalizacion"][".splashPersonalizado"]["background-image"] = urlSplash;
    clientFound["personalizacion"][".backgroundPersonalizado"]["background-image"] = urlBackground;
    clientFound["personalizacion"][".logoPersonalizado"]["content"] = urlLogo;
    clientFound["personalizacion"][".logoPersonalizado"]["width"] = req.body.widthLogo;
    clientFound["personalizacion"][".contenedorLogoPersonalizado"]["justify-content"] = req.body.justifyContentContenedorLogo;
    clientFound["personalizacion"][".contenedorHoraPersonalizado"]["display"] = req.body.displayContenedorHora;
    clientFound["personalizacion"][".temaPersonalizado"]["color"] = req.body.colorTema;
    clientFound["personalizacion"][".temaPersonalizado"]["background-color"] = req.body.backgroundColorTema;
    clientFound["personalizacion"][".botonDeAnunciosPersonalizado"]["color"] = req.body.colorBotonDeAnuncios;
    clientFound["personalizacion"][".botonDeAnunciosPersonalizado"]["background-color"] = req.body.backgroundColorBotonDeAnuncios;
    clientFound["personalizacion"][".colorLetraAnunciosPersonalizado"]["color"] = req.body.colorLetraAnuncios;
    
    controller.guardarEnArchivo();
    res.redirect('/');
  },
  
};

module.exports = controller;
