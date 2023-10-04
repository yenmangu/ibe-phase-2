import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTableDialogComponent } from './team-table-dialog.component';

describe('TeamTableDialogComponent', () => {
  let component: TeamTableDialogComponent;
  let fixture: ComponentFixture<TeamTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamTableDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
