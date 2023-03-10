const express = require('express');
const cors = require('cors');
const { usersRouter } = require('../routes/users.routes');
const { repairsRouter } = require('../routes/repairs.routes');
const { db } = require('../database/db');
const morgan = require('morgan');
const AppError = require('../utils/appError');
const { globalErrorHandler } = require('../controllers/error.controller');
const { initModel } = require('./init.model');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.paths = {
      users: '/api/v1/users',
      repairs: '/api/v1/repairs',
    };

    this.database();
    this.middlewares();
    this.routes();
  }

  database() {
    db.authenticate()
      .then(res => console.log('Database authenticated'))
      .catch(err => console.log(err));
    initModel();
    db.sync()
      .then(res => console.log('Database synced'))
      .catch(err => console.log(err));
  }

  routes() {
    this.app.use(this.paths.users, usersRouter);
    this.app.use(this.paths.repairs, repairsRouter);
    this.app.use('*', (req, res, next) => {
      return next(
        new AppError(`Can't find ${req.originalUrl} on this Server!`, 404)
      );
    });
    this.app.use(globalErrorHandler);
  }

  middlewares() {
    if (process.env.NODE_ENV === 'development') this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Puerto creado exitosamente`);
    });
  }
}

module.exports = Server;
