import { TestBed } from '@angular/core/testing';

import { TaskColumnService } from './task-column';

describe('TaskColumn', () => {
  let service: TaskColumnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskColumnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
