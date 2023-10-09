import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketComponent } from './basket.component';
import { BasketRoutingModule } from './basket-routing.module';



@NgModule({
  declarations: [
    BasketComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BasketRoutingModule
  ],
})
export class BasketModule { }
