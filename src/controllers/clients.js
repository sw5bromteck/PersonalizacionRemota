const Client = require('../models/Client');
const Personalization = require('../models/Personalization');
const User = require('../models/User');
const valoresEdit = require("../data/valoresEdit.json");
const bcryptjs = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const controller = {
  /*
  register: function (req, res) {
    res.render('./users/register', { name: 'register', title : 'REGISTRARSE' });
  },
  processRegister: function (req, res) {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
          let userInDB = User.findByField('email', req.body.email);
          if (userInDB) {
              res.render('./users/register', { errors: { email: { msg: 'Este email ya está registrado' } }, old: req.body, name: 'register', title : 'REGISTRARSE' });
          } else {
              let userToCreate = {
                  ...req.body,
                  password: bcryptjs.hashSync(req.body.password, 10),
                  avatar: req.file.filename,
              };
              User.create(userToCreate);
              res.redirect('/users/login');
          }
      } else {
          res.render('./users/register', { errors: errors.mapped(), old: req.body, name: 'register', title : 'REGISTRARSE' });
      }
  },
  */
  home: function (req, res) {
    res.render('./admin/index', { name: 'clients', title: 'HOME' });
  },
  login: function (req, res) {
    res.render('./admin/login', { name: 'login', title: 'LOGIN' });
  },
  processLogin: function (req, res) {
    let userToLogin = User.findByField('email', req.body.email);
    if (userToLogin) {
      // let isCorrectThisPassword = bcryptjs.compareSync(req.body.password, userToLogin.password);
      let isCorrectThisPassword = (userToLogin.password == req.body.password) ? true : false;
      if (isCorrectThisPassword) {
        delete userToLogin.password;
        req.session.userLogged = userToLogin;
        res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 60 });
        res.redirect('/admin/home');  
      } else {
        res.render('./admin/login', { errors: { email: { msg: 'Las credenciales son inválidas' } }, name: 'login', title : 'LOGIN' });
      }
    } else {
        res.render('./admin/login', { errors: { email: { msg: 'No existe un usuario con este email' } }, old: req.body, name: 'login', title : 'LOGIN' });
    }
  },
  logout: function (req, res) {
    res.clearCookie('userEmail');
    req.session.destroy();
    res.redirect('/');
  },
  clients: function (req, res) {
		let clients = Client.findAll();
    res.render('./admin/clients', { clients, name: 'clients', title: 'CLIENTES' });
	},
  create: function (req, res) {
    res.render('./admin/create', { name: 'create', title: 'AGREGAR' });
  },
  processCreate: function (req, res) {
    let client = (req.body.company).toLowerCase();
    let clientInDb = Client.findByField('client', client);
    if (clientInDb) {
      res.render('./admin/create', { errors: { client: { msg: 'El cliente ya se encuentra registrado' } }, old: req.body, name: 'create', title : 'AGREGAR' });
    } else {
      let id = Client.generateId();
      let arrayAssets = controller.verificarAssets(client);
      let newClient = controller.createNewClient(client, req.file);
      let newPersonalization = controller.personalizationData(id, client, arrayAssets);
      const carpetaData = path.join(__dirname, '..', 'clients');

      fs.writeFile(`${carpetaData}/${client}.json`, JSON.stringify(newPersonalization), () => {
        Client.create(newClient);
        Personalization.personalization.create(newPersonalization);
        res.redirect('/admin/home');
      });
    }
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
    res.redirect('/admin/home');
  },
  delete: function (req, res) {
    let clientFound = Client.findByPk(req.params.id);
    Client.delete(req.params.id);
    Personalization.personalization.delete(clientFound);
    res.redirect('/admin/home');
  },
  verificarAssets: function (client) {
    let url = `url('http://networkbroadcast.servepics.com/Clientes/${client}/assets/tv-web-${client}/version-01/`;
    let urlSplash = `${url}splash')`;
    let urlBackground = `${url}background')`;
    let urlLogo = `${url}logo')`;
    return [urlSplash, urlBackground, urlLogo];
  },
  createNewClient: function (client, clientImage) {
    let image;
    if (clientImage) {
      image = clientImage.filename;
    } else {
      image = 'clientDefault.png';
    }
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
         "width": "20%",
         "position": "initial"
        },
        ".contenedorLogoPersonalizado": {
         "justify-content": "start"
        },
        ".contenedorHoraPersonalizado": {
         "display": "block",
        },
        ".tipografiaPersonalizado": {
          "font-family": "sans-serif",
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
    let positioningLogo = req.body.justifyContentContenedorLogo;
    let position;
    if (positioningLogo == "preview") {
      positioningLogo = "start";
      position = "relative";
    } else {
      position = "initial";
    }

    clientFound["personalization"][".splashPersonalizado"]["background-image"] = arrayAssets[0];
    clientFound["personalization"][".backgroundPersonalizado"]["background-image"] = arrayAssets[1];
    clientFound["personalization"][".logoPersonalizado"]["content"] = arrayAssets[2];
    clientFound["personalization"][".logoPersonalizado"]["width"] = req.body.widthLogo;
    clientFound["personalization"][".logoPersonalizado"]["position"] = position;
    clientFound["personalization"][".contenedorLogoPersonalizado"]["justify-content"] = positioningLogo;
    clientFound["personalization"][".contenedorHoraPersonalizado"]["display"] = req.body.displayContenedorHora;
    clientFound["personalization"][".tipografiaPersonalizado"]["font-family"] = req.body.tipografia;
    clientFound["personalization"][".temaPersonalizado"]["color"] = req.body.colorTema;
    clientFound["personalization"][".temaPersonalizado"]["background-color"] = req.body.backgroundColorTema;
    clientFound["personalization"][".botonDeAnunciosPersonalizado"]["color"] = req.body.colorBotonDeAnuncios;
    clientFound["personalization"][".botonDeAnunciosPersonalizado"]["background-color"] = req.body.backgroundColorBotonDeAnuncios;
    clientFound["personalization"][".colorLetraAnunciosPersonalizado"]["color"] = req.body.colorLetraAnuncios;
  }
};

module.exports = controller;
