import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs';
import { PositionService } from '../../services/positionService/position-service';

@Component({
  selector: 'app-position',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './position.html',
  styleUrl: './position.scss'
})
export class Position {
positions: any[] = [];
  pageSizeList: number[] = [25, 50, 100];
  tableHeaderList: any[] =[
    {
      value: 'Position Name',
      isSortable: true,
      sortColumn: 'PositionName'
    },
    {
      value: 'Position Code',
      isSortable: true,
      sortColumn: 'PositionCode'
    },
    {
      value: 'Actions',
      isSortable: false,
      isAction: true
    },
  ];

  sortingColumn: string = 'PositionName';
  isSortByDesc: boolean = false;

  pageSizeForm: FormControl = new FormControl(25);
  groupForm: FormControl = new FormControl('');
  nameForm: FormControl = new FormControl();
  codeForm: FormControl = new FormControl();

  pageIndex: number = 1;
  totalPages: number = 0;
  totalData: number = 0;

  pageLinks: number[] = [1, 2, 4];

  isOpenPositionForm: boolean = false;
  isCreateForm: boolean = true;
  isOpenDetail: boolean = false;
  selectedPosition!: any;

  constructor(private positionService: PositionService){
    this.activateFilterListener();
    this.fetchData();
  }

  activateFilterListener(){
    this.pageSizeForm.valueChanges.subscribe(x => {
      this.getPosition();
    });
    this.groupForm.valueChanges.subscribe(x => {
      this.getPosition();
    });
    this.nameForm.valueChanges
    .pipe(
      debounceTime(500)
    )
    .subscribe(x => {
      this.getPosition();
    });
    this.codeForm.valueChanges
    .pipe(
      debounceTime(500)
    )
    .subscribe(x => {
      this.getPosition();
    });
  }

  fetchData(){
    this.getPosition();
  }

  getPageSize(): number{
    return this.pageSizeForm.value;
  }


  getPosition(){
    var payload = {
      PageSize: this.pageSizeForm.value,
      PageIndex: this.pageIndex,
      SortOrder: this.isSortByDesc ? 'desc' : 'asc',
      OrderBy: this.sortingColumn,
      Filters: [
        {
          KeyName: 'PositionName',
          Value: this.nameForm.value ?? ''
        },
        {
          KeyName: 'PositionCode',
          Value: this.codeForm.value ?? ''
        },
      ]
    };
    this.positionService.getPositionList(payload).subscribe({
      next: (res: any) => {
        this.positions = res.Data.Data;
        this.totalPages = res.Data.PaginationInfo.TotalPages;
        this.totalData = res.Data.PaginationInfo.TotalData;
      }
    });
  }

  sortTable(columnName: string, isSortable: boolean){
    if(isSortable){
      this.isSortByDesc = !this.isSortByDesc;
      this.sortingColumn = columnName;
      this.getPosition();
    }
  }

  changePage(page: number){
    this.pageIndex = page;
    this.getPosition();
  }

  openPositionForm(actionType: string){
    this.isOpenPositionForm = true;
    this.isCreateForm = actionType == 'Add';
  }
  closePositionForm(){
    this.isOpenPositionForm = false;
    this.getPosition();
  }
  
  openDetailForm(position: any){
    this.selectedPosition = position;
    this.isOpenDetail = true;
  }
  closeDetailForm(){
    this.isOpenDetail = false;
  }

  deletePosition(username: string): void {
    this.positionService.deletePosition(username)
    .subscribe({
      next: res => {
        this.getPosition();
      }
    });
  }
}
