import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedBaseComponent } from './logged-base.component';

describe('LoggedBaseComponent', () => {
  let component: LoggedBaseComponent;
  let fixture: ComponentFixture<LoggedBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoggedBaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggedBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
