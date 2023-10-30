import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamingNumberingComponent } from './naming-numbering.component';

describe('NamingNumberingComponent', () => {
  let component: NamingNumberingComponent;
  let fixture: ComponentFixture<NamingNumberingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NamingNumberingComponent]
    });
    fixture = TestBed.createComponent(NamingNumberingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
