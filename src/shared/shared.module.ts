import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';



@NgModule({
  declarations: [
    FileUploaderComponent,
 
  ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  providers: [],
  exports: [
    FileUploaderComponent,

  ]
})
export class SharedModule { }
