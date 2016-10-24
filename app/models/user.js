

var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    firstname         : DataTypes.STRING,
    lastname          : DataTypes.STRING,
    email             : DataTypes.STRING,
    image             : DataTypes.STRING,
    password          : DataTypes.STRING,
    facebookid		   	: DataTypes.STRING,
    facebooktoken   	: DataTypes.STRING,
    facebookemail   	: DataTypes.STRING,
    facebookname    	: DataTypes.STRING

  },
  {
      classMethods: {
        generateHash: function(password) {
          return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        },
      },

      instanceMethods: {
        validPassword : function(password) {
          return bcrypt.compareSync(password, this.password);
        }
      },

      getterMethods: {
        someValue: function() {
          return this.someValue;
        }
      },
      setterMethods: {
        someValue: function(value) {
          this.someValue = value;
        }
      }

  });
}
