import { Injectable } from '@angular/core';
import { urlConstant } from '../../../constants';
import { HttpClient } from '@angular/common/http';
import { CreateBranchModel } from '../../models/branch.model';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private branchModuleUrl = urlConstant.apiUrl + urlConstant.branchModule;
  
  constructor(private http: HttpClient){}

  
    getBranchList(payload: any) {
      var getListUrl = this.branchModuleUrl + 'GetList';
      return this.http.post<any>(getListUrl, payload)
    }
  
    deleteBranch(branchId: string) {
      var deleteUrl = this.branchModuleUrl + 'Delete/' + branchId;
      return this.http.get<any>(deleteUrl);
    }
  
    insertNewBranch(payload: CreateBranchModel) {
      var createBranch = this.branchModuleUrl + 'Create';
      return this.http.post<any>(createBranch, payload);
    }
}
