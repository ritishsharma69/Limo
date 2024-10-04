import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavigateButtonComponent } from './navigate-button.component';

describe('NavigateButtonComponent', () => {
  let component: NavigateButtonComponent;
  let fixture: ComponentFixture<NavigateButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NavigateButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
