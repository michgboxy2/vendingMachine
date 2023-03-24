require('dotenv').config();
const app = require('./server/server');

const { PORT } = process.env;


    app.listen(PORT, async () => {
        console.log(`server started on port ${PORT}`);
    });


