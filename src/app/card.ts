import { Point } from "@angular/cdk/drag-drop";

export class Card{
    constructor(
      public id: number,
      public header: String,
      public description: String,
      public time:String, 
      public position: Point) {}
  }
  