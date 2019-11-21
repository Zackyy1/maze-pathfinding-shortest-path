/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MazeService } from './maze.service';

describe('MazeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MazeService]
    });
  });

  it('should ...', inject([MazeService], (service: MazeService) => {
    expect(service).toBeTruthy();
  }));
});
