import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditBranch } from './create-edit-branch';

describe('CreateEditBranch', () => {
  let component: CreateEditBranch;
  let fixture: ComponentFixture<CreateEditBranch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditBranch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditBranch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
