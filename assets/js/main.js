// SELECT THE CONTAINER FROM THE DOM
const containerElement = document.querySelector(".container");

// SELECT THE LEVEL SELECTOR FROM THE DOM
const levelSelectorElement = document.querySelector("#level");

// SELECT THE PLAY BUTTON FROM THE DOM
const playButton = document.querySelector("#game_options > button");

// CREATE A SCORE COUNTER
let score = 0;

// STARTS A NEW GAME WHEN A CLICK ON THE PLAY BUTTON OCCURS
playButton.addEventListener("click", function() {

  // GETS THE NUMBER OF CELLS
  const cellsNumber = setCellsNumber(levelSelectorElement);

  // CREATES THE GRID
  createNewGrid(cellsNumber, containerElement);

  // GETS THE INSERTED CELLS
  const insertedCells = document.querySelectorAll(".cell");

});

// <---------- FUNCTIONS ---------->

// FUNCTION TO EXTRACT THE NUMBER OF CELLS NEEDED
function setCellsNumber(selectorElement) {
  let cells = 225;
  switch (selectorElement.value) {
    case "hard":
      cells = 100;
      break;
    case "medium":
      cells = 81;
      break;
    case "easy":
      cells = 49;
      break;
  }
  return cells;
}

// FUNCTION TO EMPTY THE CONTAINER AND CREATE THE GRID OF CELLS
function createNewGrid(totalCells, container) {
  
  // EMPTY THE CONTAINER
  container.innerHTML = "";

  // CALCULATE HOW MANY CELLS PER ROW
  const cellsPerRow = Math.sqrt(totalCells);

  // CREATES CELLS, ADD THE CELL CLASS, SET THE DIMENSION, INSERT THE INDEX NUMBER AND ADDS TO THE DOM
  for (let i = 1; i <= totalCells; i++) {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");

    // SETS THE DIMENSIONS DINAMICALLY TO MAKE THE GRID RESPONSIVE ALSO
    cellElement.style.height = `min(calc(100% / ${cellsPerRow}), (96vw / ${cellsPerRow}))`;
    containerElement.insertAdjacentElement("beforeend", cellElement);
  }
}





// HERE START THE EXPERIMENTAL IMPLEMENTATION

// div that outputs the number of remaining bombs
const remainingBombs = document.createElement("div");

playButton.addEventListener("click", function () {
  console.clear();
  score = 0;

  // CREATE A CHECKER TO SEE IF A BOMB IS FOUND. I NEED IT TO AVOID "YOU WIN" OUTPUT AFTER "YOU LOOSE", IF LOOSING ON THE LAST POSSIBLE CELL
  let bombFound = false;
  remainingBombs.id = "remaining_bombs";

  // create an empty array that will contain the bombs
  let generatedBombs = [];

  // select all the cells
  let createdCells = document.querySelectorAll(".cell");

  // generate the bombs and check if they're already in the array
  for (let i = 1; i <= Math.round(createdCells.length * 20 / 100); i++) {
    let randomIndex = Math.floor(Math.random() * createdCells.length);
    while (generatedBombs.includes(randomIndex)) {
      randomIndex = Math.floor(Math.random() * createdCells.length);
    }
    generatedBombs.push(randomIndex);
  }

  // fills and appends the remaining bombs output
  remainingBombs.innerHTML = `Bombe rimanenti: ${generatedBombs.length}`;
  document.body.append(remainingBombs);

  // number of cells in a row
  let cellsInARow = Math.sqrt(createdCells.length);

  for (let i = 0; i < createdCells.length; i++) {

    // sets the current cell
    let thisCell= createdCells[i];

    // listens for the click on a cell
    thisCell.addEventListener("click", function() {

      if (!bombFound) {

        // if the cell was already clicked or is flagged as a possible bomb, nothing happens and waits for another click
        if (this.classList.contains("alreadyClicked") || this.classList.contains("marked")) {
          return;
        }
        // if the cell is a bomb sets some style, outputs a message to start a new game or not
        if (generatedBombs.includes(i)) {
          for (let i = 0; i < createdCells.length; i++) {
            if (generatedBombs.includes(i)) {
              bombFound = true;
              createdCells[i].innerHTML = '<i class="fa-solid fa-bomb"></i>';
              createdCells[i].style.color = "red";
              createdCells[i].style.backgroundColor = "#292745";
              createdCells[i].classList.add("alreadyClicked");
            }
          }
          if(confirm("HAI PERSO. VUOI FARE UN'ALTRA PARTITA?")) {
            setTimeout(() => {
              playButton.click();
            }, 1000);
          }
        }
        // else if the cell has no adjacent bombs, then the click expands to the adjacent cells also
        else if (!((i % cellsInARow != 0 && generatedBombs.includes(i - cellsInARow - 1)) || generatedBombs.includes(i - cellsInARow) || ((i + 1) % cellsInARow != 0 && generatedBombs.includes(i - cellsInARow + 1)) || (i % cellsInARow != 0 && generatedBombs.includes(i - 1)) || ((i + 1) % cellsInARow != 0 && generatedBombs.includes(i + 1)) || (i % cellsInARow != 0 && generatedBombs.includes(i + cellsInARow - 1)) || generatedBombs.includes(i + cellsInARow) || ((i + 1) % cellsInARow != 0 && generatedBombs.includes(i + cellsInARow + 1)))) {
          this.classList.add("alreadyClicked");
          this.style.backgroundColor = "gray";
          this.style.border = "1px solid #e1e1e1";

          if ((i >= cellsInARow) && (i < createdCells.length - cellsInARow) && (i % cellsInARow != 0) && ((i + 1) % cellsInARow != 0)) {
            createdCells[i - cellsInARow - 1].click();
            createdCells[i - cellsInARow].click();
            createdCells[i - cellsInARow + 1].click();
            createdCells[i - 1].click();
            createdCells[i + 1].click();
            createdCells[i + cellsInARow - 1].click();
            createdCells[i + cellsInARow].click();
            createdCells[i + cellsInARow + 1].click();
          } else if (i < cellsInARow) {
            if (i == 0) {
              createdCells[i + 1].click();
              createdCells[i + cellsInARow].click();
              createdCells[i + cellsInARow + 1].click();
            } else if (i == cellsInARow - 1) {
              createdCells[i - 1].click();
              createdCells[i + cellsInARow - 1].click();
              createdCells[i + cellsInARow].click();
            } else {
              createdCells[i - 1].click();
              createdCells[i + 1].click();
              createdCells[i + cellsInARow - 1].click();
              createdCells[i + cellsInARow].click();
              createdCells[i + cellsInARow + 1].click();
            }
          } else if (i >= createdCells.length - cellsInARow) {
            if (i == createdCells.length - cellsInARow) {
              createdCells[i - cellsInARow].click();
              createdCells[i - cellsInARow + 1].click();
              createdCells[i + 1].click();
            } else if (i == createdCells.length - 1) {
              createdCells[i - cellsInARow - 1].click();
              createdCells[i - cellsInARow].click();
              createdCells[i - 1].click();
            } else {
              createdCells[i - cellsInARow - 1].click();
              createdCells[i - cellsInARow].click();
              createdCells[i - cellsInARow + 1].click();
              createdCells[i - 1].click();
              createdCells[i + 1].click();
            }
          } else if (i % cellsInARow == 0) {
            createdCells[i - cellsInARow].click();
            createdCells[i - cellsInARow + 1].click();
            createdCells[i + 1].click();
            createdCells[i + cellsInARow].click();
            createdCells[i + cellsInARow + 1].click();
          } else {
            createdCells[i - cellsInARow - 1].click();
            createdCells[i - cellsInARow].click();
            createdCells[i - 1].click();
            createdCells[i + cellsInARow - 1].click();
            createdCells[i + cellsInARow].click();
          }
        }

        // else if the cell has adjacent bombs calculates the number of bombs around it and shows it
        else {

          this.classList.add("alreadyClicked");

          let adjacentBombs = 0;
          if (i % cellsInARow != 0 && generatedBombs.includes(i - cellsInARow - 1)) {
            adjacentBombs++;
          }
          if (generatedBombs.includes(i - cellsInARow)) {
            adjacentBombs++;
          }
          if ((i + 1) % cellsInARow != 0 && generatedBombs.includes(i - cellsInARow + 1)) {
            adjacentBombs++;
          }
          if (i % cellsInARow != 0 && generatedBombs.includes(i - 1)) {
            adjacentBombs++;
          }
          if ((i + 1) % cellsInARow != 0 && generatedBombs.includes(i + 1)) {
            adjacentBombs++;
          }
          if (i % cellsInARow != 0 && generatedBombs.includes(i + cellsInARow - 1)) {
            adjacentBombs++;
          }
          if (generatedBombs.includes(i + cellsInARow)) {
            adjacentBombs++;
          }
          if ((i + 1) % cellsInARow != 0 && generatedBombs.includes(i + cellsInARow + 1)) {
            adjacentBombs++;
          }
          switch(adjacentBombs) {
            case 1:
              this.style.color = "blue";
              break;
            case 2:
              this.style.color = "red";
              break;
            case 3:
              this.style.color = "green";
              break;
            case 4:
              this.style.color = "purple";
              break;
            case 5:
              this.style.color = "maroon";
              break;
            case 6:
              this.style.color = "turquoise";
              break;
            case 7:
              this.style.color = "black";
              break;
            case 8:
              this.style.color = "#e1e1e1";
              break;
          }
          this.style.backgroundColor = "gray";
          this.style.border = "1px solid #e1e1e1"
          this.innerText = adjacentBombs;
        }

        // increase the score
        score++;
        

        // check if the score equals the number of "non bombs" cells. if yes you win
        if (score == createdCells.length - generatedBombs.length && bombFound != true) {
          for (let i = 0; i < createdCells.length; i++) {
            if (generatedBombs.includes(i)) {
              createdCells[i].innerHTML = '<i class="fa-solid fa-bomb"></i>';
              createdCells[i].style.color = "red";
              createdCells[i].style.backgroundColor = "#292745";
              createdCells[i].classList.add("alreadyClicked");
            }
          }
          if(confirm("HAI VINTO!!! VUOI FARE UN'ALTRA PARTITA?")) {
            setTimeout(() => {
              playButton.click();
            }, 1000);
          }
        }
      }
    });

    // event listener to add the "marked as bomb" background color with right click
    thisCell.addEventListener("contextmenu", function(e) {
      e.preventDefault();
      if (!this.classList.contains("alreadyClicked") && !bombFound) {
        if(this.classList.contains("marked")) {
          this.innerHTML = "";
        } else {
          this.innerHTML = `<i class="fa-solid fa-flag"></i>`;
        }
        this.classList.toggle("marked");
        const markedCells = document.querySelectorAll(".marked");
        remainingBombs.innerHTML = `Bombe rimanenti: ${generatedBombs.length - markedCells.length}`;
      }
    });
  }
});