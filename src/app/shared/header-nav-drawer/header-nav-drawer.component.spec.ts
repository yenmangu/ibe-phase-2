import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNavDrawerComponent } from './header-nav-drawer.component';

describe('HeaderNavDrawerComponent', () => {
  let component: HeaderNavDrawerComponent;
  let fixture: ComponentFixture<HeaderNavDrawerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderNavDrawerComponent]
    });
    fixture = TestBed.createComponent(HeaderNavDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
