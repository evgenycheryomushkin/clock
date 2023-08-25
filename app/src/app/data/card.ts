import { CardComponent } from "../card/card.component";

/**
 * Card representation. Contains bounding rectangle (not used).
 * Contains id, header, description, creation date, position
 */
export class Card{
    constructor(
      public id: string,
      public header: string,
      public description: string,
      public created: Date
      ) {
      }
    /**
     * Backward reference to card component,
     * that contains given card
     */
    public cardComponent: CardComponent
}
