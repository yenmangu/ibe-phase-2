import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpectateComponent } from './spectate.component';

describe('SpectateComponent', () => {
  let component: SpectateComponent;
  let fixture: ComponentFixture<SpectateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpectateComponent]
    });
    fixture = TestBed.createComponent(SpectateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
