import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentStatusTestModalComponent } from './student-status-test-modal.component';

describe('StudentStatusTestModalComponent', () => {
  let component: StudentStatusTestModalComponent;
  let fixture: ComponentFixture<StudentStatusTestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentStatusTestModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentStatusTestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
