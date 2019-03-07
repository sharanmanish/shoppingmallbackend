const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose =  require('mongoose');
const config = require('./config');
const cors = require('cors');

const app = express();

const userRoutes = require('./routes/account');

mongoose.set('useCreateIndex', true)
mongoose.connect(config.database,{ useNewUrlParser: true }, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connected to database');
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));
app.use(cors());
app.use('/api/accounts' , userRoutes);

app.listen(3030, (err) => {
  console.log('magic happens at port = ' + config.port);
});

