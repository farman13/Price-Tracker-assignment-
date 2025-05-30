export const simulatePrice = (lastPrice) => {

    const percentageChange = Math.random() * 4 - 2; // -2 to +2
    const changeAmount = lastPrice * (percentageChange / 100);
    const newPrice = lastPrice + changeAmount;

    return newPrice;
}
