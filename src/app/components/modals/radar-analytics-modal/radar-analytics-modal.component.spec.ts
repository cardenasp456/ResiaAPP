import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadarAnalyticsModalComponent } from './radar-analytics-modal.component';

describe('RadarAnalyticsModalComponent', () => {
  let component: RadarAnalyticsModalComponent;
  let fixture: ComponentFixture<RadarAnalyticsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadarAnalyticsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadarAnalyticsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
