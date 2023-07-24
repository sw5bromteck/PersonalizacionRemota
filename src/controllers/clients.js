const Client = require('../models/Client');
const Personalization = require('../models/Personalization');
const valoresEdit = require("../data/valoresEdit.json");
const fs = require('fs');
const path = require('path');

const controller = {
  clients: function (req, res) {
		let clients = Client.findAll();
    res.render('./admin/clients', { clients, name: 'products', title: 'CLIENTES' });
	},
  create: function (req, res) {
    res.render('./admin/create', { name: 'create', title: 'AGREGAR' });
  },
  processCreate: function (req, res) {
    let client = (req.body.company).toLowerCase();
    let id = Client.generateId();
    let arrayAssets = controller.verificarAssets(client);
    let newClient = controller.createNewClient(client, req.file.filename);
    let newPersonalization = controller.personalizationData(id, client, arrayAssets);
    const carpetaData = path.join(__dirname, '..', 'clients');

    fs.writeFile(`${carpetaData}/${client}.json`, JSON.stringify(newPersonalization), () => {
      Client.create(newClient);
      res.redirect('/');
    });
  },
  edit: function (req, res) {
    let personalizationFound = Client.findByPk(req.params.id);
    let clientFound = controller.sendToPersonalization(personalizationFound);
    let clients = Client.findAll();
    const { size, positioning, visibility } = valoresEdit;
    res.render('./admin/edit', { clientFound, clients, size, positioning, visibility, name: 'edit', title : 'EDITAR' });
  },
  update: function (req, res) {
    let personalizationFound = Client.findByPk(req.params.id);
    let clientFound = controller.sendToPersonalization(personalizationFound);
    let arrayAssets = controller.verificarAssets(req.body.assetsPersonalizado);

    controller.personalizationUpdate(req, clientFound, arrayAssets);
    Personalization.personalization.update(clientFound);
    res.redirect('/');
  },
  delete: function (req, res) {
    let clientFound = Client.findByPk(req.params.id);
    Client.delete(req.params.id);
    Personalization.personalization.delete(clientFound);
    res.redirect('/');
  },
  verificarAssets: function (client) {
    let url = `url('http://networkbroadcast.servepics.com/Clientes/${client}/assets/tv-web-${client}/version-01/`;
    let urlSplash = `${url}splash')`;
    let urlBackground = `${url}background')`;
    let urlLogo = `${url}logo')`;
    return [urlSplash, urlBackground, urlLogo];
  },
  createNewClient: function (client, image) {
    let newClient = {
      client,
      image,
    }
    return newClient;
  },
  sendToPersonalization: function (client) {
    return Personalization.personalization.personalizationFound(client);
  },
  personalizationData: function (id, client, arrayAssets) {
    return {
      "personalizacion": {
        id,
        client,
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
  },
  personalizationUpdate: function (req, clientFound, arrayAssets) {
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
  }
};

module.exports = controller;
