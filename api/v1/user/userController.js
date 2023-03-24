"use strict";
const db = require('../db');

exports.signUp = async (req, res, next) => {
    try {
        const { username, password, role } = req.body;

        const doesUsernameExist = await db.user.findOne({where: {username}, attributes: ['username']});

        if(doesUsernameExist){
            return res.status(400).send({message: "username already exists", status: "failed"});
        }

        const user = await db.user.create({
            username,
            password,
            role
        });

        res.status(200).send(user);
        
    } catch (error) {
        return res.status(500).send({message: error, status: "failed"});
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const { limit = 20, page = 1 } = req.query;
        const offset = limit * (page - 1);
     
     
        const users = await db.user.findAndCountAll({
         attributes: ['id', 'username', 'role', 'deposit'],
         limit: Number(limit), 
         offset, 
         order: [["createdAt", "DESC"]] 
       });

       const data = {
           users: users.rows,
           count: users.count,
           pages: Math.ceil(users.count / limit )
       };

       res.status(200).send(data);

    } catch (error) {
        return res.status(500).send({message: error, status: "failed"});
    }
}

exports.getUser = async (req, res, next) => {
    try {
        const { username } = req.params;

        const user = await db.user.findOne({ 
            where: { username },
            attributes: ['id', 'username', 'role', 'deposit']
        });

        if(!user){
            return res.status(404).send({message: "user not found", status: "failed"});
        }

        res.status(200).send(user);
        
    } catch (error) {
        return res.status(500).send({message: error, status: "failed"});
    }
}


exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await db.user.findOne({ 
            where: { id },
            attributes: ['id', 'username', 'role', 'deposit']
        });

        if(!user) {
            return res.status(404).send({message: "user not found", status: "failed"});
        }

        const data = {...req.body };

        if(data.id) {
            delete data.id
        };

        await user.update(data);

        res.status(200).send(user);
        
    } catch (error) {
        return res.status(500).send({message: error, status: "failed"});
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await db.user.findOne({ 
            where: { id },
            attributes: ['id', 'username', 'role', 'deposit']
        });

        if(!user) {
            return res.status(404).send({message: "user not found", status: "failed"});
        }

        await db.user.destroy({where: {id }});

        res.status(200).send(user);
        
    } catch (error) {
        return res.status(500).send({message: error, status: "failed"});
    }
}