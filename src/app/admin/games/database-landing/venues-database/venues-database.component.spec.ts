import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenuesDatabaseComponent } from './venues-database.component';

describe('VenuesDatabaseComponent', () => {
  let component: VenuesDatabaseComponent;
  let fixture: ComponentFixture<VenuesDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenuesDatabaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenuesDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
