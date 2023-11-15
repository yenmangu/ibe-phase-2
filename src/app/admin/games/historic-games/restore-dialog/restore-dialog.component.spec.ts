import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoreDialogComponent } from './restore-dialog.component';

describe('RestoreDialogComponent', () => {
  let component: RestoreDialogComponent;
  let fixture: ComponentFixture<RestoreDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestoreDialogComponent]
    });
    fixture = TestBed.createComponent(RestoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
