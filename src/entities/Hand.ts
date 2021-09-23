enum Hand {
  highCard = "HIGH_CARD",
  pair = "PAIR",
  twoPair = "TOW_PAIR",
  threeOfAKind = "THREE_OF_A_KIND",
  straight = "STRAIGHT",
  flush = "FLUSH",
  fullHouse = "FULL_HAUSE",
  fourOfAKind = "FOUR_OF_A_KIND",
  straightFlush = "STRAIGHT_FLUSH",
  royalFlush = "ROYAL_FLUSH",
}

export const HAND_STRONGNESS: Record<Hand, number> = {
  HIGH_CARD: 0,
  PAIR: 1,
  TOW_PAIR: 2,
  THREE_OF_A_KIND: 3,
  STRAIGHT: 4,
  FLUSH: 5,
  FULL_HAUSE: 6,
  FOUR_OF_A_KIND: 7,
  STRAIGHT_FLUSH: 8,
  ROYAL_FLUSH: 9,
};

export default Hand;
