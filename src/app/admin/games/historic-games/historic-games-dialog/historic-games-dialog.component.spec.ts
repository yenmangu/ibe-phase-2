import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricGamesDialogComponent } from './historic-games-dialog.component';

describe('HistoricGamesDialogComponent', () => {
  let component: HistoricGamesDialogComponent;
  let fixture: ComponentFixture<HistoricGamesDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricGamesDialogComponent]
    });
    fixture = TestBed.createComponent(HistoricGamesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
