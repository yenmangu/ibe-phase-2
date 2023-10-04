import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueTableDialogComponent } from './venue-table-dialog.component';

describe('VenueTableDialogComponent', () => {
  let component: VenueTableDialogComponent;
  let fixture: ComponentFixture<VenueTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenueTableDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenueTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
