import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerIdentificationComponent } from './player-identification.component';

describe('PlayerIdentificationComponent', () => {
  let component: PlayerIdentificationComponent;
  let fixture: ComponentFixture<PlayerIdentificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerIdentificationComponent]
    });
    fixture = TestBed.createComponent(PlayerIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
