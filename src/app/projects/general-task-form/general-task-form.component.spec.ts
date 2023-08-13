import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTaskFormComponent } from './general-task-form.component';

describe('GeneralTaskFormComponent', () => {
  let component: GeneralTaskFormComponent;
  let fixture: ComponentFixture<GeneralTaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralTaskFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralTaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
