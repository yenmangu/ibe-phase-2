import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricGamesComponent } from './historic-games.component';

describe('HistoricGamesComponent', () => {
  let component: HistoricGamesComponent;
  let fixture: ComponentFixture<HistoricGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricGamesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
