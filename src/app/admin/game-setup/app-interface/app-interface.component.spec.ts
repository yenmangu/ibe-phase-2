import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppInterfaceComponent } from './app-interface.component';

describe('AppInterfaceComponent', () => {
  let component: AppInterfaceComponent;
  let fixture: ComponentFixture<AppInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppInterfaceComponent]
    });
    fixture = TestBed.createComponent(AppInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
