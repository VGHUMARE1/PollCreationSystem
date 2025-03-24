import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollAnalysisComponent } from './poll-analysis.component';

describe('PollAnalysisComponent', () => {
  let component: PollAnalysisComponent;
  let fixture: ComponentFixture<PollAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
