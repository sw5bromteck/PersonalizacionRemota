const fs = require('fs');
const path = require('path');

const clientsPath = path.join(__dirname, '../data/clients.json');

const client = {
    filename: clientsPath,

    getData: function () {
        return JSON.parse(fs.readFileSync(this.filename, 'utf-8'));
    },

    findAll: function () {
        return this.getData();
    },
    generateId: function () {
        let allClients = this.findAll();
        let lastClient = allClients.pop();
        let assignedId;
        if(lastClient){
            assignedId = lastClient.id + 1;
        } else {
            assignedId = 1;
        }
        return assignedId;
    },
    create: function (clientData) {
        let allClients = this.findAll();
        let newClient = {
            id: this.generateId(),
            ...clientData
        }
        allClients.push(newClient);
        fs.writeFileSync(this.filename, JSON.stringify(allClients, null, ' '));
        return newClient;
    },
    delete: function (id) {
        let allClients = this.findAll();
        let finalClients = allClients.filter(client => client.id !== id);
        fs.writeFileSync(this.filename, JSON.stringify(finalClients, null, ' '));
        return true;
    },
    findByPk: function (id) {
        let allClients = this.findAll();
        let clientFound = allClients.find(client => client.id === id);
        return clientFound;
    },

    findByField: function (field, text) {
        let allClients = this.findAll();
        let clientFound = allClients.find(client => client[field] === text);
        return clientFound;
    },
}

module.exports = client;