const { Router } = require('express');
const { check } = require('express-validator');
const {
  getMotoPendingList,
  getPendingById,
  Appointment,
  StatusRepair,
  cancelRepair,
} = require('../controllers/repairs.controllers');
const {
  validRepairById,
  validCanceledRepair,
} = require('../middlewares/repairs.middleware');
const { validUserExists } = require('../middlewares/users.middlewares');
const { validFields } = require('../middlewares/validFields');

const router = Router();

router.get('/', getMotoPendingList);
router.get('/:id', validRepairById, getPendingById);
router.post(
  '/',
  [
    check('date', 'Date must be mandatory').not().isEmpty(),
    check('userId', 'UserID must be mandatory').not().isEmpty(),
    check('userId', 'UserID must be a number').isNumeric(),
    check('motorsNumber', 'motorsNumber must be mandatory').not().isEmpty(),
    check('motorsNumber', 'motorsNumber must be ').isNumeric(),
    check('description', 'Description must be mandatory').not().isEmpty(),
    check('description', 'Description must be a string').isString(),
    validFields,
    validUserExists,
  ],
  Appointment
);
router.patch('/:id', validRepairById, StatusRepair);
router.delete('/:id', validCanceledRepair, validRepairById, cancelRepair);

module.exports = {
  repairsRouter: router,
};
