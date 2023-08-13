import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkPlanDetailsComponent } from './work-plan-details.component';

describe('WorkPlanDetailsComponent', () => {
  let component: WorkPlanDetailsComponent;
  let fixture: ComponentFixture<WorkPlanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkPlanDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
