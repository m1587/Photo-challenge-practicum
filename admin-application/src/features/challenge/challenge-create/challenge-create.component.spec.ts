import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeCreateComponent } from './challenge-create.component';

describe('ChallengeCreateComponent', () => {
  let component: ChallengeCreateComponent;
  let fixture: ComponentFixture<ChallengeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
