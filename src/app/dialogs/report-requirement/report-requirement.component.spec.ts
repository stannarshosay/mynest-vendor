import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRequirementComponent } from './report-requirement.component';

describe('ReportRequirementComponent', () => {
  let component: ReportRequirementComponent;
  let fixture: ComponentFixture<ReportRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportRequirementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
