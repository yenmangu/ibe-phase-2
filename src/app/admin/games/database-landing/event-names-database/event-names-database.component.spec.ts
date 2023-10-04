import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventNamesDatabaseComponent } from './event-names-database.component';

describe('EventNamesDatabaseComponent', () => {
  let component: EventNamesDatabaseComponent;
  let fixture: ComponentFixture<EventNamesDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventNamesDatabaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventNamesDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
