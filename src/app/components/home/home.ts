import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employeeService/employee-service';
import { EmployeeData, EmployeeListFilter } from '../../models/employee.model';
import { FormControl, ReactiveFormsModule} from "@angular/forms";
import { debounceTime } from 'rxjs';
import { CreateEditForm } from "./create-edit-form/create-edit-form";
import { DetailForm } from "./detail-form/detail-form";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, CreateEditForm, DetailForm, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  employees: any[] = [];
  pageSizeList: number[] = [25, 50, 100];
  tableHeaderList: any[] =[
    {
      value: 'Name',
      isSortable: true,
      sortColumn: 'FullName'
    },
    {
      value: 'Branch',
      isSortable: true,
      sortColumn: 'BranchName'
    },
    {
      value: 'Position',
      isSortable: true,
      sortColumn: 'PositionName'
    },
    {
      value: 'Contract Remaining',
      isSortable: true,
      sortColumn: 'ContractMonthRemaining'
    },
    {
      value: 'Actions',
      isSortable: false,
      isAction: true
    },
  ];

  sortingColumn: string = 'FullName';
  isSortByDesc: boolean = false;

  pageSizeForm: FormControl = new FormControl(25);
  nameForm: FormControl = new FormControl();
  branchForm: FormControl = new FormControl();
  positionForm: FormControl = new FormControl();

  pageIndex: number = 1;
  totalPages: number = 0;
  totalData: number = 0;

  pageLinks: number[] = [1, 2, 4];

  isOpenEmployeeForm: boolean = false;
  isCreateForm: boolean = true;
  isOpenDetail: boolean = false;
  selectedEmployee!: EmployeeData;

  constructor(private employeeService: EmployeeService){
    this.activateFilterListener();
    this.fetchData();
  }

  activateFilterListener(){
    this.pageSizeForm.valueChanges.subscribe(x => {
      this.getEmployee();
    });
    this.nameForm.valueChanges
    .pipe(
      debounceTime(500)
    )
    .subscribe(x => {
      this.getEmployee();
    });
    this.branchForm.valueChanges
    .pipe(
      debounceTime(500)
    )
    .subscribe(x => {
      this.getEmployee();
    });
    this.positionForm.valueChanges
    .pipe(
      debounceTime(500)
    )
    .subscribe(x => {
      this.getEmployee();
    });
  }

  fetchData(){
    this.getEmployee();
  }

  getPageSize(): number{
    return this.pageSizeForm.value;
  }


  getEmployee(){
    var payload = {
      PageSize: this.pageSizeForm.value,
      PageIndex: this.pageIndex,
      SortOrder: this.isSortByDesc ? 'desc' : 'asc',
      OrderBy: this.sortingColumn,
      Filters: [
        {
          KeyName: 'FullName',
          Value: this.nameForm.value ?? ''
        },
        {
          KeyName: 'BranchName',
          Value: this.branchForm.value ?? ''
        },
        {
          KeyName: 'PositionName',
          Value: this.branchForm.value ?? ''
        },
      ]
    };
    this.employeeService.getEmployeeList(payload).subscribe({
      next: res => {
        this.employees = res.Data.Data;
        this.totalPages = res.Data.PaginationInfo.TotalPages;
        this.totalData = res.Data.PaginationInfo.TotalData;
      }
    });
  }

  sortTable(columnName: string, isSortable: boolean){
    if(isSortable){
      this.isSortByDesc = !this.isSortByDesc;
      this.sortingColumn = columnName;
      this.getEmployee();
    }
  }

  changePage(page: number){
    this.pageIndex = page;
    this.getEmployee();
  }

  openEmployeeForm(actionType: string){
    this.isOpenEmployeeForm = true;
    this.isCreateForm = actionType == 'Add';
  }
  closeEmployeeForm(){
    this.isOpenEmployeeForm = false;
    this.getEmployee();
  }
  
  openDetailForm(employee: EmployeeData){
    this.selectedEmployee = employee;
    this.isOpenDetail = true;
  }
  closeDetailForm(){
    this.isOpenDetail = false;
  }

  editEmployee(employee: EmployeeData): void {
    this.selectedEmployee = employee;
    this.openEmployeeForm('Edit');
  }

  deleteEmployee(username: string): void {
    this.employeeService.deleteEmployeeByUsername(username)
    .subscribe({
      next: res => {
        this.getEmployee();
      }
    });
  }
}
