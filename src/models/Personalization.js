const fs = require('fs');
const path = require('path');

var personalizationPath;

const personalization = {
    filename: undefined,

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