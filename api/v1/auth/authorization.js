'use strict';

const jwt = require('jsonwebtoken');

const db = require('../db');

const { createClient } = require('redis');
const rand = require('rand-token');

const moment = require('moment-timezone');

const { secret } = process.env;

const { client } = require('../utils/redis');

const createToken = async (user, sessionId, secret, expiresIn) => {
    const { id, username, role } = user;

    return jwt.sign({ id, username, role, sessionId }, secret, {expiresIn});
};

exports.authenticate = async (req, res, next) => {
    const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;

    if(!token) {
        return res.status(401).send({message: "unauthorized", status: "failed"});
    }

    try {
        const decodeToken = jwt.verify(token, process.env.secret);

        const { sessionId } = decodeToken;
        
        const checkIfSessionExists = await db.session.findOne({where: { id: sessionId, deletedAt: null}});

        if(!checkIfSessionExists) {
            return res.status(403).send({message: "please login", status: "failed"});
        }

        req.user = decodeToken;
        next();
        
    } catch (error) {
        return res.status(500).send({message: error, status: "failed"});
    }
};


exports.signIn = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if(!username) {
            return res.status(400).send({message: "username is required", status: "failed"});
        }

        if(!password) {
            return res.status(400).send({message: "password is required", status: "failed"});
        }

        const user = await db.user.findByUsername(username);

        if(!user) {
            return res.status(400).send({ message: "incorrect credentials", status: "failed" })
        }

        const isValid = await user.validatePassword(password);

        if(!isValid) {
            return res.status(400).send({ message: "incorrect credentials", status: "failed" })
        }

        const isValidSession = await db.session.findAll({ where: { userId: user.id, deletedAt: null }});
    
        if(isValidSession.length) {
            return res.status(403).send({message: "There is already an active session using your account", status: "failed"});
        }

        const refreshTokens = {};

        const session = await db.session.create({ userId: user.id, userType: user.role, username: user.username });

        const token = await createToken(user, session.id, secret, '36000m');
        const refreshToken = rand.uid(256);
        refreshTokens[refreshToken] = user.username;

        await client.set(refreshToken, JSON.stringify(refreshTokens));
        
        res.status(200).send({token, refreshToken });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error, status: "failed"});
    }
}

exports.logout = async (req, res, next) => {
    try {
        // const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;

        // const { id } = req.query;

        const { refreshToken, username } = req.body;

        if(!refreshToken) {
            return res.status(400).send({message: "refresh token is required"});
        }

        if(!username) {
            return res.status(400).send({message: "username is required"});
        }

        const refreshTokens = JSON.parse(await client.get(refreshToken));

        if(!refreshTokens){
            return res.status(400).send({message: "invalid token", status: "failed"});
        }

        if ((refreshToken in refreshTokens) && (refreshTokens[refreshToken] === username)) {
            await db.session.destroy({where: { username }});

            return res.sendStatus(200);
        }

        return res.status(400).send({message: "invalid token", status: "failed"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error, status: "failed"});
    }
}

exports.checkSeller = async (req, res, next) => {
    try {
        const {role} = req.user;

        if (role !== 'seller'){
            return res.status(401).send({message: "only sellers are allowed to perform this operation"});
        }

        next();
        
    } catch (error) {
        return res.status(500).send({message: error, status: "failed"});
    }
}

exports.checkBuyer = async (req, res, next) => {
    try {
        const {role} = req.user;

        if (role !== 'buyer'){
            return res.status(401).send({message: "only buyers are allowed to perform this operation"});
        }

        next();
        
    } catch (error) {
        return res.status(500).send({message: error, status: "failed"});
    }
}