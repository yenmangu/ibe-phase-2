import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFileComponent } from './download-file.component';

describe('DownloadFileComponent', () => {
  let component: DownloadFileComponent;
  let fixture: ComponentFixture<DownloadFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadFileComponent]
    });
    fixture = TestBed.createComponent(DownloadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
