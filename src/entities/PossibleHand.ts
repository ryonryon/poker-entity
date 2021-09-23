import Hand from "./Hand";
import PlayingCard from "./PlayingCard";

export default interface PossibleHand {
  hand: Hand;
  cards: PlayingCard[];
  desireCards: PlayingCard[];
  outs: number;
}
