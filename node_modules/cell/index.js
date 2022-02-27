function Cell(value){
  this.value = value
  this.onChange = undefined
}

/**
 * Replace the cell's value and notify listeners
 *
 * @param {X} value
 * @return {X} value
 */

Cell.prototype.set = function(newValue){
  var oldValue = this.value
  this.value = newValue
  switch (typeof this.onChange) {
  case 'function':
    this.onChange(newValue, oldValue)
    break
  case 'object':
    var array = this.onChange
    for (var i = 0, len = array.length; i < len; i++) {
      array[i].call(this, newValue, oldValue)
    }
  }
  return newValue
}

/**
 * Set a function to be invoked whenever the value of
 * the Cell changes
 *
 * @param {Function} fn
 * @return {Function} fn
 */

Cell.prototype.addListener = function(fn){
  if (this.onChange == null) return this.onChange = fn
  if (typeof this.onChange == 'function') return this.onChange = [this.onChange, fn]
  return this.onChange = this.onChange.concat(fn)
}

/**
 * Remove a listening function
 *
 * @param {Function} fn
 */

Cell.prototype.removeListener = function(fn) {
  switch (typeof this.onChange) {
  case 'function':
    this.onChange = undefined
    break
  case 'object':
    this.onChange.splice(this.onChange.indexOf(fn), 1)
    if (this.onChange.length < 2) this.onChange = this.onChange[0]
    break
  }
}

module.exports = Cell
