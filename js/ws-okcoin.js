new OKCoin()
.setChannels({
    ok_sub_futureusd_btc_index: handleIndex,
    ok_sub_futureusd_btc_trade_this_week: handleTrade,
    ok_sub_futureusd_btc_trade_next_week: handleTrade,
    ok_sub_futureusd_btc_trade_quarter: handleTrade,
    ok_sub_future_btc_ticker_this_week: handleTicker,
    ok_sub_future_btc_ticker_next_week: handleTicker,
    ok_sub_future_btc_ticker_quarter: handleTicker
})
.isFutures()
.start()

var okcoin = exchanges.okcoin,
    channelToProduct = {
        this_week: okcoin.products.weeklies,
        next_week: okcoin.products.biWeeklies,
        quarter: okcoin.products.quarterlies
    }

// Index data
function handleIndex(message) {
    view.updateIndex(okcoin.name, message.data.futureIndex)
}

// Last trade data
function handleTrade(message) {
    message.data.forEach(function (trade) {
        view.update(okcoin.name, getProduct(message.channel), 'price', parseFloat(trade[1]))
    })
}

// Volume data
function handleTicker(message) {
    var volume = parseFloat(message.data.vol) / 10 // in k$
    view.updateVolume(okcoin.name, getProduct(message.channel), volume)
}

function getProduct(channel) {

    var product
    forEach(channelToProduct, function (key, value) {
        if (channel.match(new RegExp(key))) {
            product = value
        }
    })

    if (product !== undefined) {
        return product
    }
    else {
        console.log('Unknown channel: ' + channel)
    }
}
