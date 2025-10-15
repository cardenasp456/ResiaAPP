import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentStatusCheckModalComponent } from './student-status-check-modal.component';

describe('StudentStatusCheckModalComponent', () => {
  let component: StudentStatusCheckModalComponent;
  let fixture: ComponentFixture<StudentStatusCheckModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentStatusCheckModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentStatusCheckModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
