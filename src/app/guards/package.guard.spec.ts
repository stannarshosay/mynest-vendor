import { TestBed } from '@angular/core/testing';

import { PackageGuard } from './package.guard';

describe('PackageGuard', () => {
  let guard: PackageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PackageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
