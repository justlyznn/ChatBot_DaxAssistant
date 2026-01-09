// CoinGecko API Service for cryptocurrency price data
// Free API - No API key required for basic endpoints
// Rate limit: 30 calls/minute, 10k calls/month

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export interface CoinPrice {
    [coinId: string]: {
        [currency: string]: number;
    } & {
        market_cap?: number;
        vol_24h?: number;
        change_24h?: number;
        last_updated_at?: number;
    };
}

export interface CoinMarketData {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    total_volume: number;
    price_change_percentage_24h: number;
    last_updated: string;
}

/**
 * Get current price for one or more cryptocurrencies
 * @param coinIds - Comma-separated coin IDs (e.g., 'bitcoin,ethereum')
 * @param currencies - Comma-separated currencies (e.g., 'usd,idr')
 * @param includeMarketData - Include market cap, 24h vol, 24h change
 */
export async function getCurrentPrice(
    coinIds: string,
    currencies: string = 'usd,idr',
    includeMarketData: boolean = true
): Promise<CoinPrice> {
    try {
        const params = new URLSearchParams({
            ids: coinIds.toLowerCase(),
            vs_currencies: currencies.toLowerCase(),
            include_market_cap: includeMarketData.toString(),
            include_24hr_vol: includeMarketData.toString(),
            include_24hr_change: includeMarketData.toString(),
            include_last_updated_at: 'true',
        });

        const response = await fetch(`${COINGECKO_API_BASE}/simple/price?${params}`);

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cryptocurrency prices:', error);
        throw error;
    }
}

/**
 * Get detailed market data for multiple cryptocurrencies
 * @param currency - Currency for prices (default: 'usd')
 * @param coinIds - Optional array of specific coin IDs
 * @param limit - Number of results (default: 10)
 */
export async function getMarketData(
    currency: string = 'usd',
    coinIds?: string[],
    limit: number = 10
): Promise<CoinMarketData[]> {
    try {
        const params = new URLSearchParams({
            vs_currency: currency.toLowerCase(),
            order: 'market_cap_desc',
            per_page: limit.toString(),
            page: '1',
            sparkline: 'false',
        });

        if (coinIds && coinIds.length > 0) {
            params.append('ids', coinIds.join(','));
        }

        const response = await fetch(`${COINGECKO_API_BASE}/coins/markets?${params}`);

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching market data:', error);
        throw error;
    }
}

/**
 * Search for cryptocurrency by name or symbol
 * @param query - Search query (coin name or symbol)
 */
export async function searchCoin(query: string): Promise<any> {
    try {
        const response = await fetch(`${COINGECKO_API_BASE}/search?query=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const data = await response.json();
        return data.coins || [];
    } catch (error) {
        console.error('Error searching cryptocurrency:', error);
        throw error;
    }
}

/**
 * Helper function to format price with appropriate currency symbol
 */
export function formatPrice(price: number, currency: string): string {
    const currencySymbols: { [key: string]: string } = {
        usd: '$',
        idr: 'Rp',
        eur: '€',
        gbp: '£',
        jpy: '¥',
    };

    const symbol = currencySymbols[currency.toLowerCase()] || currency.toUpperCase();

    if (currency.toLowerCase() === 'idr') {
        return `${symbol} ${price.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }

    return `${symbol}${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Helper function to format percentage change
 */
export function formatPercentage(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
}
