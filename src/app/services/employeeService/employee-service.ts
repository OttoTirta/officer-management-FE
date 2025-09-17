import { Injectable } from '@angular/core';
import {
  EmployeeData,
  EmployeeListFilter,
  EmployeePaginatedData,
} from '../../models/employee.model';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { urlConstant } from '../../../constants';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeeModuleUrl = urlConstant.apiUrl + urlConstant.employeeModule;

  constructor(private http: HttpClient){}

  private groupList: string[] = [
    'Engineering',
    'Product Development',
    'Sales & Marketing',
    'Operations',
    'Customer Success',
    'Finance & Accounting',
    'Information Technology',
    'Legal & Compliance',
    'Research & Development',
    'Executive Leadership',
  ];

  getGroupList() {
    return of(this.groupList);
  }
  getEmployeeList(payload: any) {
    var getListUrl = this.employeeModuleUrl + 'GetList';
    return this.http.post<any>(getListUrl, payload)
  }

  deleteEmployeeByUsername(employeeId: string) {
    var deleteUrl = this.employeeModuleUrl + 'Delete/' + employeeId;
    return this.http.get<any>(deleteUrl);
  }

  insertNewEmployee(data: EmployeeData) {
    
  }

}
