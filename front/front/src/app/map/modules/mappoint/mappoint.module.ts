import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class MappointModule { 
  order: number;
  name: string;
  description: string;
  coordninate: number[];
}
