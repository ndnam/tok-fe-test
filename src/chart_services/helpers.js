import apiStream from '@marcius-capital/binance-api/src/spot/stream';
import axios from 'axios';

const intervals = {
	'1': '1m',
	'3': '3m',
	'5': '5m',
	'15': '15m',
	'30': '30m',
	'60': '1h',
	'120': '2h',
	'240': '4h',
	'360': '6h',
	'480': '8h',
	'720': '12h',
	'D': '1d',
	'1D': '1d',
	'3D': '3d',
	'W': '1w',
	'1W': '1w',
	'M': '1M',
	'1M': '1M',
}

// export const getExchangeServerTime = () => api.rest.time().then(res => res.serverTime)

export const getSymbols = () => axios.get('https://api.binance.com/api/v3/exchangeInfo').then(res => res.data.symbols)

// https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data
export const getKlines = ({ symbol, interval, from, to }) => {
	interval = intervals[interval] // set interval

	from *= 1000
	to *= 1000

	return axios.get('https://api.binance.com/api/v3/klines', {
		params: { symbol: symbol.toUpperCase(), interval, startTime: from, endTime: to }
	}).then(res => res.data.map(i => ({
		time: parseFloat(i[0]),
		open: parseFloat(i[1]),
		high: parseFloat(i[2]),
		low: parseFloat(i[3]),
		close: parseFloat(i[4]),
		volume: parseFloat(i[5]),
	})))
}

export const subscribeKline = ({ symbol, interval, uniqueID }, callback) => {
	interval = intervals[interval] // set interval
	return apiStream.kline({ symbol, interval, uniqueID }, res => {
		const candle = formatKline(res.kline)
		callback(candle)
	})
}

export const unsubscribeKline = (uniqueID) => {
	return apiStream.close.kline({ uniqueID })
}

export const checkInterval = (interval) => !!intervals[interval]

// helpers ------------------------

function formatKline({ openTime, open, high, low, close, volume }) {
	return {
		time: openTime,
		open,
		high,
		low,
		close,
		volume,
	}
}
