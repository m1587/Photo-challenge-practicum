import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyPhotoReportComponent } from './monthly-photo-report.component';

describe('MonthlyPhotoReportComponent', () => {
  let component: MonthlyPhotoReportComponent;
  let fixture: ComponentFixture<MonthlyPhotoReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyPhotoReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyPhotoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
