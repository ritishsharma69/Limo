import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonConfirmationModalComponent } from './common-confirmation-modal.component';

describe('CommonConfirmationModalComponent', () => {
  let component: CommonConfirmationModalComponent;
  let fixture: ComponentFixture<CommonConfirmationModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonConfirmationModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
