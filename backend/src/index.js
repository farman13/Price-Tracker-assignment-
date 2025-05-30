import { fetchOriginalPrice } from "./utils/fetchOriginalPrice.js";
import { app } from './app.js';

fetchOriginalPrice()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(`Failed to fetch initial BNB price: ${err}`);
    })