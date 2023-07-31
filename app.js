const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');

const mainRouter = require('./src/routes/main');
const clientRouter = require('./src/routes/clients');

const methodOverride =  require('method-override');
const { post } = require('./src/routes/main');
const cookieParser = require('cookie-parser');

// const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');
// const server = jsonServer.create();
// const middlewares = jsonServer.defaults();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({secret: 'secret', resave: false, saveUninitialized: false,}));
app.use(cookieParser());
app.use(cors());

app.use('/', mainRouter);
app.use('/admin', clientRouter);

app.set('view engine', 'ejs');

// server.use(middlewares);

// const clientDataFiles = fs.readdirSync(path.join(__dirname, '/src/clients')).filter((file) => file.endsWith('.json'));

// clientDataFiles.forEach((file) => {
//     const jsonData = require(path.join(__dirname, '/src/clients', file));
//     const resourceName = path.parse(file).name;

//     server.get(`/${resourceName}`, (req, res) => {
//         res.json(jsonData);
//     });
// });

app.listen(3000, () => {
    console.log('server on');
    // server.listen(3001, () => {});
});