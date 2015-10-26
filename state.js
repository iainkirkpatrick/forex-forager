const atom = require('state-atom')

module.exports = function() {
  return atom({
    currentPrice: null,
    position: null,
    floor: null,
    ceiling: null,
    graph: {
      data: atom.array([]),
      domain: atom.struct({
        x: atom.array([0,1]),
        y: atom.array([0,1])
      }),
      lineColour: 'blue'
    }
  });
}
