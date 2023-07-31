const fs = require('fs');
const path = require('path');

let clientsPath = path.join(__dirname, '../../db.json');

var personalizationPath;

const personalization = {
    filename: undefined,
    filenameClients: clientsPath,

    personalizationFound: function (clientFound) {
        let personalization = `../clients/${clientFound.client}.json`;
        personalizationPath = path.join(__dirname, personalization);
        this.filename = personalizationPath;
        return this.findAll();
    },
    getData: function () {
        return JSON.parse(fs.readFileSync(this.filename, 'utf-8'));
    },
    findAll: function () {
        return this.getData();
    },
    create: function (personalizationData) {
        let allClients = JSON.parse(fs.readFileSync(this.filenameClients, 'utf-8'));
        let clients = allClients.personalizacion.clients;
        clients.push(personalizationData);
        fs.writeFileSync(this.filenameClients, JSON.stringify(allClients, null, ' '));
        return personalizationData;
    },
    delete: function (clientFound) {
        let personalization = `../clients/${clientFound.client}.json`;
        personalizationPath = path.join(__dirname, personalization);
        fs.unlink(personalizationPath, () => {});
        return true;
    },
    update: function (personalizationData) {
        let personalizationFound = this.findAll();
        personalizationFound = personalizationData;
        fs.writeFileSync(this.filename, JSON.stringify(personalizationFound, null, ' '));
    }
}

module.exports = { personalization };