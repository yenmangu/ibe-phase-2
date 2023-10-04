import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTableDialogComponent } from './event-table-dialog.component';

describe('EventTableDialogComponent', () => {
  let component: EventTableDialogComponent;
  let fixture: ComponentFixture<EventTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTableDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
