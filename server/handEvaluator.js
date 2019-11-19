//npm run dev
// console.log("Evaluating Hand");
const board = ["KD", "KH", "10H", "8S", "JS"];
const hand = ["JH", "9S"];

const rankHand = (cards) => {
  var rank = 0;

  //   if (isStraight(cards) && isFlush(cards)) rank = 9;
  result = nOfAKind(cards, 4);
  if (result) return {rank: 8, bestHand: result};
  result = isFullHouse(cards);
  if (result) return {rank: 7, bestHand: result};
  result = isFlush(cards);
  if (result) return {rank: 6, bestHand: result};
  result = isStraight(cards);
  if (result) return {rank: 5, bestHand: result};
  result = nOfAKind(cards, 3);
  if (result) return {rank: 4, bestHand: result};
  result = isTwoPair(cards);
  if (result) return {rank: 3, bestHand: result};
  result = nOfAKind(cards, 2);
  if (result) return {rank: 2, bestHand: result};
  result = [getHighCard(cards)];
  return {rank: 1, bestHand: result};

};

const isFlush = cards => {
  var d = [];
  var h = [];
  var s = [];
  var c = [];
  cards.forEach(card => {
    if (card[1] === "C") c.push(card);
    else if (card[1] === "D") d.push(card);
    else if (card[1] === "H") h.push(card);
    else if (card[1] === "S") s.push(card);
  });
  if (c.length > 4) return c;
  else if (d.length > 4) return d;
  else if (s.length > 4) return s;
  else if (h.length > 4) return h;
};
const getHighCard = cards => {
  highCard = cards[0];
  for (let i = 1; i < cards.length; i++) {
    if (cards[i][0] === "A") {
      return cards[i];
    } else if (highCard[0] === "K") {
      if (cards[i][0] === "A") highCard = cards[i];
    } else if (highCard[0] === "Q") {
      if (cards[i][0] === "K" || cards[i][0] === "A") highCard = cards[i];
    } else if (highCard[0] === "J") {
      if (cards[i][0] === "A" || cards[i][0] === "K" || cards[i][0] === "Q")
        highCard = cards[i];
    } else if (highCard[0] === "1") {
      if (
        cards[i][0] === "A" ||
        cards[i][0] === "K" ||
        cards[i][0] === "Q" ||
        cards[i][0] === "J"
      )
        highCard = cards[i];
    } else if (cards[i][0] === "K") highCard = cards[i];
    else if (cards[i][0] === "Q") highCard = cards[i];
    else if (cards[i][0] === "J") highCard = cards[i];
    else if (cards[i][0] === "1") highCard = cards[i];
    else if (cards[i][0] > highCard[0]) highCard = cards[i];
  }
  return highCard;
};
const isStraight = cards => {
  const tmpCards = cards;
  cards.sort((a, b) => {
    if (a[0] === "A") return -1;
    else if (b[0] === "A") return 1;
    else if (a[0] === "K") return -1;
    else if (b[0] === "K") return 1;
    else if (a[0] === "Q") return -1;
    else if (b[0] === "Q") return 1;
    else if (a[0] === "J") return -1;
    else if (b[0] === "J") return 1;
    else if (a[0] === "1") return -1;
    else if (b[0] === "1") return 1;
    return a[0] < b[0];
  });

  //Remove Dup
//   for (let i = 0; i < tmpCards.length - 1; i++) {
//     while (i < tmpCards.length - 1 && tmpCards[i][0] === tmpCards[i + 1][0]) {
//       tmpCards.splice(i, i + 1);
//     }
//   }

  cards.reverse();

  var count = 1;
  var cc = [];
  for (let i = 0; i < cards.length - 1; i++) {
    var curr = cards[i][0];

    if (curr === "A") next = "1";
    else if (curr === "K") next = "A";
    else if (curr == "Q") next = "K";
    else if (curr == "J") next = "Q";
    else if (curr === "1") next = "J";
    else next = (parseInt(curr) + 1).toString();

    if(i+1 < cards.length -1 && curr === cards[i+1][0]) 
    {
        i++;
    }
    else if (next === cards[i + 1][0]) {
      count++;
      cc.push(cards[i]);
    } else {
      count = 1;
      cc.splice(0);
    }
    if (count === 5) {
      cc.push(cards[i + 1]);
      return cc;
    }
  }
};

const isFullHouse = cards => {
  var cc = [];
  const three = nOfAKind(cards, 3);
  if (!three) return;
  cards = cards.filter(card => card[0] !== three[0][0]);
  const two = nOfAKind(cards, 2);
  if (!two) return;
  return three.concat(two);
};
const isTwoPair = cards => {
  var cc = [];
  const first = nOfAKind(cards, 2);
  if (!first) return;
  cards = cards.filter(card => card[0] !== first[0][0]);
  const second = nOfAKind(cards, 2);
  if (!second) return;
  return first.concat(second);
};

const nOfAKind = (cards, n) => {
  var cc = [];
  cards.sort((a, b) => {
    if (a[0] === "A") return -1;
    else if (b[0] === "A") return 1;
    else if (a[0] === "K") return -1;
    else if (b[0] === "K") return 1;
    else if (a[0] === "Q") return -1;
    else if (b[0] === "Q") return 1;
    else if (a[0] === "J") return -1;
    else if (b[0] === "J") return 1;
    else if (a[0] === "1") return -1;
    else if (b[0] === "1") return 1;
    return a[0] < b[0];
  });

  for (let i = 0; i < cards.length - 1; i++) {
    var j = 1;
    while (i < cards.length - 1 && cards[i][0] === cards[i + 1][0]) {
      i++;
      j++;
      cc.push(cards[i - 1]);
      if (j == n) {
        cc.push(cards[i]);
        return cc;
      }
    }
    cc.splice(0);
  }
};

module.exports = {
  rankHand
};


