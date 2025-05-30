import axios from 'axios';

let originalPrice;  //stores the initial real price fetched from CMC Api

export const fetchOriginalPrice = async () => {

    try {
        const BNBPrice = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BNB', {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
            }
        })

        const data = {
            price: BNBPrice.data.data.BNB.quote.USD.price,
            lastUpdated: new Date().toISOString(),
            up: true
        }

        originalPrice = data;

    } catch (error) {
        console.error("Failed to fetch initial BNB price:", error.message);
        process.exit(1);
    }
}

export const getOriginalPrice = () => originalPrice;
export const clearOriginalPrice = () => { originalPrice = null; };