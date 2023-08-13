import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextWpFormComponent } from './next-wp-form.component';

describe('NextWpFormComponent', () => {
  let component: NextWpFormComponent;
  let fixture: ComponentFixture<NextWpFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextWpFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextWpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
