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

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
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

    {locations : ['00', '11', '22'],
    occupied: ['','','']},

    {locations : ['02', '11', '20'],
    occupied: ['','','']},

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
  occupied: ['','','']}
  ],

  shuffleLocations : function() {
    var gameboard = this.gameboard;
    shuffle(gameboard);

    for(let i = 0; i < gameboard.length; i += 1) {
      gameboard[i].locations = shuffle(gameboard[i].locations);
    }
  },


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
    var that = this;
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
      setTimeout(function() {
                  if(that.isWon()){
                    return false; //stops computer from marking -- end game
                  }
                  that.computerMark();
                  that.isWon();
                }, 200);
    }
    }
  },


  isBlocked : function (array) {
    if(array.indexOf("y") >= 0){
      return true;
    }
    return false
  },

  checkPriority : function (array) { // revise this function for better Ai
    var priority = 0;

    if(this.countItem(array, "y") == 2 && this.countItem(array, "x") === 0){
      priority = 100;
    }
    else if(this.countItem(array, "x") === 2 && !this.isBlocked(array)) {
      priority = 90;
    }
    else if(this.countItem(array, "y") === 1 && this.countItem(array, "x") === 0) {
      priority = 2;
    }
    else if(this.countItem(array, "x") === 1 && !this.isBlocked(array)) {
      priority = 1;
    }
    else if(this.countItem(array, "") === 0 ) {
      priority = -100;
    }
    return priority;
  },

  addPriority : function (array) {
    addPriority = 0;
    if(array.indexOf("11") >= 0 && !this.checkOccupancy("11") && !this.dubCrossed()){
       addPriority ++;
     }
     if(this.isCross(array)  && !this.dubCrossed()) {
       addPriority = addPriority + 2;
     }
    if(this.dubCrossed() && !this.isCross(array)) {
       addPriority = addPriority + 3;
     }
     return addPriority;
  },

  compLocGen : function() {
    var prioritys = [];
    var markLocation = '';
    var that = this;

    var findTopPriority = function(priList) {
      topPriority = 0;
      for(let i = 0; i < priList.length; i += 1) {
        if(priList[i] > topPriority) {
          topPriority = priList[i];
        }
      }
      return topPriority;
    };

    for (let i = 0; i < this.gameboard.length; i += 1) {
      let occupied = this.gameboard[i].occupied;
      let locations = this.gameboard[i].locations;
      let curPriority =this.checkPriority(occupied);
      let addPriority = 0;
      if(this.xHasCenter()) {
        addPriority = this.addPriority(locations);
      }
      if(locations.indexOf("11") >= 0 && !this.checkOccupancy("11") && !this.dubCrossed()){
         addPriority ++;
       }

      prioritys.push(curPriority + addPriority);
    }
    let topPriorityIndex = prioritys.indexOf(findTopPriority(prioritys));
    let locationCluster = this.gameboard[topPriorityIndex];
    console.log("priority index: " + topPriorityIndex);
    console.log("priority array: " + prioritys);
    console.log(locationCluster);

    let unmarked = function() {
      let index = locationCluster.locations.indexOf('11')
      if(index >= 0 && !that.checkOccupancy('11')) {
        return index;
      }
      return locationCluster.occupied.indexOf('');
    };
    markLocation = locationCluster.locations[unmarked()];
    console.log("compLocation: " + markLocation);
    return markLocation;
  },

  isCross(locArray) {
    var cross1 = ["00", "11", "22"];
    var cross2 = ["02", "11", "20"];
    for( i = 0; i < locArray.length; i += 1) {
      if (cross1.indexOf(locArray[i]) < 0 && cross2.indexOf(locArray[i]) < 0) {
        return false;
      }
    }
    return true;
  },

  dubCrossed : function () {
    var gameboard = this.gameboard;
    for ( let i = 0; i < gameboard.length; i += 1 ) {
      let locations =  gameboard[i].locations;
      let occupied = gameboard[i].occupied;
      if(this.isCross(locations) && occupied.indexOf("") === -1 && this.countItem(occupied, "x") > 1) {
        return true;
      }
    }
    return false;
  },

  xHasCenter : function() {
    var gameboard = this.gameboard;
    for( let i = 0; i < gameboard.length; i += 1 ) {
      let locations = gameboard[i].locations;
      let occupied = gameboard[i].occupied;
      if(locations[i] === "11" && occupied[i] === "x") {
        return true;
      }
    }
      return false;
  },

//counts occurence of "item" in array returns value
  countItem : function(array, item) {
    var count = 0;
    for (let i = 0; i < array.length; i += 1) {
      if(array[i] === item) {
        count ++;
      }
    }
    return count;
  },

  computerMark : function() {
    //computer marks a location, random right now.

    var location = model.compLocGen();

    for(let i = 0; i < model.gameboard.length; i += 1) {
      let currentCluster = model.gameboard[i];
      let index = currentCluster.locations.indexOf(location);
      if(index >= 0) {
      currentCluster.occupied[index] = "y";
    }
    }
    model.markedLocations.push(location);
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
  model.shuffleLocations();
  for (i = 0; i < model.gridSize; i += 1) {
    for(j = 0; j < model.gridSize; j += 1) {
      let cellLocation = i + "" + j;
      let cell = getE(cellLocation);
      cell.setAttribute("onclick", "model.mark(this.id)");
    }
  }
}

window.onload = init;


//console.log(model.checkPriority(['x','','y']))
