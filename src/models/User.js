const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');

const client = {
    filename: usersPath,

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
    findByPk: function (id) {
        let allClients = this.findAll();
        let clientFound = allClients.find(client => client.id == id);
        return clientFound;
    },
    findByField: function (field, text) {
        let allUsers = this.findAll();
        let userFound = allUsers.find(user => user[field] === text);
        return userFound;
    }
}

module.exports = client;