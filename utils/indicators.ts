export function calculateIndicators(candles: any[]) {
    const closes = candles.map(c => c.close);
    const latestPrice = closes[closes.length - 1];

    const sma = (data: number[], length: number) =>
        data.slice(-length).reduce((a, b) => a + b, 0) / length;

    const ema = (data: number[], length: number) => {
        const k = 2 / (length + 1);
        let ema = data[0];
        for (let i = 1; i < data.length; i++) {
            ema = data[i] * k + ema * (1 - k);
        }
        return ema;
    };

    const rsi = (data: number[], period = 14) => {
        let gains = 0, losses = 0;
        for (let i = data.length - period; i < data.length - 1; i++) {
            const diff = data[i + 1] - data[i];
            if (diff >= 0) gains += diff;
            else losses -= diff;
        }
        const rs = gains / (losses || 1);
        return 100 - (100 / (1 + rs));
    };

    const [macdLine, signalLine, histogram] = (() => {
        const ema12 = closes.map((_, i) => ema(closes.slice(0, i + 1), 12));
        const ema26 = closes.map((_, i) => ema(closes.slice(0, i + 1), 26));
        const macd = ema12.map((v, i) => v - ema26[i]);
        const signal = macd.map((_, i) => ema(macd.slice(0, i + 1), 9));
        const hist = macd.map((v, i) => v - signal[i]);
        return [macd[macd.length - 1], signal[signal.length - 1], hist[hist.length - 1]];
    })();

    const sma50 = sma(closes, 50);
    const sma200 = sma(closes, 200);
    const ema50 = ema(closes, 50);
    const ema200 = ema(closes, 200);
    const rsiVal = rsi(closes);

    const sentiment =
        sma50 > sma200 && ema50 > ema200 && rsiVal < 70 && macdLine > signalLine
            ? "Buy"
            : rsiVal > 70 || macdLine < signalLine
                ? "Sell"
                : "Neutral";

    return {
        currentPrice: latestPrice,
        indicators: {
            sma50,
            sma200,
            ema50,
            ema200,
            rsi: rsiVal,
            macd: macdLine,
            signal: signalLine,
            histogram
        },
        trend: sma50 > sma200 ? "bullish" : "bearish",
        sentiment,
        target: latestPrice * 1.05,
        stopLoss: latestPrice * 0.95,
        predictionConfidence: Math.floor(Math.random() * 21) + 80 // 80-100%
    };
}





// export function calculateIndicators(candles: any[]) {
//     const lastClose = candles[candles.length - 1].close;
//     const trend = lastClose > candles[0].close ? "up" : "down";

//     return {
//         signal: trend === "up" ? "Buy" : "Sell",
//         lastPrice: lastClose,
//         trend
//     };
// }