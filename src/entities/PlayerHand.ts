import { ROYAL_FLUSH, STRAIGHT_RANK_CONBINATIONS } from "../constants/index";
import Hand, { HAND_STRONGNESS } from "./Hand";
import PlayingCard from "./PlayingCard";
import PossibleHand from "./PossibleHand";
import Rank from "./Rank";
import Street from "./Street";
import Suit from "./Suit";

export default class PlayerHand {
  public readonly playerHand: [PlayingCard, PlayingCard];
  public readonly communityCards: PlayingCard[];
  public readonly street: Street;

  constructor({
    playerHand,
    communityCards,
  }: {
    playerHand: [PlayingCard, PlayingCard];
    communityCards: PlayingCard[];
  }) {
    this.playerHand = playerHand;
    this.communityCards = communityCards;

    if (playerHand.length !== 2) {
      throw new Error("playerHand length must be 2.");
    }

    switch (communityCards.length) {
      case 0:
        this.street = Street.preflop;
        break;

      case 3:
        this.street = Street.flop;
        break;

      case 4:
        this.street = Street.turn;
        break;

      case 5:
        this.street = Street.river;
        break;

      default:
        throw new Error("community cards length must be 0, 3, 4, 5.");
    }
  }

  private _cards?: PlayingCard[];
  private _bestHand?: Hand;
  private _possibleHands?: PossibleHand[] | null;

  public get cards() {
    if (!this._cards) this.detect();

    return this._cards;
  }

  public get bestHand() {
    if (!this._bestHand) this.detect();

    return this._bestHand;
  }

  public get possibleHands() {
    if (!this._possibleHands) this.detect();

    return this._possibleHands;
  }

  private detect(): void {
    const cards = [...this.playerHand, ...this.communityCards];
    cards.sort((a, b) => a.rank - b.rank);

    const cardsBySuit = new Map<Suit, PlayingCard[]>();
    const cardsByRank = new Map<Rank, PlayingCard[]>();

    for (const card of cards) {
      const playingCardBySuit = cardsBySuit.get(card.suit);
      const playingCardByRank = cardsByRank.get(card.rank);

      cardsBySuit.set(card.suit, [
        ...(playingCardBySuit ? playingCardBySuit : []),
        card,
      ]);
      cardsByRank.set(card.rank, [
        ...(playingCardByRank ? playingCardByRank : []),
        card,
      ]);
    }

    this.setBestHand(cardsBySuit, cardsByRank);
    this.setPossibleHands(cardsBySuit, cardsByRank, cards);
  }

  private setBestHand(
    cardsBySuit: Map<Suit, PlayingCard[]>,
    cardsByRank: Map<Rank, PlayingCard[]>
  ) {
    const royalFlush = chooseRoyalFlush(cardsBySuit);
    if (royalFlush) {
      this._cards = royalFlush;
      this._bestHand = Hand.royalFlush;

      return;
    }

    const bestStraightFlush = chooseBestStraightFlush(cardsBySuit);
    if (bestStraightFlush) {
      this._cards = bestStraightFlush;
      this._bestHand = Hand.royalFlush;

      return;
    }

    const bestFourOfAKind = chooseBestFourOfAKind(cardsByRank);
    if (bestFourOfAKind) {
      this._cards = bestFourOfAKind;
      this._bestHand = Hand.fourOfAKind;

      return;
    }

    const bestFullHouse = chooseBestFullHouse(cardsByRank);
    if (bestFullHouse) {
      this._cards = bestFullHouse;
      this._bestHand = Hand.fullHouse;

      return;
    }

    const bestFlush = chooseBestFlush(cardsBySuit);
    if (bestFlush) {
      this._cards = bestFlush;
      this._bestHand = Hand.flush;

      return;
    }

    const bestStraight = chooseBestStraight(cardsByRank);
    if (bestStraight) {
      this._cards = bestStraight;
      this._bestHand = Hand.straight;

      return;
    }

    const bestThreeOfAKind = chooseBestThreeOfAKind(cardsByRank);
    if (bestThreeOfAKind) {
      this._cards = bestThreeOfAKind;
      this._bestHand = Hand.fullHouse;

      return;
    }

    const bestTwoPair = chooseBestTwoPair(cardsByRank);
    if (bestTwoPair) {
      this._cards = bestTwoPair;
      this._bestHand = Hand.twoPair;

      return;
    }

    const bestDeuce = chooseBestDeuce(cardsByRank);
    if (bestDeuce) {
      this._cards = bestDeuce;
      this._bestHand = Hand.pair;

      return;
    }

    this._cards = chooseBestHighCard(cardsByRank, this.street);
    this._bestHand = Hand.highCard;
  }

  private setPossibleHands(
    cardsBySuit: Map<Suit, PlayingCard[]>,
    cardsByRank: Map<Rank, PlayingCard[]>,
    openedCard: PlayingCard[]
  ) {
    const possibleHands: PossibleHand[] = [];
    const strongerHand = this.getStrongerHands();

    if (strongerHand.has(Hand.royalFlush)) {
      const possibleRoyalFlush = choosePossibleRoyalFlush(
        cardsBySuit,
        this.street
      );

      if (possibleRoyalFlush) {
        possibleHands.push(possibleRoyalFlush);
      }
    }

    if (strongerHand.has(Hand.straightFlush)) {
      const possibleStraightFlash = choosePossibleStraightFlash();

      if (possibleStraightFlash) {
        possibleHands.push(possibleStraightFlash);
      }
    }

    if (strongerHand.has(Hand.fourOfAKind)) {
      const possibleFourOfAKind = choosePossibleFourOfAKind();

      if (possibleFourOfAKind) {
        possibleHands.push(possibleFourOfAKind);
      }
    }

    if (strongerHand.has(Hand.fullHouse)) {
      const possibleFullHouse = choosePossibleFullHouse();

      if (possibleFullHouse) {
        possibleHands.push(possibleFullHouse);
      }
    }

    if (strongerHand.has(Hand.flush)) {
      const possibleFlash = choosePossibleFlash();

      if (possibleFlash) {
        possibleHands.push(possibleFlash);
      }
    }

    if (strongerHand.has(Hand.straight)) {
      const possibleStraight = choosePossibleStraight();

      if (possibleStraight) {
        possibleHands.push(possibleStraight);
      }
    }

    if (strongerHand.has(Hand.threeOfAKind)) {
      const possibleThreeOfAKind = choosePossibleThreeOfAKind();

      if (possibleThreeOfAKind) {
        possibleHands.push(possibleThreeOfAKind);
      }
    }

    if (strongerHand.has(Hand.twoPair)) {
      const possibleTwoPair = choosePossibleTwoPair();

      if (possibleTwoPair) {
        possibleHands.push(possibleTwoPair);
      }
    }

    if (strongerHand.has(Hand.pair)) {
      const possiblePair = choosePossiblePair();

      if (possiblePair) {
        possibleHands.push(possiblePair);
      }
    }

    if (strongerHand.has(Hand.highCard)) {
      const possibleHighCard = choosePossibleHighCard();

      if (possibleHighCard) {
        possibleHands.push(possibleHighCard);
      }
    }

    this._possibleHands = possibleHands;
  }

  private getStrongerHands() {
    const possibleHandSet = new Set<Hand>();

    for (const hand of Object.values(Hand)) {
      if (HAND_STRONGNESS[this._bestHand!] < HAND_STRONGNESS[hand]) {
        possibleHandSet.add(hand);
      }
    }

    return possibleHandSet;
  }
}

export function chooseRoyalFlush(cardsBySuit: Map<Suit, PlayingCard[]>) {
  for (const cards of cardsBySuit.values()) {
    if (cards.length < 5) continue;

    const choosen = cards.filter((card) => ROYAL_FLUSH.includes(card.rank));

    if (choosen.length === 5) return choosen;
  }

  return null;
}

export function chooseBestStraightFlush(cardsBySuit: Map<Suit, PlayingCard[]>) {
  for (const ranks of STRAIGHT_RANK_CONBINATIONS) {
    for (const cards of cardsBySuit.values()) {
      if (cards.length < 5) continue;

      const choosen = cards.filter((card) => ranks.includes(card.rank));

      if (choosen.length === 5) return choosen;
    }
  }

  return null;
}

// TODO add without kicker
export function chooseBestFourOfAKind(cardsByRank: Map<Rank, PlayingCard[]>) {
  let fourOfAKind = null;
  let kicker = null;

  for (const playingCards of cardsByRank.values()) {
    if (playingCards.length === 4) {
      fourOfAKind = playingCards;

      continue;
    }

    kicker = kicker ?? playingCards[0];
  }

  return fourOfAKind && kicker ? [...fourOfAKind, kicker] : null;
}

export function chooseBestFullHouse(cardsByRank: Map<Rank, PlayingCard[]>) {
  let threeOfAKind = null;
  let pair = null;

  for (const playingCards of cardsByRank.values()) {
    if (playingCards.length === 3) {
      threeOfAKind = playingCards;

      continue;
    }

    if (playingCards.length === 2) {
      pair = playingCards;

      continue;
    }
  }

  return threeOfAKind && pair ? [...threeOfAKind, ...pair] : null;
}

export function chooseBestFlush(cardsBySuit: Map<Suit, PlayingCard[]>) {
  for (const playingCards of cardsBySuit.values()) {
    if (playingCards.length < 5) continue;

    return playingCards.slice(0, 5);
  }

  return null;
}

export function chooseBestStraight(cardsByRank: Map<Rank, PlayingCard[]>) {
  if (cardsByRank.size < 5) return null;

  for (const ranks of STRAIGHT_RANK_CONBINATIONS) {
    if (ranks.every((rank) => cardsByRank.has(rank))) {
      return [
        cardsByRank.get(ranks[0])![0],
        cardsByRank.get(ranks[1])![1],
        cardsByRank.get(ranks[2])![2],
        cardsByRank.get(ranks[3])![3],
        cardsByRank.get(ranks[4])![4],
      ];
    }
  }

  return null;
}

// TODO add without kickers
export function chooseBestThreeOfAKind(cardsByRank: Map<Rank, PlayingCard[]>) {
  let threeOfAKind = null;
  let kicker1 = null;
  let kicker2 = null;

  for (const [rank, playingCards] of cardsByRank.entries()) {
    if (playingCards.length === 3) {
      threeOfAKind = playingCards;

      continue;
    }

    if (!kicker1) {
      kicker1 = playingCards[0];

      continue;
    }

    kicker2 = kicker2 ?? playingCards[0];
  }

  return threeOfAKind && kicker1 && kicker2
    ? [...threeOfAKind, kicker1, kicker2]
    : null;
}

// TODO add without kickers
export function chooseBestTwoPair(cardsByRank: Map<Rank, PlayingCard[]>) {
  let pair1 = null;
  let pair2 = null;
  let kicker = null;

  for (const playingCards of cardsByRank.values()) {
    if (!pair1 && 2 <= playingCards.length) {
      pair1 = playingCards.slice(0, 2);

      continue;
    }

    if (!pair2 && 2 <= playingCards.length) {
      pair2 = playingCards.slice(0, 2);

      continue;
    }

    kicker = kicker ?? playingCards[0];
  }

  return pair1 && pair2 && kicker ? [...pair1, ...pair2, kicker] : null;
}

// TODO add without kicker
export function chooseBestDeuce(cardsByRank: Map<Rank, PlayingCard[]>) {
  let deuce = null;
  let kicker1 = null;
  let kicker2 = null;
  let kicker3 = null;

  for (const playingCards of cardsByRank.values()) {
    if (2 <= playingCards.length) {
      deuce = playingCards.slice(0, 2);

      continue;
    }

    if (!kicker1) {
      kicker1 = playingCards[0];

      continue;
    }

    if (!kicker2) {
      kicker2 = playingCards[0];

      continue;
    }

    kicker3 = kicker3 ?? playingCards[0];
  }

  return deuce && kicker1 && kicker2 && kicker3
    ? [...deuce, kicker1, kicker2, kicker3]
    : null;
}

export function chooseBestHighCard(
  cardsByRank: Map<Rank, PlayingCard[]>,
  street: Street
) {
  const highcards = [];

  for (const cards of cardsByRank.values()) {
    if (highcards.length === 5) {
      break;
    }

    highcards.push(cards[0]);
  }

  return highcards;
}

export function choosePossibleRoyalFlush(
  cardsBySuit: Map<Suit, PlayingCard[]>,
  street: Street
): PossibleHand | null {
  for (const playingCards of cardsBySuit.values()) {
    const cards = playingCards.filter((card) =>
      ROYAL_FLUSH.includes(card.rank)
    );

    if (street === Street.preflop) {
      if (2 <= cards.length) {
        return {
          hand: Hand.royalFlush,
          cards,
          desireCards: [],
          outs: 0,
        };
      }
    }

    if (street === Street.flop) {
      if (3 <= cards.length) {
        return {
          hand: Hand.royalFlush,
          cards,
          desireCards: [],
          outs: 0,
        };
      }
    }

    if (street === Street.turn) {
      if (4 <= cards.length) {
        return {
          hand: Hand.royalFlush,
          cards,
          desireCards: [],
          outs: 0,
        };
      }
    }
  }

  return null;
}

export function choosePossibleStraightFlash(): PossibleHand | null {
  return null;
}

export function choosePossibleFourOfAKind(): PossibleHand | null {
  return null;
}

export function choosePossibleFullHouse(): PossibleHand | null {
  return null;
}

export function choosePossibleFlash(): PossibleHand | null {
  return null;
}

export function choosePossibleStraight(): PossibleHand | null {
  return null;
}

export function choosePossibleThreeOfAKind(): PossibleHand | null {
  return null;
}

export function choosePossibleTwoPair(): PossibleHand | null {
  return null;
}

export function choosePossiblePair(): PossibleHand | null {
  return null;
}

export function choosePossibleHighCard(): PossibleHand | null {
  return null;
}

export function calculateOuts(
  desireCards: PlayingCard[],
  openedCards: PlayingCard[],
  currentStreet: Street
): number {
  return 0;
}
