'use script';

const Sequelize = require('sequelize');
// const db = require('../../models');
const sequelize = new Sequelize(
    process.env.DATABASE_CONNECTION_URL,
    {
        dialect: 'postgres',
        pool: {
            max: 20,
            min: 0,
            acquire: 120000,
            idle: 10000,
          },
          logging: console.log

    },
);

const db = {};

sequelize.authenticate().then(() => { console.log('database connection successful')
})
.catch(err => console.error("unable to connect to the db"));


// db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user/userModel")(sequelize, Sequelize);
db.product = require("./products/productModel")(sequelize, Sequelize);
db.session = require("./sessions/sessionModel")(sequelize, Sequelize);
db.purchase = require("./purchase/purchaseModel")(sequelize, Sequelize);
db.deposit = require("./deposit/depositModel")(sequelize, Sequelize);

db.user.hasMany(db.product, {
    as: 'seller',
    foreignKey: 'sellerId'
});
db.product.belongsTo(db.user, {
    as: 'seller',
    foreignKey: 'sellerId'
});

db.user.hasMany(db.deposit);
db.deposit.belongsTo(db.user);

db.user.hasMany(db.purchase);
db.purchase.belongsTo(db.user);

db.product.hasMany(db.purchase);
db.purchase.belongsTo(db.product);

module.exports = db;