import {Injectable} from '@angular/core';
import {firstValueFrom} from "rxjs";
import {ClockData} from "../../clock/clock/data/ClockData";
import {TSMap} from "typescript-map";
import {EventHubService} from "../event-hub.service";
import {HttpClient} from "@angular/common/http";
import {CardEvent} from "../../data/card-event";

export class PresetChangeEvent extends CardEvent {
  static EVENT_TYPE = "PRESET_CHANGE_EVENT"
  static PRESET_NAME = "PRESET_NAME"
  constructor(presetName: string) {
    super(PresetChangeEvent.EVENT_TYPE, PresetChangeEvent.PRESET_NAME, presetName);
  }
  getPresetName() {
    return this.data.get(PresetChangeEvent.PRESET_NAME)
  }
}

@Injectable({
  providedIn: 'root'
})
export class PresetService {
  presets: TSMap<string, ClockData> = new TSMap<string, ClockData>()
  currentClock: ClockData

  constructor(private eventHub: EventHubService,
              private  http: HttpClient) { }

  async init() {
    await this.loadAllPresets();
    this.setCurrentPreset("circle")
  }

  private async loadAllPresets() {
    await this.loadPreset("nature", async () => {
      return await firstValueFrom(this.http.get("/assets/nature.json")) as ClockData
    })
    await this.loadPreset("circle", async () => {
      return await firstValueFrom(this.http.get("/assets/circle.json")) as ClockData
    })
  }

  setCurrentPreset(name: string) {
    this.currentClock = this.presets.get(name)
    this.eventHub.emit(
      new PresetChangeEvent(name)
    )
  }

  async loadPreset(name: string, load: () => Promise<ClockData>) {
    const clock = await load()
    this.presets.set(name, clock)
    return name
  }
}
