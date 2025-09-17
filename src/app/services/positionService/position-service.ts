import { Injectable } from '@angular/core';
import { urlConstant } from '../../../constants';
import { HttpClient } from '@angular/common/http';
import { CreatePositionModel } from '../../models/position.model';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private positionModuleUrl = urlConstant.apiUrl + urlConstant.positionModule;
  
  constructor(private http: HttpClient){}

  
    getPositionList(payload: any) {
      var getListUrl = this.positionModuleUrl + 'GetList';
      return this.http.post<any>(getListUrl, payload)
    }
  
    deletePosition(positionId: string) {
      var deleteUrl = this.positionModuleUrl + 'Delete/' + positionId;
      return this.http.get<any>(deleteUrl);
    }
  
    insertNewPosition(payload: CreatePositionModel) {
      var createPosition = this.positionModuleUrl + 'Create';
      return this.http.post<any>(createPosition, payload);
    }
}
