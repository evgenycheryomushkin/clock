import { Injectable } from '@angular/core';
import { Card } from '../data/card';
import { Rectangle } from '../data/rectangle';
import { Point } from '../data/point';

@Injectable({
  providedIn: 'root'
})
export class CardPlaceService {

  constructor() { }

  init() {
    console.log("Card Place Service initialized")
  }

  findPlace(cards: Card[], viewPort:Rectangle, w: number = 200, h: number = 100): Point {
    const d = 10
    for(var y = 50;; y += d) {
      for(var x = 700; x < viewPort.w - w; x += d) {
        const r: Rectangle = {x:x, y:y, w:w, h:h}
        var overlapsAll = false
        for(var i = 0; i < cards.length && !overlapsAll; i ++) {
         overlapsAll = overlapsAll || 
          !this.overlaps(cards[i].cardComponent.getBoundingRect(), r, d)
        }
        if (!overlapsAll) return {x:x+viewPort.x, y:y+viewPort.y}
      }
    }
    this.error()
  }
  overlaps(ri: DOMRect, r: Rectangle, d: number): boolean {
    if (ri.left + ri.width < r.x - d) return true
    if (ri.top + ri.height < r.y - d) return true
    if (r.x + r.w < ri.left - d) return true
    if (r.y + r.h < ri.top - d) return true
    return false
  }
  error() {
    throw new Error('Situation will never happen');
  }
}
