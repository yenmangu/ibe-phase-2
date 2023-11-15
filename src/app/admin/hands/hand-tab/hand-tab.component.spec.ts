import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandTabComponent } from './hand-tab.component';

describe('HandTabComponent', () => {
  let component: HandTabComponent;
  let fixture: ComponentFixture<HandTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HandTabComponent]
    });
    fixture = TestBed.createComponent(HandTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
