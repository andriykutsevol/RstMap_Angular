import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaBasedComponent } from './area-based.component';

describe('AreaBasedComponent', () => {
  let component: AreaBasedComponent;
  let fixture: ComponentFixture<AreaBasedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaBasedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaBasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
