/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MazeComponent } from './maze.component';

describe('MazeComponent', () => {
  let component: MazeComponent;
  let fixture: ComponentFixture<MazeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MazeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MazeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
