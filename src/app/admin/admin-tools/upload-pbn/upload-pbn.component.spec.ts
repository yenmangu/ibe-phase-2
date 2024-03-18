import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPbnComponent } from './upload-pbn.component';

describe('UploadPbnComponent', () => {
  let component: UploadPbnComponent;
  let fixture: ComponentFixture<UploadPbnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadPbnComponent]
    });
    fixture = TestBed.createComponent(UploadPbnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
