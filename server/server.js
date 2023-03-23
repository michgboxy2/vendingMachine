const express = require('express'),
      cors = require('cors'),
      bps = require('body-parser');

const api = require('../api/api');
const { client} = require('../api/v1/utils/redis');

        require('../models/index');



const app = express();

app.use(cors());
app.use(bps.json());
app.use(bps.urlencoded({ extended: true}));

app.use("/api/v1", api);

client.connect();

app.use((err, req, res) => {
    return res.status(500).send(err);
});

module.exports = app;