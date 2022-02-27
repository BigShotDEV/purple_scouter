
# Cell

  A class for reifying identity inspired by clojure's `atom`

## Installation

With [packin](//github.com/jkroso/packin) `packin install jkroso/cell`

then in your app:

```js
var Cell = require('cell')
```

## API

### Cell(initialValue)

```js
var cell = new Cell(1)
cell.value // => 1
cell.addListener(function(newValue, oldValue){
  newValue // => 2
  oldValue // => 1
})
cell.set(2) // => 2
cell.value  // => 2
```
