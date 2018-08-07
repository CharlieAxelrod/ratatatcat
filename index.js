class Card {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }    
}

class Board {
    constructor(layout) {
        this.layout = [[null, null, null, null],[null, null],[null, null, null, null]];
    }

    printBoard(cards, player, qMarkCards){
        var pBoard = [["X","X","X","X"],["X","X"],["X","X","X","X"]];
        for (var card of cards){
            pBoard[Number(card[0])][Number(card[1])] = this.layout[Number(card[0])][Number(card[1])].name;
        }
        if (qMarkCards !== undefined){
            for (var qMarkCard of qMarkCards){
                pBoard[Number(qMarkCard[0])][Number(qMarkCard[1])] = "?";
            }
        }
        console.log('\n\n\n\n\n\n\n\n\n\n\n\n');
        if (player == 0) console.log('\t\t\t\t\t\t' + 'a' + '   ' + 's' + '   ' + 'd' + '   ' + 'f');
        else console.log('\n');
        console.log('\t\t\t\t\t\t' + pBoard[0][0] + '   ' + pBoard[0][1] + '   ' + pBoard[0][2] + '   ' + pBoard[0][3]);
        console.log('\n\n\t\t\t\t\t     Draw: ' + pBoard[1][0] + '  Discard: ' + pBoard[1][1]);
        console.log('\n\n\t\t\t\t\t\t' + pBoard[2][0] + '   ' + pBoard[2][1] + '   ' + pBoard[2][2] + '   ' + pBoard[2][3]);
        if (player == 2) console.log('\t\t\t\t\t\t' + 'a' + '   ' + 's' + '   ' + 'd' + '   ' + 'f' + '\n');
        else console.log('\n');
        console.log('\n\n\n\n\n\n\n\n\n\n');
    }

    swapCards(card1, card2){
        var temp = this.layout[Number(card1[0])][Number(card1[1])];
        this.layout[Number(card1[0])][Number(card1[1])] = this.layout[Number(card2[0])][Number(card2[1])];
        this.layout[Number(card2[0])][Number(card2[1])] = temp;
    }

    calcScore(player){
        var score = 0;
        for (let card = 0; card < this.layout[player].length; card++){score += this.layout[player][card].value};
        return score;
    }
}

class Hand {
    constructor(layout) {
        this.layout = [5, 5, 5, 5];
    }

    get expectedScore(){
        var total = 0;
        for (var card = 0; card < this.layout.length; card++){
            total += this.layout[card];
        }
        return total;
    }

    get highestCard(){
        var highest = 0;
        for (var card = 1; card < this.layout.length; card++){
            if (this.layout[card] > this.layout[highest]){
                highest = card;
            }
        }
        return highest;
    }
}

class Deck {
    constructor(stack) {
        this.stack = [swap, swap, swap, peek, peek, peek, draw2, draw2, draw2, zero, 
            zero, zero, zero, one, one, one, one, two, two, two, two, three, three, three,
            three, four, four, four, four, five, five, five, five, six, six, six, six,
            seven, seven, seven, seven, eight, eight, eight, eight, nine, nine, nine, nine,
            nine, nine, nine, nine, nine];
    }
}

let swap = new Card("Swap", 5); //average card value
let peek = new Card("Peek", 5); 
let draw2 = new Card("Draw 2", 5);
let zero = new Card("0", 0);
let one = new Card("1", 1);
let two = new Card("2", 2);
let three = new Card("3", 3);
let four = new Card("4", 4);
let five = new Card("5", 5);
let six = new Card("6", 6);
let seven = new Card("7", 7);
let eight = new Card("8", 8);
let nine = new Card("9", 9);

var readline = require('readline-sync');

function flipCoin() {
    var call = readline.keyIn("Heads or Tails? Type 'h' or 't'. ", {limit: 'ht'});
    if (Math.random() < 0.5) {
        var result = 'h';
        readline.keyIn("It's heads! 'a' to continue     ", {limit: 'a'});
    }
    else {
        var result = 't';
        readline.keyIn("It's tails! 'a' to continue     ", {limit: 'a'});
    }
    if (result === call) return "user";
    else return "pc";
}

function shuffle(Deck) {
    Deck.stack.sort(function() {return 0.5 - Math.random();});
}

function deal(Board, Deck){
    for (var row of Board.layout){
        for (var card = 0; card < row.length; card++){
            row[card] = Deck.stack.shift();
        }
    }
    while (Board.layout[1][1].name == "Peek" || Board.layout[1][1].name == "Swap" || 
           Board.layout[1][1].name == "Draw 2"){
        var random = Math.floor(Math.random() * Deck.stack.length);
        var temp = Board.layout[1][1];
        Board.layout[1][1] = Deck.stack[random];
        Deck.stack[random] = temp;
    }
}

function discardDraw(Board, Deck){
    Board.layout[1][1] = Board.layout[1][0];
    Board.layout[1][0] = Deck.stack.shift();
}

function scoreGame(Board, Deck){
    Board.printBoard(["00", "01", "02", "03", "20", "21", "22", "23"], 1);
    let players = [0, 2];
    for (let player of players){
        for (var card = 0; card < Board.layout[player].length; card++){
            while (Board.layout[player][card].name == "Swap" || Board.layout[player][card].name == "Draw 2"||
              Board.layout[player][card].name == "Peek"){
                readline.keyIn("Drawing a card to replace power card. ", {limit: 'a'});
                Board.swapCards("" + player + card, "10");
                discardDraw(Board, Deck);
                Board.printBoard(["00", "01", "02", "03", "20", "21", "22", "23"], 1);
            }
        }
    }
    var userScore = Board.calcScore(2), pcScore = Board.calcScore(0);
    if (userScore < pcScore) readline.keyIn(`You win the round ${userScore} to ${pcScore}! Type 'a' to continue `,
      {limit: 'a'});
    else if (pcScore < userScore) readline.keyIn(`Computer wins the round ${pcScore} to ${userScore}! Type 'a' to continue `, 
      {limit: 'a'});
    else readline.keyIn(`You tied ${pcScore} to ${userScore}! Type 'a' to continue `, {limit: 'a'});
    userTotal += userScore;
    pcTotal += pcScore;
    if (Math.max(pcTotal, userTotal) < scoreLimit) readline.keyIn(`Total scores so far: You: ${userTotal}, Computer: ${pcTotal}`);
}

function chooseCard(Board, player){
    Board.printBoard(['11'], player);
    var choice = readline.keyIn("Select a card: (a, s, d, or f) ", {limit: 'asdf'});
    if (choice == 'a') return "" + player + 0;
    else if (choice == 's') return "" + player + 1;
    else if (choice == 'd') return "" + player + 2;
    else if (choice == 'f') return "" + player + 3;
}

function userTurn(Board, Deck, Hand){
    if ((Board.layout[1][1].name == "Swap") || (Board.layout[1][1].name == "Peek")
        || (Board.layout[1][1].name == "Draw 2")) {
            Board.printBoard(["11"], 1);
            userDrawCard(Board, Deck, Hand);
    }
    else {
        Board.printBoard(["11"], 1);
        if (readline.keyIn("Type 'a' to draw new card or 'd' to take card from discard pile. ",
          {limit: 'ad'}) == 'd') {
            var discard = chooseCard(Board, 2);
            Board.swapCards("11", discard);
            Board.printBoard(["11"], 1);
        } 
        else userDrawCard(Board, Deck, Hand);
    }
    
    if (ratatatcat == false){
        Board.printBoard(["11"], 1);
        if (readline.keyIn("Type 'a' to continue game or 'd' to declare 'rat-a-tat-cat'. ", {limit: 'ad'}) == 'd') {
            ratatatcat = true;
            Board.printBoard(["11"], 1);
            readline.keyIn("You: 'Rat-a-tat-cat!", {limit: 'a'});
        }
    }
    last = "user";
}

function userSwap(Board, Deck, Hand){
    discardDraw(Board, Deck);
    var userCard = chooseCard(Board, 2);
    var pcCard = chooseCard(Board, 0);
    Board.swapCards(userCard, pcCard);
    seeCards(Board, Hand, pcCard);
    Board.printBoard([userCard, "11"], 1, [pcCard]);
    readline.keyIn("Type 'a' to continue. ", {limit: 'a'});
}


function userPeek(Board, Deck){
    discardDraw(Board, Deck);
    var peekCard = chooseCard(Board, 2);
    Board.printBoard([peekCard, "11"], 1);
    readline.keyIn("Type 'a' to continue. ", {limit: 'a'});
}

function userDraw2(Board, Deck, Hand){
    userDiscard = 0;
    discardDraw(Board, Deck);
    Board.printBoard(["11"], 1);
    readline.keyIn("Type 'a' to draw first card. ", {limit: 'a'});
    userDrawCard(Board, Deck, Hand);
    if (userDiscard == 1) userDrawCard(Board, Deck, Hand);
}

function userDrawCard(Board, Deck, Hand){ 
    Board.printBoard(["10", "11"], 1);
    if (readline.keyIn("Type 'a' to use card or 'd' to discard. ", {limit: 'ad'}) == 'a'){ 
        if (Board.layout[1][0].name == "Swap") userSwap(Board, Deck, Hand);
        else if (Board.layout[1][0].name == "Peek") userPeek(Board, Deck);
        else if (Board.layout[1][0].name == "Draw 2") userDraw2(Board, Deck);
        else {
            var discard = chooseCard(Board, 2);
            Board.swapCards("10", discard);
            discardDraw(Board, Deck);
        }
    }
    else {
        discardDraw(Board, Deck);
        userDiscard = 1;
    }
}

function seeCards(Board, Hand, cards){
    for (var card of cards){            
        Hand.layout[card] = Board.layout[0][card].value;
    }
}

function pcTurn(Board, Deck, Hand){
    var highest = Hand.highestCard;
    if ((Board.layout[1][1].value < 5 ) && (Board.layout[1][1].value < Hand.layout[highest])) {
        Board.swapCards("11", "0" + highest);
        Board.printBoard(["11"], 1, ["0" + highest]);
        seeCards(Board, Hand, [highest]);
        readline.keyIn("Computer has taken the card from the discard pile. ", {limit: 'a'});
    }
    else pcDrawCard(Board, Deck, Hand);

    if ((Hand.expectedScore <= 8) && (ratatatcat == false)) {
        ratatatcat = true;
        Board.printBoard(["11"], 1);
        readline.keyIn("Computer: 'Rat-a-tat-cat!'", {limit: 'a'});
    }
    last = "pc";
}

function pcPeek(Board, Deck, Hand){
    discardDraw(Board, Deck);
    var randomCard = Math.random() < 0.5 ? 1 : 2; // not optimal. should be unseen card.
    seeCards(Board, Hand, [randomCard]);
    Board.printBoard(["11"], 1, ["0" + randomCard]);
    readline.keyIn("Computer has peeked. ", {limit: 'a'});
}

function pcSwap(Board, Deck, Hand){
    discardDraw(Board, Deck);
    Board.printBoard(["11"], 1);
    readline.keyIn("Computer has drawn swap card. ", {limit: 'a'});
    var randomCard = Math.random(); // not optimal. should be low card taken from discard pile.
    var userCard;
    if (randomCard < 0.25) userCard = 0;
    else if (randomCard >= 0.25 && randomCard < 0.5) userCard = 1;
    else if (randomCard >= 0.5 && randomCard < 0.75) userCard = 2;
    else userCard = 3;
    var highestPcCard = Hand.highestCard;
    Board.swapCards("0" + highestPcCard, "2" + userCard);
    Board.printBoard(["2" + userCard, "11"], 1, ["0" + highestPcCard]);
    seeCards(Board, Hand, [highestPcCard]);
    readline.keyIn("Computer has swapped cards with you. ", {limit: 'a'});
}

function pcDraw2(Board, Deck, Hand){
    pcDiscard = 0;
    discardDraw(Board, Deck);
    Board.printBoard(["11"], 1);
    readline.keyIn("Computer has drawn Draw 2 card. ", {limit: 'a'});
    pcDrawCard(Board, Deck, Hand); // not optimal strategy e.g. would accept an 8
    if (pcDiscard == 1) pcDrawCard(Board, Deck, Hand);
}

function pcDrawCard(Board, Deck, Hand){
    Board.printBoard(["11"], 1, ["10"]);
    readline.keyIn("Computer has drawn a card. ", {limit: 'a'});
    if (Board.layout[1][0].name == "Swap") pcSwap(Board, Deck, Hand);
    else if (Board.layout[1][0].name == "Peek") pcPeek(Board, Deck, Hand);
    else if (Board.layout[1][0].name == "Draw 2") pcDraw2(Board, Deck, Hand);
    else {
        if (Board.layout[1][0].value < Hand.layout[Hand.highestCard]){
            var highestCard = Hand.highestCard;
            Board.swapCards("10", "0" + highestCard);
            discardDraw(Board, Deck);
            Board.printBoard(["11"], 1, ["0" + highestCard]);
            seeCards(Board, Hand, [highestCard]);
            readline.keyIn("Computer has taken the card it drew. ", {limit: 'a'});
        }
        else {
            discardDraw(Board, Deck);
            Board.printBoard(["11"], 1);
            pcDiscard = 1;
            readline.keyIn("Computer has rejected the card from the draw pile. ", {limit: 'a'});
        } 
    }
}

function round() {
    var gBoard = new Board(), pcHand = new Hand(), gDeck = new Deck();
    ratatatcat = false;
    shuffle(gDeck);
    deal(gBoard, gDeck);
    gBoard.printBoard(["20", "23", "11"], 1);
    seeCards(gBoard, pcHand, [0, 3]);
    readline.keyIn("Type 'a' to continue ", {limit: 'a'});
    if (first % 2 == 1){
        userTurn(gBoard, gDeck, pcHand);
        while (ratatatcat == false){
            (last == "user") ? pcTurn(gBoard, gDeck, pcHand) : userTurn(gBoard, gDeck, pcHand);
        }
        (last == "user") ? pcTurn(gBoard, gDeck, pcHand) : userTurn(gBoard, gDeck, pcHand);
    }
    else if (first % 2 == 0){
        pcTurn(gBoard, gDeck, pcHand);
        while (ratatatcat == false){
            (last == "user") ? pcTurn(gBoard, gDeck, pcHand) : userTurn(gBoard, gDeck, pcHand);
        }
        (last == "user") ? pcTurn(gBoard, gDeck, pcHand) : userTurn(gBoard, gDeck, pcHand);
    }
    scoreGame(gBoard, gDeck);
}

var pcDiscard, userDiscard, ratatatcat, last;
var pcTotal = 0, userTotal = 0;
if (flipCoin() == "user") var first = 1;
else var first = 2; 
for (
    var scoreLimit = readline.questionInt("What would you like to play to? (Type number, then hit 'Enter') ");
    scoreLimit > Math.max(pcTotal, userTotal);
    first++
){
    round();
}
console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
if (pcTotal > userTotal) readline.question("You won! " + userTotal + " to " + pcTotal);
else if (userTotal > pcTotal) readline.question("You lost! " + pcTotal + " to " + userTotal);
else readline.question("You tied! " + pcTotal + " to " + userTotal);
