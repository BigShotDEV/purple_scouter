
var Cell = require('..')

describe('set', function(){
  it('should return the new value', function(){
    assert(new Cell(1).set(2) == 2)
  })

  it('should replace `value`', function(){
    var cell = new Cell(1)
    assert(cell.set(2) == 2)
    assert(cell.value == 2)
  })

  it('should notify listeners"', function(done){
    var cell = new Cell(1)
    cell.addListener(function(newValue, oldValue){
      assert(oldValue == 1)
      assert(newValue == 2)
      done()
    })
    cell.set(2)
  })

  it('should handle multiple listeners', function(){
    var cell = new Cell(1)
    var n = 1
    cell.addListener(function(){ n++ })
    cell.addListener(function(){ n++ })
    cell.set(2)
    assert(n == 3)
  })
})

describe('removeListener', function(){
  it('no listeners', function() {
    var cell = new Cell(1)
    cell.removeListener(Cell)
    assert(cell.onChange === undefined)
  })

  it('single listener', function() {
    var cell = new Cell(1)
    cell.addListener(Cell)
    cell.removeListener(Cell)
    assert(cell.onChange === undefined)
  })

  it('multiple listeners', function(){
    var cell = new Cell(1)
    cell.addListener(Cell)
    cell.addListener(Boolean)
    cell.removeListener(Cell)
    assert(cell.onChange === Boolean)
    cell.removeListener(Boolean)
    assert(cell.onChange === undefined)
  })
})
