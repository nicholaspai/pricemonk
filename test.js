const getPrice = require('./getPrice');
const moment = require('moment');

async function main() {
    try {
        const SYMBOL = 'ETH-USD';
        const DATE = '2020-01-09T00:00:00';
        console.log(`Requesting the mid-price of ${SYMBOL} @ ${DATE}`);
        let price = await getPrice(SYMBOL, DATE);
        let price_val = parseFloat(price.close);
        let price_timestamp = moment(price.time);
        console.log(`PRICE => ${price_val}, DATE => ${price_timestamp.toString()}`);
    } catch (e) {
        console.error(`ERROR:`, e);
        return;
    }
  
}
  
main();