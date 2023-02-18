const Repairs = require('./repairs.model');
const Users = require('./users.model');

exports.initModel = () => {
  Users.hasMany(Repairs);
  Repairs.belongsTo(Users);
};
