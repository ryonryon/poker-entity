import { chooseRoyalFlush, chooseBestStraightFlush } from "./PlayerHand";
import PlayingCard from "./PlayingCard";
import Rank from "./Rank";
import Suit from "./Suit";

describe("chooseRoyalFlush", () => {
  it.each<[string, string | null]>([
    ["AsKsQsJsTs9s8s", "AsKsQsJsTs"],
    ["AsKsQsJsTs8d5h", "AsKsQsJsTs"],
    ["AdKsTh9s5s4s3s", null],
  ])(`(%s) returns %s`, (arg, expected) => {
    const { cardsBySuit } = buildCards(toPlayingCards(arg)!);

    expect(chooseRoyalFlush(cardsBySuit)).toEqual(toPlayingCards(expected));
  });
});

describe("chooseBestStraightFlush", () => {
  it.each<[string, string | null]>([
    ["AsKsQsJsTs9s8s", "KsQsJsTs9s"],
    ["AhKhQhJhTh9h8h", "KhQhJhTh9h"],
    ["AcKcQcJcTc9c8c", "KcQcJcTc9c"],
    ["AdKdQdJdTd9d8d", "KdQdJdTd9d"],
    ["AsKsQsJsTs9s8s", "KsQsJsTs9s"],
  ])(`(%s) returns %s`, (arg, expected) => {
    const { cardsBySuit } = buildCards(toPlayingCards(arg)!);

    expect(chooseBestStraightFlush(cardsBySuit)).toEqual(
      toPlayingCards(expected)
    );
  });
});

function toPlayingCards(value: string | null): PlayingCard[] | null {
  if (value === null) return null;

  const cards = [];

  for (let i = 0; i < value.length; i += 2) {
    cards.push({
      rank: CHAR_RANKS[value[i]],
      suit: CHAR_SUITS[value[i + 1]],
    });
  }

  return cards;
}

const CHAR_RANKS: Record<string, Rank> = {
  A: Rank.ace,
  "2": Rank.deuce,
  "3": Rank.three,
  "4": Rank.four,
  "5": Rank.five,
  "6": Rank.six,
  "7": Rank.seven,
  "8": Rank.eight,
  "9": Rank.nine,
  T: Rank.ten,
  J: Rank.jack,
  Q: Rank.queen,
  K: Rank.king,
};

const CHAR_SUITS: Record<string, Suit> = {
  s: Suit.spade,
  h: Suit.heart,
  d: Suit.diamond,
  c: Suit.club,
};

function buildCards(cards: PlayingCard[]): {
  cardsByRank: Map<Rank, PlayingCard[]>;
  cardsBySuit: Map<Suit, PlayingCard[]>;
} {
  // const cards = cardsStrings.map(toPlayingCard);
  const cardsBySuit = new Map<Suit, PlayingCard[]>();
  const cardsByRank = new Map<Rank, PlayingCard[]>();

  for (const card of cards) {
    if (!cardsBySuit.has(card.suit)) {
      cardsBySuit.set(card.suit, []);
    }

    cardsBySuit.get(card.suit)!.push(card);

    if (!cardsByRank.has(card.rank)) {
      cardsByRank.set(card.rank, []);
    }

    cardsByRank.get(card.rank)!.push(card);
  }

  return { cardsBySuit, cardsByRank };
}
