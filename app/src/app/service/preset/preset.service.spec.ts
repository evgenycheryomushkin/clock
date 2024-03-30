import { TestBed } from '@angular/core/testing';

import {PresetChangeEvent, PresetService} from './preset.service';
import {EventHubService} from "../event-hub.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ClockData} from "../../clock/clock/data/ClockData";

describe('PresetService', () => {
  let presetService: PresetService;
  let eventHub: EventHubService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })

    eventHub = TestBed.inject(EventHubService)
    presetService = TestBed.inject(PresetService)
  });

  it('should be created',  async () => {
    expect(presetService).toBeTruthy()
  });

  it('should create EventHubService', (done) => {
    expect(eventHub).toBeTruthy()
    done()
  });

  async function loadPresets() {
    await presetService.loadPreset("nature", async () => {
      const naturePreset = require("../../../assets/nature.json")
      return naturePreset as ClockData
    })
    await presetService.loadPreset("circle", async () => {
      const naturePreset = require("../../../assets/circle.json")
      return naturePreset as ClockData
    })
  }

  it ('should load resources', async () => {
    await loadPresets();
    expect(presetService.presets.size()).toEqual(2)
  })
  it ('should fire PresetChangeEvent when change preset', async () => {
    await loadPresets();
    var changeCalled = false
    eventHub.subscribe(PresetChangeEvent.EVENT_TYPE, (event) => {
      const changeEvent = event as PresetChangeEvent
    })
    presetService.setCurrentPreset("nature")
    expect(changeCalled).toBeTruthy()
  })
});
