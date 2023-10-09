import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedOptionsDialogComponent } from './advanced-options-dialog.component';

describe('AdvancedOptionsDialogComponent', () => {
  let component: AdvancedOptionsDialogComponent;
  let fixture: ComponentFixture<AdvancedOptionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedOptionsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedOptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
