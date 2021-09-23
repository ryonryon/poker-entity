import Rank from "../entities/Rank";

export const ROYAL_FLUSH = [
  Rank.ace,
  Rank.king,
  Rank.queen,
  Rank.jack,
  Rank.ten,
];

export const STRAIGHT_RANK_CONBINATIONS = [
  [Rank.king, Rank.queen, Rank.jack, Rank.ten, Rank.nine],
  [Rank.queen, Rank.jack, Rank.ten, Rank.nine, Rank.eight],
  [Rank.jack, Rank.ten, Rank.nine, Rank.eight, Rank.seven],
  [Rank.ten, Rank.nine, Rank.eight, Rank.seven, Rank.six],
  [Rank.nine, Rank.eight, Rank.seven, Rank.six, Rank.five],
  [Rank.eight, Rank.seven, Rank.six, Rank.five, Rank.four],
  [Rank.seven, Rank.six, Rank.five, Rank.four, Rank.three],
  [Rank.six, Rank.five, Rank.four, Rank.three, Rank.deuce],
  [Rank.five, Rank.four, Rank.three, Rank.deuce, Rank.ace],
];
