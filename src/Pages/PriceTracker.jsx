import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Text, Heading } from '@chakra-ui/react';

function PriceTracker() {
    const [priceDetail, setPriceDetail] = useState(null);

    async function fetchPrice() {
        try {
            const response = await axios.get('http://localhost:3000/api/bnb-price');
            setPriceDetail(response.data.data);
            // console.log(response.data.data)
        } catch (err) {
            console.error('Failed to fetch price:', err);
        }
    }

    useEffect(() => {
        fetchPrice();
        const interval = setInterval(fetchPrice, 10000); // 10s refresh

        return () => clearInterval(interval);
    }, []);

    const bgColor = priceDetail &&
        (priceDetail.up ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)')

    return (
        <Box
            p={4}
            mt={20}
            color="white"
            bg={bgColor}
            minW="200px"
        >
            <Heading as="h3" size="lg" mb={2}>BNB Price Tracker</Heading>
            {priceDetail !== null ? (
                <Text fontSize="2xl" fontFamily="mono">${priceDetail.price.toFixed(4)}</Text>
            ) : (
                <Text>Loading...</Text>
            )}
        </Box>
    );
}

export default PriceTracker;