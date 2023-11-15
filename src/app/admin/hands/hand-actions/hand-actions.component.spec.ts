import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandActionsComponent } from './hand-actions.component';

describe('HandActionsComponent', () => {
  let component: HandActionsComponent;
  let fixture: ComponentFixture<HandActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HandActionsComponent]
    });
    fixture = TestBed.createComponent(HandActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
