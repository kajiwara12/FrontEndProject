console.log("hello");
const newDeckBtn = document.querySelector("#newDeck");
const playerDrawBtn = document.querySelector("#drawBtn");
const startBtn = document.querySelector("#startBtn");
const stayBtn = document.querySelector("#stayBtn");
const playerHand = document.querySelector("#hand");
const dealerHand = document.querySelector("#dealerHand");
const header = document.querySelector("#header");
const playerWords = document.querySelector("#playerWords");
const dealerWords = document.querySelector("#dealerWords");
const wStatus = document.querySelector("#status");

const rules = document.querySelector("#rules");
function playGame() {
  let deckLoaded = false;
  let deckId;
  let playing = false;
  let playerCards = [];
  let dealerCards = [];
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~GET A NEW DECK
  newDeckBtn.addEventListener("click", () => {
    deckLoaded = true;
    $.get(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2",
      (data) => {
        deckId = data.deck_id;
        alert("Deck has been created and shuffled! Good Luck!");
      }
    );
  });
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DEAL CARDS TO PLAYER and DEALER
  startBtn.addEventListener("click", () => {
    if (!deckLoaded) {
      return;
    }
    playing = true;
    playerCards = [];
    dealerCards = [];
    playerHand.innerHTML = "";
    dealerHand.innerHTML = "";
    wStatus.textContent = "";
    $.get(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`,
      dealerStart
    );
    $.get(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`,
      playerStart
    );
  });
  function dealerStart(drawnCards) {
    console.log(dealerCards);
    for (let i = 0; i < 2; i++) {
      dealerCards.push(drawnCards.cards[i]);
      let card = document.createElement("img");
      card.setAttribute("src", dealerCards[i].image);
      card.classList.add("card");
      dealerHand.appendChild(card);
      if (i === 0) {
        card.setAttribute(
          "src",
          "https://deckofcardsapi.com/static/img/back.png"
        );
        card.setAttribute("id", "flipCard");
      }
    }
    dealerWords.textContent = "Dealer Count:??";
  }
  function playerStart(drawnCardsPlayer) {
    console.log(playerCards);
    for (let j = 0; j < 2; j++) {
      playerCards.push(drawnCardsPlayer.cards[j]);
      let card = document.createElement("img");
      card.setAttribute("src", playerCards[j].image);
      card.classList.add("card");
      playerHand.appendChild(card);
    }

    calcValuePlayer();
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~DRAW CARDS/HIT Button functions
  playerDrawBtn.addEventListener("click", () => {
    $.get(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`,
      drawCards
    );
  });

  function drawCards(drawnCardsPlayer) {
    playerCards.push(drawnCardsPlayer.cards[0]);
    let card = document.createElement("img");
    card.setAttribute("src", drawnCardsPlayer.cards[0].image);
    card.classList.add("card");
    playerHand.appendChild(card);
    console.log(playerCards);
    calcValuePlayer();
  }
  function calcValuePlayer() {
    let playerCount = 0;
    let playerAces = 0;
    for (let k = 0; k < playerCards.length; k++) {
      if (
        playerCards[k].value === "KING" ||
        playerCards[k].value === "QUEEN" ||
        playerCards[k].value === "JACK"
      ) {
        playerCount += 10;
      } else if (playerCards[k].value === "ACE") {
        playerAces++;
        playerCount += 11;
      } else {
        playerCount += Number(playerCards[k].value);
      }
    }
    while (playerCount > 21 && playerAces > 0) {
      playerCount -= 10;
      playerAces--;
    }
    if (playerCount > 21) {
      wStatus.textContent = "You Lost";
    }
    playerWords.textContent = "Count:" + playerCount;
    return playerCount;
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~STAY BUTTON functionality
  stayBtn.addEventListener("click", () => {
    if (!playing) {
      return;
    }
    let flip = document.querySelector("#flipCard");
    flip.setAttribute("src", dealerCards[0].image);
    dealerPlay();
  });
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~DEALER DRAW LOGIC
  function dealerPlay() {
    let dealerHandValue = calcValueDealer();
    let playerHandValue = calcValuePlayer();
    if (dealerHandValue < 17) {
      $.get(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`,
        (drawnCardsDealer) => {
          dealerCards.push(drawnCardsDealer.cards[0]);
          let card = document.createElement("img");
          card.setAttribute("src", drawnCardsDealer.cards[0].image);
          card.classList.add("card");
          dealerHand.appendChild(card);
          console.log("appened new dealer card", card);
          console.log(dealerCards);
          dealerHandValue = calcValueDealer();
          dealerPlay();
        }
      );
    } else {
      determineWinner(playerHandValue, dealerHandValue);
    }
  }

  function calcValueDealer() {
    let dealerCount = 0;
    let dealerAces = 0;
    for (let l = 0; l < dealerCards.length; l++) {
      if (
        dealerCards[l].value === "KING" ||
        dealerCards[l].value === "QUEEN" ||
        dealerCards[l].value === "JACK"
      ) {
        dealerCount += 10;
      } else if (dealerCards[l].value === "ACE") {
        dealerAces++;
        dealerCount += 11;
      } else {
        dealerCount += Number(dealerCards[l].value);
      }
    }
    while (dealerCount > 21 && dealerAces > 0) {
      dealerCount -= 10;
      dealerAces--;
    }
    dealerWords.textContent = "Dealer Count:" + dealerCount;
    return dealerCount;
  }
  function determineWinner(playerHandValue, dealerHandValue) {
    if (playerHandValue > dealerHandValue || dealerHandValue > 21) {
      wStatus.textContent = "You Win";
    } else if (dealerHandValue === playerHandValue && dealerHandValue > 17) {
      wStatus.textContent = "You Tied";
    } else if (playerHandValue > 21) {
      wStatus.textContent = "You Lost";
    } else {
      wStatus.textContent = "You Lost";
    }
  }
}

playGame();
