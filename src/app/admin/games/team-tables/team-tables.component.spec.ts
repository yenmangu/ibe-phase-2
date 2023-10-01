import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTablesComponent } from './team-tables.component';

describe('TeamTablesComponent', () => {
  let component: TeamTablesComponent;
  let fixture: ComponentFixture<TeamTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamTablesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
