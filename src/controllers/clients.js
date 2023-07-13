const Client = require('../models/Client');
const valoresEdit = require("../data/valoresEdit.json");
const fs = require('fs');
const path = require('path');

let clientFilePath = path.join(__dirname, '../data/clients.json');
let sections = JSON.parse(fs.readFileSync(clientFilePath, 'utf-8'));

const controller = {
  clients: function (req, res) {
		let clients = Client.findAll();
    res.render('./admin/clients', { clients, name: 'products', title: 'CLIENTES' });
	},
  create: function (req, res) {
    res.render('./admin/create', { name: 'create', title: 'AGREGAR' });
  },
  processCreate: function (req, res) {

    let client = req.body.company;
    let image = req.file.filename;
    let arrayAssets = controller.verificarAssets(client);

    let newClient = {
      client,
      image,
      "personalizacion": {
        ".splashPersonalizado": {
         "background-image": arrayAssets[0]
        },
        ".backgroundPersonalizado": {
         "background-image": arrayAssets[1]
        },
        ".logoPersonalizado": {
         "content": arrayAssets[2],
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
         "background-color": "#000"
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

    const companies = valoresEdit.companies;
    const size = valoresEdit.size;
    const positioning = valoresEdit.positioning;
    const visibility = valoresEdit.visibility;

    res.render('./admin/edit', { clientFound, companies, size, positioning, visibility, name: 'edit', title : 'EDITAR' });
  },
  update: function (req, res) {
    let clientFound = Client.findByPk(req.params.id);
    let client = req.body.assetsPersonalizado;
    let arrayAssets = controller.verificarAssets(client);

    clientFound.personalizacion[".splashPersonalizado"]["background-image"] = arrayAssets[0];
    clientFound.personalizacion[".backgroundPersonalizado"]["background-image"] = arrayAssets[1];
    clientFound.personalizacion[".logoPersonalizado"]["content"] = arrayAssets[2];
    clientFound.personalizacion[".logoPersonalizado"]["width"] = req.body.widthLogo;
    clientFound.personalizacion[".contenedorLogoPersonalizado"]["justify-content"] = req.body.justifyContentContenedorLogo;
    clientFound.personalizacion[".contenedorHoraPersonalizado"]["display"] = req.body.displayContenedorHora;
    clientFound.personalizacion[".temaPersonalizado"]["color"] = req.body.colorTema;
    clientFound.personalizacion[".temaPersonalizado"]["background-color"] = req.body.backgroundColorTema;
    clientFound.personalizacion[".botonDeAnunciosPersonalizado"]["color"] = req.body.colorBotonDeAnuncios;
    clientFound.personalizacion[".botonDeAnunciosPersonalizado"]["background-color"] = req.body.backgroundColorBotonDeAnuncios;
    clientFound.personalizacion[".colorLetraAnunciosPersonalizado"]["color"] = req.body.colorLetraAnuncios;

    Client.update(clientFound);
    res.redirect('/');
  },
  delete: function (req, res) {
    let clientFound = req.params.id;
    Client.delete(clientFound);
    res.redirect('/');
  },
  verificarAssets: function (client) {
    let url = `url('http://networkbroadcast.servepics.com/Clientes/${client}/assets/tv-web-${client}/version-01/`;
    let urlSplash = `${url}splash')`;
    let urlBackground = `${url}background')`;
    let urlLogo = `${url}logo')`;
    return [urlSplash, urlBackground, urlLogo];
  }
};

module.exports = controller;
