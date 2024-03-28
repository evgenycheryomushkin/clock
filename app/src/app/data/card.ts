import {Point} from "@angular/cdk/drag-drop";
import {CardComponent} from "../card/card.component";

/**
 * Card representation. Contains bounding rectangle (not used).
 * Contains id, header, description, creation date, position
 */
export class Card{
    constructor(
      public id: string,
      public header: string,
      public description: string,
      public created: number,
      public position: Point
      ) {
      }
    /**
     * Backward reference to card component,
     * that contains given card
     */
    public cardComponent: CardComponent

  copy() {
    return new Card(
        this.id, this.header, this.description, this.created, {x: this.position.x, y: this.position.y}
      )
  }
}
