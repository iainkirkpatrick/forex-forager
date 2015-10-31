module.exports = function(ceilingPips, floorPips, data) {
  //quick checking of variation in month of data
  var state = {
    last: null,
    current: null,
    ceiling: ceilingPips / 10000,
    floor: floorPips / 10000,
    upCount: 0,
    downCount: 0,
    lastMovement: null,
    currentStreak: 0,
    recordStreak: 0
  };
  for (var i = 0; i < data.length; i++) {
    if (i === 0) {
      state.last = data[i].open;
    }
    state.current = data[i].open;
    if (state.current >= (state.last + state.ceiling)) {
      state.upCount += 1;
      if ('ceiling' !== state.lastMovement) {
        state.currentStreak += 1;
      } else {
        state.currentStreak = 0;
      };
      state.lastMovement = 'ceiling';
      state.last = state.current;
    }
    if (state.current <= (state.last - state.floor)) {
      state.downCount += 1;
      if ('floor' !== state.lastMovement) {
        state.currentStreak += 1;
      } else {
        state.currentStreak = 0;
      };
      state.lastMovement = 'floor';
      state.last = state.current;
    }
    if (state.currentStreak > state.recordStreak) {
      state.recordStreak = state.currentStreak;
    }
  };

  return state;
}
