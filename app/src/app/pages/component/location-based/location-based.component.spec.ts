import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationBasedComponent } from './location-based.component';

describe('LocationBasedComponent', () => {
  let component: LocationBasedComponent;
  let fixture: ComponentFixture<LocationBasedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationBasedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationBasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
