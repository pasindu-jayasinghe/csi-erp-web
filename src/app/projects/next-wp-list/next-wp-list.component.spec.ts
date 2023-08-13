import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextWpListComponent } from './next-wp-list.component';

describe('NextWpListComponent', () => {
  let component: NextWpListComponent;
  let fixture: ComponentFixture<NextWpListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextWpListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextWpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
