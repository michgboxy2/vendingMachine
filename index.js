require('dotenv').config();
const app = require('./server/server');
// const { client} = require('./api/v1/utils/redis');

const { PORT } = process.env;

app.listen(PORT, async () => {
    // await client.connect();
    console.log(`server started on port ${PORT}`);
});