import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchTablesComponent } from './match-tables.component';

describe('MatchTablesComponent', () => {
  let component: MatchTablesComponent;
  let fixture: ComponentFixture<MatchTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchTablesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
