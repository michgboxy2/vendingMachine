"use strict";
const db = require('../db');
const { validationResult } = require('express-validator');


exports.createProducts = async (req, res, next) => {
    try {
        const { productName, amountAvailable, cost} = req.body;

          const { id } = req.user;
        
          const data = await db.product.create({ 
              productName, 
              sellerId: id,
              amountAvailable, 
              cost
            });

          res.status(200).send(data);
        
    } catch (error) {
        return res.status(500).send({message: "something went wrong", status: "failed"});
    }
}


exports.getAllProducts = async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const offset = limit * (page - 1);
     
    const product = await db.product.findAndCountAll({
      attributes: ['id', 'productName', 'amountAvailable', 'cost'],
      limit: Number(limit), 
      offset, 
      order: [["createdAt", "DESC"]] 
    });

    const data = {
      users: product.rows,
      count: product.count,
      pages: Math.ceil(product.count / limit )
  };

  res.status(200).send(data);
    
  } catch (error) {
    return res.status(500).send({message: "something went wrong", status: "failed"});
  }
}


exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await db.product.findOne({where: { id }});

    if(!product) {
      return res.status(404).send({message: "product not found", status: "failed"});
    }

    if(req.user.id !== product.sellerId) {
      return res.status(403).send({message: "Only seller that posted the product is allowed to update it", status: "failed"});
    }

    const data = {...req.body};

    if(data.id) {
      delete data.id;
    }

    if(data.cost && data.cost % 5 != 0) {
      return res.status(400).send({message: "cost should be in multiples of 5", status: "failed"});
    }

    await product.update(data);

    res.status(200).send(product);

  } catch (error) {
    return res.status(500).send({message: "something went wrong", status: "failed"});
  }
}


exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await db.product.findOne({where: { id }});

    if(!product) {
      return res.status(404).send({message: "product not found", status: "failed"});
    }

    if(req.user.id !== product.sellerId) {
      return res.status(403).send({message: "Only seller that posted the product is allowed to delete it", status: "failed"});
    }

    await db.product.destroy({where: { id }});

    res.send(product);

  } catch (error) {
    return res.status(500).send({message: "something went wrong", status: "failed"});
  }
}
