import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRowDialogComponent } from './delete-row-dialog.component';

describe('DeleteRowDialogComponent', () => {
  let component: DeleteRowDialogComponent;
  let fixture: ComponentFixture<DeleteRowDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteRowDialogComponent]
    });
    fixture = TestBed.createComponent(DeleteRowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
