


import axios from 'axios';

function normalize(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

export async function calculateGreedFear() {
  const url = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30';
  const response = await axios.get(url);
  const data: any[] = response.data;

  const closes: number[] = data.map((d) => parseFloat(d[4]));
  const volumes: number[] = data.map((d) => parseFloat(d[5]));

  const latestClose = closes.at(-1) ?? 0;
  const previousClose = closes.at(-2) ?? 0;
  const avgClose = closes.reduce((a, b) => a + b, 0) / closes.length;
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  const latestVolume = volumes.at(-1) ?? 0;

  // Indicators
  const momentum = ((latestClose - previousClose) / previousClose) * 100;
  const volatility = Math.abs(latestClose - avgClose) / avgClose;
  const volumeSpike = latestVolume / avgVolume;

  // Normalize
  const normMomentum = normalize(momentum, -10, 10);
  const normVolatility = 100 - normalize(volatility, 0, 0.1); // lower volatility = more greed
  const normVolume = normalize(volumeSpike, 0.5, 2);

  const score = Math.round((normMomentum + normVolatility + normVolume) / 3);

  // Label
  let label: 'Extreme Fear' | 'Fear' | 'Greed' | 'Extreme Greed';
  if (score < 25) label = 'Extreme Fear';
  else if (score < 50) label = 'Fear';
  else if (score < 75) label = 'Greed';
  else label = 'Extreme Greed';

  return {
    score,
    label,
    momentum: momentum.toFixed(2),
    volatility: volatility.toFixed(4),
    volumeSpike: volumeSpike.toFixed(2),
  };
}


