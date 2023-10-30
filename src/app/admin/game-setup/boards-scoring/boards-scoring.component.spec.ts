import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardsScoringComponent } from './boards-scoring.component';

describe('BoardsScoringComponent', () => {
  let component: BoardsScoringComponent;
  let fixture: ComponentFixture<BoardsScoringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardsScoringComponent]
    });
    fixture = TestBed.createComponent(BoardsScoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
