import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { ApiResponse } from './utils/ApiResponse.js';
import NodeCache from 'node-cache';
import { simulatePrice } from './utils/simulatePrice.js';
import rateLimit from 'express-rate-limit';
import { clearOriginalPrice, getOriginalPrice } from './utils/fetchOriginalPrice.js';

const app = express();

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}))
app.use(express.json())


const cache = new NodeCache({ stdTTL: 5 });

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 6,              // limit each IP to 6 requests per windowMs
    message: new ApiResponse(429, null, "Too many requests, please try again after few seconds.")
});

let lastPrice;      // stores the last known price (real or simulated) 

app.get("/api/bnb-price", limiter, async (req, res) => {

    const cached = cache.get('bnb-price');

    if (cached) {
        return res.status(200).json(
            new ApiResponse(200, cached, "Price from cache")
        )
    }

    const originalPrice = getOriginalPrice();

    if (originalPrice) {

        res.status(200).json(
            new ApiResponse(200, originalPrice, "Initial real price fetched successfully")
        )

        cache.set('bnb-price', originalPrice);
        lastPrice = originalPrice.price;
        clearOriginalPrice();
        return;
    }

    if (lastPrice === undefined) {
        return res.status(503).json(
            new ApiResponse(503, null, "Original Price not yet initialized , try again later.")
        );
    }

    const simulatedPrice = simulatePrice(lastPrice);

    const data = {
        price: simulatedPrice,
        lastUpdated: new Date().toISOString(),
        up: simulatedPrice >= lastPrice
    }

    lastPrice = simulatedPrice;  // Comment this line if we only want simulation on OrignalPrice
    cache.set('bnb-price', data);

    res.status(200).json(
        new ApiResponse(200, data, "Simulated price fetched successfully")
    )
})

export { app };