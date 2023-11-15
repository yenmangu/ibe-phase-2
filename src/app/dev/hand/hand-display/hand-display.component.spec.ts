import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandDisplayComponent } from './hand-display.component';

describe('HandDisplayComponent', () => {
  let component: HandDisplayComponent;
  let fixture: ComponentFixture<HandDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HandDisplayComponent]
    });
    fixture = TestBed.createComponent(HandDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
