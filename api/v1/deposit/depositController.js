"use strict";
const db = require('../db');

exports.makeDeposit = async (req, res, next) => {
    try {
        const { deposit } = req.body;
        const { id } = req.user;

        const user = await db.user.findOne({ where : { id }});

        if(!user) { return res.status(404).send({ message: "user not found", status: "failed" })};

        const totalDeposit = Number(deposit) + Number(user.deposit);
        
        await user.update({ deposit: totalDeposit });

        res.status(200).send(user);
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "something went wrong", status: "failed"});
    }
}

exports.reset = async (req, res, next) => {
    try {
        const { id } = req.user;

        const user = await db.user.findOne({ where : { id }});

        if(!user) { return res.status(404).send({ message: "user not found", status: "failed" })};
        
        await user.update({ deposit: 0 });

        res.status(200).send(user);
        
    } catch (error) {
        return res.status(500).send({message: "something went wrong", status: "failed"});
    }
}