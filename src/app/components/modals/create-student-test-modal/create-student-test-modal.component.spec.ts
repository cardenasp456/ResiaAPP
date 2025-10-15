import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStudentTestModalComponent } from './create-student-test-modal.component';

describe('CreateStudentTestModalComponent', () => {
  let component: CreateStudentTestModalComponent;
  let fixture: ComponentFixture<CreateStudentTestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStudentTestModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStudentTestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
