import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CreateEditForm } from '../home/create-edit-form/create-edit-form';
import { DetailForm } from '../home/detail-form/detail-form';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs';
import { BranchService } from '../../services/branchService/branch-service';

@Component({
  selector: 'app-branch',
  imports: [ReactiveFormsModule, CreateEditForm, DetailForm, CommonModule],
  templateUrl: './branch.html',
  styleUrl: './branch.scss'
})
export class Branch {
branchs: any[] = [];
  pageSizeList: number[] = [25, 50, 100];
  tableHeaderList: any[] =[
    {
      value: 'Branch Name',
      isSortable: true,
      sortColumn: 'BranchName'
    },
    {
      value: 'Branch Code',
      isSortable: true,
      sortColumn: 'BranchCode'
    },
    {
      value: 'Actions',
      isSortable: false,
      isAction: true
    },
  ];

  sortingColumn: string = 'BranchName';
  isSortByDesc: boolean = false;

  pageSizeForm: FormControl = new FormControl(25);
  groupForm: FormControl = new FormControl('');
  nameForm: FormControl = new FormControl();
  codeForm: FormControl = new FormControl();

  pageIndex: number = 1;
  totalPages: number = 0;
  totalData: number = 0;

  pageLinks: number[] = [1, 2, 4];

  isOpenBranchForm: boolean = false;
  isCreateForm: boolean = true;
  isOpenDetail: boolean = false;
  selectedBranch!: any;

  constructor(private branchService: BranchService){
    this.activateFilterListener();
    this.fetchData();
  }

  activateFilterListener(){
    this.pageSizeForm.valueChanges.subscribe(x => {
      this.getBranch();
    });
    this.groupForm.valueChanges.subscribe(x => {
      this.getBranch();
    });
    this.nameForm.valueChanges
    .pipe(
      debounceTime(500)
    )
    .subscribe(x => {
      this.getBranch();
    });
    this.codeForm.valueChanges
    .pipe(
      debounceTime(500)
    )
    .subscribe(x => {
      this.getBranch();
    });
  }

  fetchData(){
    this.getBranch();
  }

  getPageSize(): number{
    return this.pageSizeForm.value;
  }


  getBranch(){
    var payload = {
      PageSize: this.pageSizeForm.value,
      PageIndex: this.pageIndex,
      SortOrder: this.isSortByDesc ? 'desc' : 'asc',
      OrderBy: this.sortingColumn,
      Filters: [
        {
          KeyName: 'BranchName',
          Value: this.nameForm.value ?? ''
        },
        {
          KeyName: 'BranchCode',
          Value: this.codeForm.value ?? ''
        },
      ]
    };
    this.branchService.getBranchList(payload).subscribe({
      next: (res: any) => {
        this.branchs = res.Data.Data;
        this.totalPages = res.Data.PaginationInfo.TotalPages;
        this.totalData = res.Data.PaginationInfo.TotalData;
      }
    });
  }

  sortTable(columnName: string, isSortable: boolean){
    if(isSortable){
      this.isSortByDesc = !this.isSortByDesc;
      this.sortingColumn = columnName;
      this.getBranch();
    }
  }

  changePage(page: number){
    this.pageIndex = page;
    this.getBranch();
  }

  openBranchForm(actionType: string){
    this.isOpenBranchForm = true;
    this.isCreateForm = actionType == 'Add';
  }
  closeBranchForm(){
    this.isOpenBranchForm = false;
    this.getBranch();
  }
  
  openDetailForm(branch: any){
    this.selectedBranch = branch;
    this.isOpenDetail = true;
  }
  closeDetailForm(){
    this.isOpenDetail = false;
  }

  deleteBranch(username: string): void {
    this.branchService.deleteBranch(username)
    .subscribe({
      next: res => {
        this.getBranch();
      }
    });
  }
}
