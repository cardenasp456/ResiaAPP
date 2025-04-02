import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCurriculumModalComponent } from './edit-curriculum-modal.component';

describe('EditCurriculumModalComponent', () => {
  let component: EditCurriculumModalComponent;
  let fixture: ComponentFixture<EditCurriculumModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCurriculumModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCurriculumModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
