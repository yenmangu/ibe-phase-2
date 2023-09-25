import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerDatabaseComponent } from './player-database.component';

describe('PlayerDatabaseComponent', () => {
  let component: PlayerDatabaseComponent;
  let fixture: ComponentFixture<PlayerDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerDatabaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
