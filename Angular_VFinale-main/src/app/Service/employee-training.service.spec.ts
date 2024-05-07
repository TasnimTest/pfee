import { TestBed } from '@angular/core/testing';

import { EmployeeTrainingService } from './employee-training.service';

describe('EmployeeTrainingService', () => {
  let service: EmployeeTrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeTrainingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
