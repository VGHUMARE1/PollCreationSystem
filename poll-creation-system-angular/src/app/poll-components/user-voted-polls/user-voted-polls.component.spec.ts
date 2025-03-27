import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVotedPollsComponent } from './user-voted-polls.component';

describe('UserVotedPollsComponent', () => {
  let component: UserVotedPollsComponent;
  let fixture: ComponentFixture<UserVotedPollsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserVotedPollsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserVotedPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
