import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialBoardComponent } from './tutorial-board.component';

describe('TutorialBoardComponent', () => {
  let component: TutorialBoardComponent;
  let fixture: ComponentFixture<TutorialBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
