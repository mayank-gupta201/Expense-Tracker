const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const {readdirSync} = require('fs')
const app = express()

require('dotenv').config()

const PORT = process.env.PORT

const allowedOrigins = [
    'http://localhost:3000', 
    /^https:\/\/expense-tracker.*\.vercel\.app$/ 
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.some(pattern => {
            if (typeof pattern === 'string') {
                return pattern === origin;
            } else if (pattern instanceof RegExp) {
                return pattern.test(origin);
            }
            return false;
        })) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true 
};


//middlewares
app.use(express.json())
app.use(cors(corsOptions));

//routes
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)))

const server = () => {
    db()
    app.listen(PORT, () => {
        console.log('listening to port: ', PORT)
    })
}

server ()
