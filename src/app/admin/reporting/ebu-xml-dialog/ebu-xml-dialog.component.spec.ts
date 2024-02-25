import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbuXmlDialogComponent } from './ebu-xml-dialog.component';

describe('EbuXmlDialogComponent', () => {
  let component: EbuXmlDialogComponent;
  let fixture: ComponentFixture<EbuXmlDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EbuXmlDialogComponent]
    });
    fixture = TestBed.createComponent(EbuXmlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
