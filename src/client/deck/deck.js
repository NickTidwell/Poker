class Deck {
    constructor(){
        this.cards = [];
        this.dealCards = [];
        this.reset();
        this.shuffle();
        
    }

    reset(){
        const suits = ['D', 'H', 'C', 'S'];
        var values = ['A','2','3', '4','5','6','7','8','9','10','J','Q','K'];

        this.cards = [];
        this.dealCards = [];
        for(let suit in suits){
            for(let value in values){
                this.cards.push(`${values[value]}${suits[suit]}`);
            }
        }
    }

shuffle(){
    const {cards} = this;
    let m = cards.length,i;
    while(m){
        i = Math.floor(Math.random() * m--);
        [cards[m], cards[i]] = [cards[i], cards[m]];
    }
    return this;
}

dealHand(numCards){
    const hand = [];
    for(let i = 0; i < numCards;i++)
    {
        hand.push(this.cards.pop());
    }
    hand.forEach(card => this.dealCards.push(card))
    return hand;
}
}

module.exports = Deck;