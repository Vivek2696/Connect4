import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplayerLoginComponent } from './multiplayer-login.component';

describe('MultiplayerLoginComponent', () => {
  let component: MultiplayerLoginComponent;
  let fixture: ComponentFixture<MultiplayerLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiplayerLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplayerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
