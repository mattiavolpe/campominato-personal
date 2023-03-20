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
    cellElement.id = `cell${i - 1}`;
    cellElement.classList.add("cell");

    // SETS THE DIMENSIONS DINAMICALLY TO MAKE THE GRID RESPONSIVE ALSO
    cellElement.style.height = `min(calc(100% / ${cellsPerRow}), (96vw / ${cellsPerRow}))`;
    containerElement.insertAdjacentElement("beforeend", cellElement);
  }
}

// HERE START THE EXPERIMENTAL IMPLEMENTATION
const remainingBombs = document.createElement("div");
const checkWin = document.createElement("button");

playButton.addEventListener("click", function () {
  console.clear();
  score = 0;
  remainingBombs.id = "remaining_bombs";
  checkWin.id = "check_win";
  let generatedBombs = [];
  let createdCells = document.querySelectorAll(".cell");

  for (let i = 1; i <= Math.round(createdCells.length * 20 / 100); i++) {
    let randomIndex = Math.floor(Math.random() * createdCells.length);
    while (generatedBombs.includes(randomIndex)) {
      randomIndex = Math.floor(Math.random() * createdCells.length);
    }
    generatedBombs.push(randomIndex);
  }

  generatedBombs.sort((a, b) => a - b);

  remainingBombs.innerHTML = `Bombe rimanenti: ${generatedBombs.length}`;
  document.body.append(remainingBombs);
  checkWin.innerHTML = "Controlla se hai vinto";
  document.body.append(checkWin);

  let cellsInARow = Math.sqrt(createdCells.length);

  for (let i = 0; i < createdCells.length; i++) {
    let thisCell= createdCells[i];
    thisCell.addEventListener("click", function() {
      if (this.classList.contains("alreadyClicked") || this.classList.contains("marked")) {
        return;
      }
      if (generatedBombs.includes(i)) {
        this.style.color = "#e1e1e1";
        this.style.backgroundColor = "#292745";
        if(confirm("HAI PERSO. VUOI FARE UN'ALTRA PARTITA?")) {
          setTimeout(() => {
            playButton.click();
          }, 1000);
        } else {
          setTimeout(() => {
            remainingBombs.innerHTML = ""
            containerElement.innerHTML = "";
          }, 1000);
        }
      } else if (!((i % cellsInARow != 0 && generatedBombs.includes(i - cellsInARow - 1)) || generatedBombs.includes(i - cellsInARow) || ((i + 1) % cellsInARow != 0 && generatedBombs.includes(i - cellsInARow + 1)) || (i % cellsInARow != 0 && generatedBombs.includes(i - 1)) || ((i + 1) % cellsInARow != 0 && generatedBombs.includes(i + 1)) || (i % cellsInARow != 0 && generatedBombs.includes(i + cellsInARow - 1)) || generatedBombs.includes(i + cellsInARow) || ((i + 1) % cellsInARow != 0 && generatedBombs.includes(i + cellsInARow + 1)))) {
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
      } else {

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
      score++;
      console.log(score);
      if (score == createdCells.length - generatedBombs.length) {
        if(confirm("HAI VINTO!!! VUOI FARE UN'ALTRA PARTITA?")) {
          setTimeout(() => {
            playButton.click();
          }, 1000);
        } else {
          setTimeout(() => {
            remainingBombs.innerHTML = ""
            containerElement.innerHTML = "";
          }, 1000);
        }
      }
    });

    thisCell.addEventListener("contextmenu", function(e) {
      e.preventDefault();
      this.classList.toggle("marked");
      const markedCells = document.querySelectorAll(".marked");
      remainingBombs.innerHTML = `Bombe rimanenti: ${generatedBombs.length - markedCells.length}`;
    });
  }

  // let generatedBombsCopy = generatedBombs;
  // for (let i = 0; i < generatedBombsCopy.length; i++) {
  //   generatedBombsCopy[i] = `cell${generatedBombsCopy[i]}`;
  // }

  // checkWin.addEventListener("click", function () {

  //   const cellsNotChoosenNodeList = document.querySelectorAll(".cell:not(.alreadyClicked)");
  //   const cellsNotChoosenArray = [];
  //   for (let i = 0; i < cellsNotChoosenNodeList.length; i++) {
  //     cellsNotChoosenArray.push(cellsNotChoosenNodeList[i].id);
  //   }
  //   console.log(cellsNotChoosenArray);

  //   if (generatedBombsCopy.toString() == cellsNotChoosenArray.toString()) {
  //     if (confirm("HAI VINTO!!! VUOI FARE UN'ALTRA PARTITA?")) {
  //       setTimeout(() => {
  //         playButton.click();
  //       }, 1000);
  //     }
  //   }
  // });

});