import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardModals } from './board-modals';

describe('BoardModals', () => {
  let component: BoardModals;
  let fixture: ComponentFixture<BoardModals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardModals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardModals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
