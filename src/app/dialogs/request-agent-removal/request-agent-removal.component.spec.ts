import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAgentRemovalComponent } from './request-agent-removal.component';

describe('RequestAgentRemovalComponent', () => {
  let component: RequestAgentRemovalComponent;
  let fixture: ComponentFixture<RequestAgentRemovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestAgentRemovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestAgentRemovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
