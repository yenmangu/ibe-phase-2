import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerTableDialogComponent } from './player-table-dialog.component';

describe('PlayerTableDialogComponent', () => {
  let component: PlayerTableDialogComponent;
  let fixture: ComponentFixture<PlayerTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerTableDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
