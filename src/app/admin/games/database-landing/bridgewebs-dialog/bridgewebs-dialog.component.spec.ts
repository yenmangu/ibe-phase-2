import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BridgewebsDialogComponent } from './bridgewebs-dialog.component';

describe('BridgewebsDialogComponent', () => {
  let component: BridgewebsDialogComponent;
  let fixture: ComponentFixture<BridgewebsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BridgewebsDialogComponent]
    });
    fixture = TestBed.createComponent(BridgewebsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
