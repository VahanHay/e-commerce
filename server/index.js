const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const bodyParser = require('body-parser')

require('dotenv').config();
const sequelize = require('./db.js');
const model  = require('./models/models.js');
const router = require('./routes/index.js');
const errorHandle = require('./middleware/ErrorHandlingMiddleware.js')

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname,'static')))
app.use(fileUpload({}));
app.use('/api', router);

//middleware that work with error write end!!!
app.use(errorHandle)


const start = async () => {
    try{
       await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT , () => {
            console.log(`App is listening on port ${PORT}`);
        }); 
    }catch (e) {
        console.log(e); 
    } 
}
 
start();