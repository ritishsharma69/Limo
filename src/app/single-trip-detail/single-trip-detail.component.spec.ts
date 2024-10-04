import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SingleTripDetailComponent } from './single-trip-detail.component';

describe('SingleTripDetailComponent', () => {
  let component: SingleTripDetailComponent;
  let fixture: ComponentFixture<SingleTripDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SingleTripDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleTripDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
