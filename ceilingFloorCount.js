module.exports = function(ceilingPips, floorPips, data) {
  //quick checking of variation in month of data
  var quickCheckState = {
    last: null,
    current: null,
    ceiling: ceilingPips / 10000,
    floor: floorPips / 10000,
    upCount: 0,
    downCount: 0
  };
  for (var i = 0; i < data.length; i++) {
    if (i === 0) {
      quickCheckState.last = data[i].open;
    }
    quickCheckState.current = data[i].open;
    if (quickCheckState.current >= (quickCheckState.last + quickCheckState.ceiling)) {
      quickCheckState.upCount += 1;
      quickCheckState.last = quickCheckState.current;
    }
    if (quickCheckState.current <= (quickCheckState.last - quickCheckState.floor)) {
      quickCheckState.downCount += 1;
      quickCheckState.last = quickCheckState.current;
    }
  };

  return quickCheckState;
}
