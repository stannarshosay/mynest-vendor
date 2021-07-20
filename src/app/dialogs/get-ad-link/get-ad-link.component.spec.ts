import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAdLinkComponent } from './get-ad-link.component';

describe('GetAdLinkComponent', () => {
  let component: GetAdLinkComponent;
  let fixture: ComponentFixture<GetAdLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetAdLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetAdLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
