import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyProgressFormComponent } from './daily-progress-form.component';

describe('DailyProgressFormComponent', () => {
  let component: DailyProgressFormComponent;
  let fixture: ComponentFixture<DailyProgressFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyProgressFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyProgressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
