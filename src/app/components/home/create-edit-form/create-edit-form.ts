import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { EmployeeData } from '../../../models/employee.model';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employeeService/employee-service';
import { BranchService } from '../../../services/branchService/branch-service';
import { PositionService } from '../../../services/positionService/position-service';

@Component({
  selector: 'app-create-edit-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-edit-form.html',
  styleUrl: './create-edit-form.scss',
  providers: [DatePipe]
})
export class CreateEditForm implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() isCreate: boolean = true;
  @Input() employeeData!: any;
  @Output() close = new EventEmitter<void>();

  branchList: any[] = [];
  positionList: any[] = [];

  errorMessage: string | undefined;
  today: string;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isOpen'].currentValue && this.isCreate){
      this.resetForm();
    } 
  }

  constructor(
    private employeeService: EmployeeService,
    private branchService: BranchService,
    private positionService: PositionService,
    private datePipe: DatePipe
  ){
    this.today = new Date().toISOString().split('T')[0];
    this.resetForm();
    this.getBranch();
    this.getPosition();
  }
  getBranch(){
    var payload = {
      PageSize: 100,
      PageIndex: 1,
      SortOrder: 'desc',
      OrderBy: 'BranchName',
      Filters: []
    };
    this.branchService.getBranchList(payload).subscribe({
      next: (res: any) => {
        this.branchList = res.Data.Data;
      }
    });
  }
  getPosition(){
    var payload = {
      PageSize: 100,
      PageIndex: 1,
      SortOrder: 'desc',
      OrderBy: 'PositionName',
      Filters: []
    };
    this.positionService.getPositionList(payload).subscribe({
      next: (res: any) => {
        this.positionList = res.Data.Data;
      }
    });
  }
  private resetForm(): void {
    this.employeeData = {
      firstName: '',
      lastName: '',
      branchId: '',
      positionId: '',
      contractStartDate: new Date(),
      contractEndDate: new Date()
    };
  }
  
  get contractStartDateValue(): string {
    if (this.employeeData.contractStartDate) {
      const date = new Date(this.employeeData.contractStartDate);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return date.toISOString().slice(0, 10);
    }
    return '';
  }

  set contractStartDateValue(value: string) {
    this.employeeData.contractStartDate = new Date(value);
  }
  
  get contractEndDateValue(): string {
    if (this.employeeData.contractEndDate) {
      const date = new Date(this.employeeData.contractEndDate);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return date.toISOString().slice(0, 10);
    }
    return '';
  }

  set contractEndDateValue(value: string) {
    this.employeeData.contractEndDate = new Date(value);
  }

  getTodayDate(){
    return new Date();  
  }
  
  insertNewEmployee(){
    var payload = {
      FirstName: this.employeeData.firstName,
      LastName: this.employeeData.lastName,
      BranchId: this.employeeData.branchId,
      PositionId: this.employeeData.positionId,
      ContractStartDate: this.datePipe.transform(this.employeeData.contractStartDate, 'yyyy-MM-dd'),
      ContractEndDate: this.datePipe.transform(this.employeeData.contractEndDate, 'yyyy-MM-dd')
    }
    this.employeeService.insertNewEmployee(payload).subscribe({
      next: res => {
        this.closeForm();
      }
    })
  }

  editEmployee(){
    // this.employeeService.editEmployee(this.employeeData).subscribe({
    //   next: res => {
    //     if (res.responseCode == 200){
    //       this.closeForm();
    //     }
    //     else if(res.responseCode == 400){
    //       this.errorMessage = res.message;
    //     }
    //   }
    // })
  }

  saveEmployee(): void {
    this.errorMessage = undefined;
    if(this.isCreate){
      this.insertNewEmployee();
    }
    else{
      this.editEmployee();
    }
  }

  closeForm(): void {
    this.close.emit();
  }
}
