const fs = require('fs');
const path = require('path');
const { log } = require('util');

let personalizationPath = path.join(__dirname, '../../db.json');

const personalization = {
    filename: personalizationPath,

    personalizationFound: function (clientId) {
        let personalizationFound = this.findByPk(clientId);
        return personalizationFound;
    },
    getData: function () {
        return JSON.parse(fs.readFileSync(this.filename, 'utf-8'));
    },
    findAll: function () {
        return this.getData();
    },
    findByPk: function (id) {
        let allClients = this.findAll();
        let allPersonalizations = allClients.personalizacion.clients;
        let personalizationFound = allPersonalizations.find(personalization => personalization.id == id);
        return personalizationFound;
    },
    create: function (personalizationData) {
        let allClients = JSON.parse(fs.readFileSync(this.filename, 'utf-8'));
        let clients = allClients.personalizacion.clients;
        clients.push(personalizationData);
        fs.writeFileSync(this.filename, JSON.stringify(allClients, null, ' '));
        return personalizationData;
    },
    delete: function (clientFound) {
        let allClients = this.findAll();
        let allPersonalizations = allClients.personalizacion.clients;
        let personalization = `../clients/${clientFound.client}.json`;
        personalizationPath = path.join(__dirname, personalization);
        fs.unlink(personalizationPath, () => {
            let personalizationFound = this.findByPk(clientFound.id);
            allPersonalizations.splice(personalizationFound, 1);
            fs.writeFileSync(this.filename, JSON.stringify(allClients, null, ' '));
        });
        return true;
    },
    update: function (personalizationData) {
        let allClients = this.findAll();
        let allPersonalizations = allClients.personalizacion.clients;
        let personalizationFound = this.findByPk(personalizationData.id);
        Object.assign(personalizationFound, personalizationData);
        allPersonalizations[personalizationFound.id - 1] = personalizationFound;
        fs.writeFileSync(this.filename, JSON.stringify(allClients, null, ' '));
    },
}

module.exports = { personalization };