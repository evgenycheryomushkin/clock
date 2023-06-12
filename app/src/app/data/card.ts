import { Point } from "@angular/cdk/drag-drop";
import { ElementRef } from "@angular/core";

export class Card{
    rect: any;
    constructor(
      public id: number,
      public header: String,
      public description: String,
      public time:String, 
      public position: Point) {
      }
    }
  