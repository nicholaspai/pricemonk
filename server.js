const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const getPrice = require('./getPrice');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);


// Routes
app.get('/', function(req, res) {
    res.send('Price Monk Lives to Serve');
});
app.get('/price', async function(req, res) {
    if (req.query.currency && req.query.date) {
        try {
            let currency = req.query.currency.toUpperCase();
            let date = req.query.date;        
            let price = await getPrice(currency, date);
            res.json(price);        
        } catch (err) {
            res.status(500).send('Server failed to load a price');
        }
    } else {
        res.status(400).send('Invalid "currency" and "date" parameters');
    }
});

const moment = require('moment');
app.post('/price/slack', async function (req, res) {    
    if (req.body.text) {
        try {
            
            // Set currency and date based on user input
            let currency;
            let date;

            // Check for valid input
            let slackArguments = req.body.text.split(' ');
            console.log(slackArguments)
            if (!slackArguments[0]) {
                res.json({
                    response_type: "ephemeral",
                    text: 'The first argument must be the name of a cryptocurrency market, like "eth-usd" or "btc-usd"'
                });
            } else {
                currency = slackArguments[0].toUpperCase();
            }
            if (!slackArguments[1]) {
                // If missing the date argument, then set it to the current timestamp
                date = moment().format('YYYY-MM-DDTHH:mm') + ':00';
            } else {
                date = slackArguments[1];   
            }
   
            // Fetch price
            let price = await getPrice(currency, date);
            let priceVal = parseFloat(price.close);
            let priceTimestamp = moment(price.time);
            let message = (`${priceVal} @ ${priceTimestamp.toString()}`);    
            res.json({
                response_type: "in_channel", 
                // in_channel (allows everyone in channel to see) or 
                // ephemeral (only for user)
                text: message
            });      
        } catch (err) {
            console.error(`ERROR:`, err);
            res.json({
                response_type: "ephemeral",
                text: "Sorry, that didn't work. Please try again. Remember to pass exactly two arguments separated by a space after /price: a currency (e.g. eth-usd) and a date (GMT) with the special format YYYY-MM-DDTHH:mm:ss (e.g. 2020-01-09T00:00:00)"
            });
        }
    } else {
        res.json({
            response_type: "ephemeral",
            text: 'Oops. Remember to pass exactly two arguments separated by a space after /price: a currency (e.g. eth-usd) and a date (GMT) with the special format YYYY-MM-DDTHH:mm:ss (e.g. 2020-01-09T00:00:00)'
        });
    }
});

// Start server
app.listen(PORT);
console.log(`Server is listening at port ${PORT}`);