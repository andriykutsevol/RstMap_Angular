import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZillowGmapComponent } from './zillow-gmap.component';

describe('ZillowGmapComponent', () => {
  let component: ZillowGmapComponent;
  let fixture: ComponentFixture<ZillowGmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZillowGmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZillowGmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
