"use strict"

var gBoard = []
var gMineField = []
var gWinCount = 0
var gLives = 3
var gDiff = ''
var mineCount = ''
var gIntervalID = ''
var gStartTime = ''
var gClickCount = 0
var elTimer = document.querySelector('.gameTime')
var elStart = document.querySelector('.start')
var elLives = document.querySelector('.lives')
var saves = []
//create array of blanks and mines based on difficulty (works)

// resets the game elements
function reset() {

  elStart.innerText = "😀"
  elTimer.innerText = "Time"
  gClickCount = 0
  gWinCount = 0
  gLives = 3
  elLives.innerText = `lives remaining: ${gLives}`
  clearInterval(gIntervalID)
}

function createNums(size, mines) {
  reset()
  gDiff = size
  mineCount = mines
  var setting = []
  var bomb = true
  var blanks = ''
  for (var i = 0; i < size - mines; i++) {
    setting.push(blanks)
  }
  for (var i = 0; i < mines; i++) {
    setting.push(bomb)
  }
   gMineField = setting
   createBoard(size)
   renderBoard()
 
  }


  function startGame (i,j){
    shuffle(gMineField)
    addmines(gMineField, i, j)
    checkNegs()
    renderBoardAgain(i,j)
    startTimeInterval()
    // var x = document.querySelector([`data-i data-j`])


  }

// replay the game with same settings
function replay() {
  createNums(gDiff, mineCount)
}




// creating a board matrix with gBoard (works)
function createBoard(size) {
  var board = []
  for (var i = 0; i < Math.sqrt(size); i++) {
    board.push([])
    for (var j = 0; j < Math.sqrt(size); j++) {
      board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
    }
  }
  gBoard = board
  
}

function addmines(settings,x,y) {
  var k = 0
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      gBoard[i][j].isMine = settings[k]
      k++
    }
  }
  if ( gBoard[x][y].isMine=== true){

    startGame(x,y)
  //   shuffle(gMineField)
  //   addmines(gMineField, x, y)
  }

}




//count neigbors and see if there are mines (works)
function countNeighbors(cellI, cellJ) {
  var neighborsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= gBoard[i].length) continue;
      if (gBoard[i][j].isMine === true) neighborsCount++;

    }
  }
  if (neighborsCount == 0) {
    return ''
  }
  return neighborsCount;
}


//checking negs to see if mine or activate cell neggs count (works)
function checkNegs() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].isMine === true) {
        gBoard[i][j].minesAroundCount = '🧨'
      }
      else {
        gBoard[i][j].minesAroundCount = countNeighbors(i, j)
      }

    }
  }

}



//render the board (works)
function renderBoard() {
  var strHTML = ''
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j]
      strHTML += `
          <td data-i="${i}" data-j="${j}" oncontextmenu="cellRightClicked(this, ${i}, ${j});return false" onclick="cellClicked(this, ${i}, ${j})" class="hidden" >
              ${cell.minesAroundCount}
          </td>
          `
    }
    strHTML += '</tr>'
  }
    var elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

function renderBoardAgain(x,y) {
  var strHTML = ''
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j]
      strHTML += `
          <td data-i="${i}" data-j="${j}" oncontextmenu="cellRightClicked(this, ${i}, ${j});return false" onclick="cellClicked(this, ${i}, ${j})" class="hidden" >
              ${cell.minesAroundCount}
          </td>
          `
    }
    strHTML += '</tr>'
  }
 
    var elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
   var elCell = document.querySelector(`[data-i="${x}"][data-j="${y}"]`)
  elCell.classList.remove("hidden")
  elCell.classList.add("shown")
}


//the function that activates when cell clicked (in progress)
function cellClicked(cell, i, j) {

  ++gClickCount
  if (gClickCount == 1) {
    startGame(i,j)
  }
  
  if (gBoard[i][j].isShown == false) {
    cell.classList.remove("hidden")

    if (gBoard[i][j].isShown == false && gBoard[i][j].isMine == false && gBoard[i][j].isMarked == false  && gBoard[i][j].minesAroundCount > 0) {
      gWinCount++
      cell.classList.add("shown")
      gBoard[i][j].isShown = true
    }

    else if (gBoard[i][j].isMine == true && gBoard[i][j].isShown == false && gBoard[i][j].isMarked == false) {

      cell.classList.add("boom")
      gWinCount++
      gBoard[i][j].isShown = true
      gLives--
      elLives.innerText = `lives remaining: ${gLives}`
    }
    else if (gBoard[i][j].isShown == false && gBoard[i][j].isMine == false && gBoard[i][j].isMarked == false && gBoard[i][j].minesAroundCount == 0) {
      gWinCount++
      cell.classList.add("shown")
      gBoard[i][j].isShown = true
      recursive(i,j)
    }
    if (gWinCount == gDiff) {
      win()
    }

    if (gLives == 0) {
      lose()
    }


  }

}

function cellRightClicked(cell, i, j) {

  if (gBoard[i][j].isShown == false) {
    gBoard[i][j].isMarked = (gBoard[i][j].isMarked) ? false : true
    cell.textContent = (gBoard[i][j].isMarked) ? '📍' : gBoard[i][j].minesAroundCount
    if (gBoard[i][j].isMarked && gBoard[i][j].isMine) {
      gWinCount++
    }
    else if (gBoard[i][j].isMarked == false && gBoard[i][j].isMine) {
      gWinCount--
    }

    if (gBoard[i][j].isMarked == true) {
      cell.classList.remove("hidden")
      cell.classList.add("shown")
    }
    else if (gBoard[i][j].isMarked == false) {
      cell.classList.remove("shown")
      cell.classList.add("hidden")
    }
  }
  if (gWinCount == gDiff) {
    win()
  }


}
//win the game
function win() {
  alert("you win")
  clearInterval(gIntervalID)
  elStart.innerText = "🤑"


}
// game lost
function lose() {
  alert("you lost")
  clearInterval(gIntervalID)
  elStart.innerText = "😥"
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].isMine == true) {
        gBoard[i][j].isShown = true
        var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
        elCell.classList.remove("hidden")
        elCell.classList.add("shown")
       
      }
    }
  }
}

// timer when game starts
function startTimeInterval() {
  gStartTime = Date.now() 

  gIntervalID = setInterval(function () {
    var miliSecs = Date.now() - gStartTime
    elTimer.innerText = ((miliSecs) / 1000).toFixed(3)
  }, 10)
}
//auto opening neighbors function
function recursive(cellI,cellJ){
    for (var i = cellI - 1; i <= cellI + 1; i++) {
      if (i < 0 || i >= gBoard.length) continue;
      for (var j = cellJ - 1; j <= cellJ + 1; j++) {
        if (i === cellI && j === cellJ) continue;
        if (j < 0 || j >= gBoard[i].length) continue;
        if (gBoard[i][j].isShown == false){

          var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
          cellClicked(elCell, i, j)
        }
  
      }
    }
    }
