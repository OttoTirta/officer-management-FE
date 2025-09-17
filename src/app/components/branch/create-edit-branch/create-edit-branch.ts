import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BranchService } from '../../../services/branchService/branch-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-edit-branch',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-edit-branch.html',
  styleUrl: './create-edit-branch.scss'
})
export class CreateEditBranch {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  branchData: any;

  constructor(
    private branchService: BranchService
  ){
    this.resetForm();
  }
  private resetForm(): void {
    this.branchData = {
      branchName: '',
      branchCode: ''
    };
  }
  
  insertNewBranch(){
    var payload = {
      BranchName: this.branchData.branchName,
      BranchCode: this.branchData.branchCode
    }
    this.branchService.insertNewBranch(payload).subscribe({
      next: res => {
        this.closeForm();
      }
    })
  }

  closeForm(): void {
    this.close.emit();
  }
}
