console.log("hello");
const newDeckBtn = document.querySelector("#newDeck");
const playerDrawBtn = document.querySelector("#drawBtn");
const playerHand = document.querySelector("#hand");
const header = document.querySelector("#header");
const countVis = document.createElement("p");
const rules = document.querySelector("#rules");

countVis.classList.add("countVis");
countVis.style.webkitTextFillColor = "black";
countVis.style.fontSize = "25px";
countVis.style.margin = "0px";
countVis.style.padding = "5px";
function playGame() {
  let deckId;
  let drawn = [];
  let count = 0;
  function checkDecksize() {
    if (drawn.length === 52) {
      alert("Please create a new deck. This deck is out of cards");
      drawn = [];
    }
    console.log(drawn.length);
  }
  function checkWinOrLose() {
    if (count === 21) {
      confirm("You win!Your count is 21! Would you like to play again?");
      playerHand.innerHTML = "";
      count = 0;
      countVis.textContent = "";
    } else if (count > 21) {
      confirm(
        "You lose. Your count is:" + count + ". Would you like to play again?"
      );
      playerHand.innerHTML = "";
      count = 0;
      countVis.textContent = "";
    }
  }
  newDeckBtn.addEventListener("click", () => {
    // fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     alert("deck has been created and shuffled");
    //     console.log(data);
    //   });
    $.get(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
      (data) => {
        deckId = data.deck_id;
        alert("Deck has been created and shuffled! Good Luck!");
        // console.log(data);
      }
    );
  });
  playerDrawBtn.addEventListener("click", () => {
    $.get(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`,
      (drawnCards) => {
        drawn.push(drawnCards.cards);
        let card = document.createElement("img");
        card.setAttribute("src", drawnCards.cards[0].image);
        card.classList.add("card");
        playerHand.appendChild(card);
        if (
          drawnCards.cards[0].value === "KING" ||
          drawnCards.cards[0].value === "QUEEN" ||
          drawnCards.cards[0].value === "JACK"
        ) {
          count += 10;
        } else if (drawnCards.cards[0].value === "ACE") {
          count += 11;
        } else {
          count += Number(drawnCards.cards[0].value);
        }
        console.log(count);
        countVis.textContent = count;
        rules.appendChild(countVis);
        setInterval(checkWinOrLose, 2000);
        checkDecksize();
      }
    );
  });
}
playGame();
