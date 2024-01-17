import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinExtractionComponent } from './lin-extraction.component';

describe('LinExtractionComponent', () => {
  let component: LinExtractionComponent;
  let fixture: ComponentFixture<LinExtractionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinExtractionComponent]
    });
    fixture = TestBed.createComponent(LinExtractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
