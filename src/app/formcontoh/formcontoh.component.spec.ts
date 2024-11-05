import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormcontohComponent } from './formcontoh.component';

describe('FormcontohComponent', () => {
  let component: FormcontohComponent;
  let fixture: ComponentFixture<FormcontohComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormcontohComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormcontohComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
