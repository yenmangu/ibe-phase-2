import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsDatabaseComponent } from './teams-database.component';

describe('TeamsDatabaseComponent', () => {
  let component: TeamsDatabaseComponent;
  let fixture: ComponentFixture<TeamsDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamsDatabaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamsDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
