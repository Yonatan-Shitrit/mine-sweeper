
//print a matrix 
function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < mat[0].length; j++) {
        var cell = mat[i][j];
        var className = 'cell cell' + i + '-' + j;
        strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
  }
  
  // location such as: {i: 2, j: 7}
  function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
  }
  

  // get a random int betwiin 2 nums
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



//shuffle an array
function shuffle(gBoard) {
  var randIdx, keep;
  for (var i = gBoard.length - 1; i >= 0; i--) {
      // randIdx = getRandomInt(0, items.length);
      randIdx = getRandomInt(0, i + 1);

      keep = gBoard[i];
      gBoard[i] = gBoard[randIdx];
      gBoard[randIdx] = keep;
  }
  return gBoard;
}



