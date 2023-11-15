import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BboUploadComponent } from './bbo-upload.component';

describe('BboUploadComponent', () => {
  let component: BboUploadComponent;
  let fixture: ComponentFixture<BboUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BboUploadComponent]
    });
    fixture = TestBed.createComponent(BboUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
