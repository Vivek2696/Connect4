import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaymenuComponent } from './replaymenu.component';

describe('ReplaymenuComponent', () => {
  let component: ReplaymenuComponent;
  let fixture: ComponentFixture<ReplaymenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplaymenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaymenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
