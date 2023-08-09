const Client = require('../models/Client');
const Personalization = require('../models/Personalization');
const valoresEdit = require("../data/valoresEdit.json");
const fs = require('fs');
const path = require('path');

const controller = {
  clients: function (req, res) {
		let clients = Client.findAll();
    res.render('./admin/clients', { clients, name: 'clients', title: 'CLIENTES' });
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
      Personalization.personalization.create(newPersonalization);
      res.redirect('/');
    });
  },
  edit: function (req, res) {
    let personalizationFound = Client.findByPk(req.params.id);
    let clientFound = controller.sendToPersonalization(personalizationFound.id);
    let company = clientFound.client;
    let clients = Client.findAll();
    const { size, positioning, visibility, typography } = valoresEdit;

    res.render('./admin/edit', { clientFound, company, clients, size, positioning, visibility, typography, name: 'edit', title : 'EDITAR' });
  },
  update: function (req, res) {
    let personalizationFound = Client.findByPk(req.params.id);
    let clientFound = controller.sendToPersonalization(personalizationFound.id);
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
    return {
      client,
      image,
    };
  },
  sendToPersonalization: function (id) {
    return Personalization.personalization.personalizationFound(id);
  },
  personalizationData: function (id, client, arrayAssets) {
    return {
      id,
      client,
      personalization: {
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
        },
        ".tipografiaPersonalizado": {
          "font-family": "sans-serif",
        }
       }
    }
  },
  personalizationUpdate: function (req, clientFound, arrayAssets) {
    clientFound["personalization"][".splashPersonalizado"]["background-image"] = arrayAssets[0];
    clientFound["personalization"][".backgroundPersonalizado"]["background-image"] = arrayAssets[1];
    clientFound["personalization"][".logoPersonalizado"]["content"] = arrayAssets[2];
    clientFound["personalization"][".logoPersonalizado"]["width"] = req.body.widthLogo;
    clientFound["personalization"][".contenedorLogoPersonalizado"]["justify-content"] = req.body.justifyContentContenedorLogo;
    clientFound["personalization"][".contenedorHoraPersonalizado"]["display"] = req.body.displayContenedorHora;
    clientFound["personalization"][".temaPersonalizado"]["color"] = req.body.colorTema;
    clientFound["personalization"][".temaPersonalizado"]["background-color"] = req.body.backgroundColorTema;
    clientFound["personalization"][".botonDeAnunciosPersonalizado"]["color"] = req.body.colorBotonDeAnuncios;
    clientFound["personalization"][".botonDeAnunciosPersonalizado"]["background-color"] = req.body.backgroundColorBotonDeAnuncios;
    clientFound["personalization"][".colorLetraAnunciosPersonalizado"]["color"] = req.body.colorLetraAnuncios;
    clientFound["personalization"][".tipografiaPersonalizado"]["font-family"] = req.body.tipografia;
  }
};

module.exports = controller;
