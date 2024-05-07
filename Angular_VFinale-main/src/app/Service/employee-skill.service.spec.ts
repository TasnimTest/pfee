import { TestBed } from '@angular/core/testing';

import { EmployeeSkillService } from './employee-skill.service';

describe('EmployeeSkillService', () => {
  let service: EmployeeSkillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeSkillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
