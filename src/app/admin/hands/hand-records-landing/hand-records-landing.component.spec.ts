import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandRecordsLandingComponent } from './hand-records-landing.component';

describe('HandRecordsLandingComponent', () => {
  let component: HandRecordsLandingComponent;
  let fixture: ComponentFixture<HandRecordsLandingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HandRecordsLandingComponent]
    });
    fixture = TestBed.createComponent(HandRecordsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
