import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendQouteComponent } from './send-qoute.component';

describe('SendQouteComponent', () => {
  let component: SendQouteComponent;
  let fixture: ComponentFixture<SendQouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendQouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendQouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
