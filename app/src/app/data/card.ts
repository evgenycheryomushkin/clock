import { Point } from "@angular/cdk/drag-drop";
import { ElementRef } from "@angular/core";

export class Card{
    rect: any;
    constructor(
      public id: string,
      public header: string,
      public description: string,
      public created: Date, 
      public position: Point) {
      }
    }
  