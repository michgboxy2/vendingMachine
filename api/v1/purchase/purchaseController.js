"use strict";
const db = require('../db');

const calculateChange = (deposit, spent) => {
    const coinValues = [100, 50, 20, 10, 5];
    const coinCounts = [];
    const change = deposit - spent;

    let remainingChange = change;

    for (const value of coinValues) {
        const count = Math.floor(remainingChange / value);
        remainingChange %= value;
        coinCounts.push(count);
      }

    const coins = [];

    for (let i = 0; i < coinCounts.length; i++) {
        const count = coinCounts[i];
        const value = coinValues[i];

        coins.push(...Array(count).fill(value));
      }

      return coins;    
};

exports.makePurchase = async (req, res, next) => {
    try {
        const {productId, quantity} = req.body;

        const { user: buyer } = req;

        const user = await db.user.findOne({ where: {id: buyer.id }});

        const product = await db.product.findOne({ where: {id: productId}});

        if(!product) {
            return res.status(404).send({ message: "product does not exist", status: "failed" });
        };

        const { cost, amountAvailable, productName } = product;
        const { deposit } = user;

        if (quantity > amountAvailable) {
            return res.status(400).send({ message: "Not enough quantity available for your order", status: "failed" });
        }

        const totalPurchase = quantity * cost;

        if (deposit < totalPurchase) {
            return res.status(400).send({ message: "Insufficient balance", status: "failed" });
        }

        const quantityAvailable = amountAvailable - quantity;
        const balance = deposit - totalPurchase;
        const availableChange = calculateChange(deposit, totalPurchase);

        await db.sequelize.transaction(async (t) => {
            await product.update({ amountAvailable: quantityAvailable }, { transaction: t });
            
            await user.update({ deposit: balance }, { transaction: t });      
        });


        res.status(200).send({
            totalSpent: totalPurchase,
            product: { name: productName },
            change: availableChange
        });
        
    } catch (error) {
        return res.status(500).send({ message: "something went wrong", status: "failed" });
    }
}