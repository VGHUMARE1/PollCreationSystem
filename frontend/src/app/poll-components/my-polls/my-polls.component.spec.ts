import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPollsComponent } from './my-polls.component';

describe('MyPollsComponent', () => {
  let component: MyPollsComponent;
  let fixture: ComponentFixture<MyPollsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPollsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
