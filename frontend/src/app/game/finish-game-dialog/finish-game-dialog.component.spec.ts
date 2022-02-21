import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishGameDialogComponent } from './finish-game-dialog.component';

describe('FinishGameDialogComponent', () => {
  let component: FinishGameDialogComponent;
  let fixture: ComponentFixture<FinishGameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishGameDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
