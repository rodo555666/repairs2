const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} = require('../controllers/users.controllers');

const { Router } = require('express');
const {
  validUserExists,
  validUserByEmail,
} = require('../middlewares/users.middlewares');
const { check } = require('express-validator');
const { validFields } = require('../middlewares/validFields');

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', validUserExists, getUserById);
router.post(
  '/',
  [
    check('name', 'Username must be mandatory').not().isEmpty(),
    check('name', 'Username must be a string').isString(),
    check('email', 'Email must be mandatory').not().isEmpty(),
    check('email', 'Email must have in a correct format').isEmail(),
    check('password', 'Password must be mandatory').not().isEmpty(),
    check('role', 'Role must be mandatory').not().isEmpty(),
    check('role', 'Role must be mandatory').isString(),
    validFields,
  ],
  validUserByEmail,
  createUser
);
router.patch('/:id', validUserExists, updateUserById);
router.delete('/:id', validUserExists, deleteUserById);

module.exports = {
  usersRouter: router,
};
