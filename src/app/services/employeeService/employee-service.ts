import { Injectable } from '@angular/core';
import {
  EmployeeData
} from '../../models/employee.model';
import { HttpClient } from '@angular/common/http';
import { urlConstant } from '../../../constants';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeeModuleUrl = urlConstant.apiUrl + urlConstant.employeeModule;

  constructor(private http: HttpClient){}

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
