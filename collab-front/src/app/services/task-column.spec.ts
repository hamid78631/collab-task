import { TestBed } from '@angular/core/testing';

import { TaskColumn } from './task-column';

describe('TaskColumn', () => {
  let service: TaskColumn;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskColumn);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
