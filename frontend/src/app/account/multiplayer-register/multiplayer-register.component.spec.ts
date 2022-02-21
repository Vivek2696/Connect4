import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplayerRegisterComponent } from './multiplayer-register.component';

describe('MultiplayerRegisterComponent', () => {
  let component: MultiplayerRegisterComponent;
  let fixture: ComponentFixture<MultiplayerRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiplayerRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplayerRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
