const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');

const mainRouter = require('./src/routes/main');
const clientRouter = require('./src/routes/clients');

const methodOverride =  require('method-override');
const { post } = require('./src/routes/main');
const cookieParser = require('cookie-parser');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({secret: 'secret', resave: false, saveUninitialized: false,}));
app.use(cookieParser());
app.use(cors());

app.use('/', mainRouter);
app.use('/admin', clientRouter);

app.set('view engine', 'ejs');

app.listen(3000, () => {
    console.log('server on');
});