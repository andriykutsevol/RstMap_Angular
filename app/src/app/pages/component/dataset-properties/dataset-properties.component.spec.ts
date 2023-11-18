import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetPropertiesComponent } from './dataset-properties.component';

describe('DatasetPropertiesComponent', () => {
  let component: DatasetPropertiesComponent;
  let fixture: ComponentFixture<DatasetPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
