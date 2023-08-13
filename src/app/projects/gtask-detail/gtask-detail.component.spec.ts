import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GtaskDetailComponent } from './gtask-detail.component';

describe('GtaskDetailComponent', () => {
  let component: GtaskDetailComponent;
  let fixture: ComponentFixture<GtaskDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GtaskDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GtaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
