import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandPaginationComponent } from './hand-pagination.component';

describe('HandPaginationComponent', () => {
  let component: HandPaginationComponent;
  let fixture: ComponentFixture<HandPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandPaginationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
