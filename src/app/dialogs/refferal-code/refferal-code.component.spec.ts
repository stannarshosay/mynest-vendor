import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefferalCodeComponent } from './refferal-code.component';

describe('RefferalCodeComponent', () => {
  let component: RefferalCodeComponent;
  let fixture: ComponentFixture<RefferalCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefferalCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefferalCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
