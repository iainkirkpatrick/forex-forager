function inverseRate(rate) {
  return 1 / rate;
};

module.exports = function(ceilingPips, floorPips, data) {
  //quick checking of variation in month of data
  var state = {
    balance: 1000,
    lots: 10,
    positionHoldings: null,
    positionPrice: null,
    currentPrice: null,
    ceiling: ceilingPips / 10000,
    floor: floorPips / 10000,
    upCount: 0,
    downCount: 0,
    priceMovement: null,
    currentPriceStreak: 0,
    recordStreak: 0
  };
  for (var i = 0; i < data.length; i++) {
    //initial setup
    if (i === 0) {
      state.positionPrice = data[i].open;
      state.positionHoldings = state.lots * state.positionPrice;
      state.balance = state.balance - state.lots;
      //not really reflecting what i mean by this, but we are going 'long' by default
      state.priceMovement = 'ceiling';
    }

    state.currentPrice = data[i].open;

    if (state.currentPrice >= (state.positionPrice + state.ceiling)) {
      state.upCount += 1;
      if ('ceiling' !== state.priceMovement) {
        state.currentPriceStreak += 1;
      } else {


        //this process is different for longing and shorting?
        //also need a process for martingaling too...



        // //function ALL OF THIS
        // //realise our position
        // state.balance = state.balance + (state.positionHoldings * inverseRate(state.currentPrice));
        // //open a new position (turn into function)
        // state.positionHoldings = state.lots * state.currentPrice;
        // state.balance = state.balance - state.lots;
        // //reset price streak
        state.currentPriceStreak = 0;
      };
      state.priceMovement = 'ceiling';
      state.positionPrice = state.currentPrice;
    }
    if (state.currentPrice <= (state.positionPrice - state.floor)) {
      state.downCount += 1;
      if ('floor' !== state.priceMovement) {
        state.currentPriceStreak += 1;
      } else {
        // //function ALL OF THIS
        // //realise our position
        // state.balance = state.balance + (state.positionHoldings * inverseRate(state.currentPrice));
        // //open a new position (turn into function)
        // state.positionHoldings = state.lots * state.currentPrice;
        // state.balance = state.balance - state.lots;
        // //reset price streak
        state.currentPriceStreak = 0;
      };
      state.priceMovement = 'floor';
      state.positionPrice = state.currentPrice;
    }
    if (state.currentPriceStreak > state.recordStreak) {
      state.recordStreak = state.currentPriceStreak;
    }
  };

  return state;
}
