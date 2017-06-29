function getE(id) {
  return document.getElementById(id);
}

Array.prototype.allValuesSame = function() {

    for(var i = 1; i < this.length; i++)
    {
        if(this[i] !== this[0])
            return false;
    }

    return true;
}

var view = {
  displayX : function(location) {
    var cell = getE(location);
    cell.setAttribute("class", "x_space");
  },
  displayO : function(location) {
    var cell = getE(location);
    cell.setAttribute("class", "o_space");
  },
  displayMessage : function(msg) {
    var messageArea = getE("output");
    output.innerHTML = msg;
  }
}

var model = {
  gridSize: 3,
  markedLocations : [],
  gameboard : [
    {locations : ['00', '01', '02'], //possible winning solution
     occupied: ['','','']},          // x or y value for who occupies space

   {locations : ['10', '11', '12'],
    occupied: ['','','']},

  {locations : ['20', '21', '22'],
   occupied: ['','','']},

  {locations : ['00', '10', '20'],
  occupied: ['','','']},

  {locations : ['01', '11', '21'],
  occupied: ['','','']},

  {locations : ['02', '12', '22'],
  occupied: ['','','']},

  {locations : ['00', '11', '22'],
  occupied: ['','','']},

  {locations : ['02', '11', '20'],
  occupied: ['','','']},
  ],

  checkOccupancy : function(cell) {
    for(let i = 0; i < this.gridSize; i += 1){
    if(this.markedLocations.indexOf(cell) >= 0) {
      return true; // this location is marked
    }
    else{
      return false;
    }
  }
  },

  mark : function(cell) {
    var cluster = this.gameboard;
    if(!this.checkOccupancy(cell)) {
      view.displayX(cell);
      this.markedLocations.push(cell);
      for(let i = 0; i < this.gameboard.length; i += 1) {
        let currentCluster = cluster[i];
        let index = currentCluster.locations.indexOf(cell);
        if(index >= 0){
        currentCluster.occupied[index] = "x";
      }
      }
      if(this.markedLocations.length < 8){
      setTimeout(this.computerMark(), 3000);
    }
    this.isWon();
    }
  },

  compLocGen : function() {
    var row = Math.floor(Math.random() * this.gridSize);
    var col = Math.floor(Math.random() * this.gridSize);
    return row + "" + col;
  },

  computerMark : function() {
    //computer marks a location, random right now.
    do{
      var location = this.compLocGen();
    }while(this.checkOccupancy(location));

    for(let i = 0; i < this.gameboard.length; i += 1) {
      let currentCluster = this.gameboard[i];
      let index = currentCluster.locations.indexOf(location);
      if(index >= 0) {
      currentCluster.occupied[index] = "y";
    }
    }
    this.markedLocations.push(location);
    view.displayO(location);
  },

  isWon : function() {
    for(let i = 0; i < this.gameboard.length; i += 1) {
      let currentCluster = this.gameboard[i].occupied;
      if(currentCluster.indexOf("") < 0 && currentCluster.allValuesSame() ){
        view.displayMessage("Somebody Won");
        return true;
      }
    }
    return false;
  }
}

function init() {
  for (i = 0; i < model.gridSize; i += 1) {
    for(j = 0; j < model.gridSize; j += 1) {
      let cellLocation = i + "" + j;
      let cell = getE(cellLocation);
      cell.setAttribute("onclick", "model.mark(this.id)");
    }
  }
}

window.onload = init;
