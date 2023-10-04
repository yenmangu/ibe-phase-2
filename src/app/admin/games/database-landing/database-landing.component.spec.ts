import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseLandingComponent } from './database-landing.component';

describe('DatabaseLandingComponent', () => {
  let component: DatabaseLandingComponent;
  let fixture: ComponentFixture<DatabaseLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
