const Personalizacion = require('../models/Personalizacion');
const valoresEdit = require("../data/valoresEdit.json");
const fs = require('fs');
const path = require('path');

let personalizacionFilePath = path.join(__dirname, '../data/personalizacion.json');
let sections = JSON.parse(fs.readFileSync(personalizacionFilePath, 'utf-8'));

const controller = {
  
  create: function (req, res) {
    res.render('./admin/create', { name: 'create', title: 'AGREGAR' });
  },
  processCreate: function (req, res) {
        let productoAgregado = req.body;
		let unArchivo = req.file;
		let variosArchivos = req.files;
		productoAgregado.id = products.length + 1;
		if (unArchivo) {
			productoAgregado.image = [unArchivo.filename];
		} else if (variosArchivos) {
			productoAgregado.image = [];
			for (const archivo of variosArchivos) {
				productoAgregado.image.unshift(archivo.filename);
			}

      products.push(productoAgregado);
      controller.guardarEnArchivo();
      res.redirect('/');
    }
  },
  guardarEnArchivo: () => {
		let personalizacionJSON = JSON.stringify(sections);
		fs.writeFileSync(personalizacionFilePath, personalizacionJSON);
	},
  edit: function (req, res) {
    let personalizacionFound = Personalizacion.findByPk(req.params.id);

    const companies = valoresEdit.companies;
    const size = valoresEdit.size;
    const positioning = valoresEdit.positioning;
    const visibility = valoresEdit.visibility;

    res.render('./users/edit', { personalizacionFound, companies, size, positioning, visibility, name: 'edit', title : 'EDITAR' });
  },
  update: function (req, res) {
    let personalizacionFound = Personalizacion.findByPk(req.params.id);

    let client = req.body.backgroundImageSplash;
    let url = `url('http://networkbroadcast.servepics.com/Clientes/${client}/assets/tv-web-${client}/version-01/`;
    let urlSplash = `${url}splash')`;
    let urlBackground = `${url}background')`;
    let urlLogo = `${url}logo')`;


    personalizacionFound["personalizacion"][".splashPersonalizado"]["background-image"] = urlSplash;
    personalizacionFound["personalizacion"][".backgroundPersonalizado"]["background-image"] = urlBackground;
    personalizacionFound["personalizacion"][".logoPersonalizado"]["content"] = urlLogo;
    personalizacionFound["personalizacion"][".logoPersonalizado"]["width"] = req.body.widthLogo;
    personalizacionFound["personalizacion"][".contenedorLogoPersonalizado"]["justify-content"] = req.body.justifyContentContenedorLogo;
    personalizacionFound["personalizacion"][".contenedorHoraPersonalizado"]["display"] = req.body.displayContenedorHora;
    personalizacionFound["personalizacion"][".temaPersonalizado"]["color"] = req.body.colorTema;
    personalizacionFound["personalizacion"][".temaPersonalizado"]["background-color"] = req.body.backgroundColorTema;
    personalizacionFound["personalizacion"][".botonDeAnunciosPersonalizado"]["color"] = req.body.colorBotonDeAnuncios;
    personalizacionFound["personalizacion"][".botonDeAnunciosPersonalizado"]["background-color"] = req.body.backgroundColorBotonDeAnuncios;
    personalizacionFound["personalizacion"][".colorLetraAnunciosPersonalizado"]["color"] = req.body.colorLetraAnuncios;
    
    controller.guardarEnArchivo();
    res.redirect('/');
  },
  
};

module.exports = controller;
