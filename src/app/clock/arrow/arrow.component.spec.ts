import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinuteComponent } from './arrow.component';

describe('MinuteComponent', () => {
  let component: MinuteComponent;
  let fixture: ComponentFixture<MinuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinuteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
