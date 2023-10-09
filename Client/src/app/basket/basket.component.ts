import { Component } from '@angular/core';
import { BasketService } from './basket.service';
import { BasketItem } from '../shared/models/basket';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent {

  constructor(public basketService: BasketService) {
    
  }
  increamentQuantity(item: BasketItem){
    this.basketService.addItemToBasket(item);
  }

  removeItem(id:number, quantity=1){
    this.basketService.removeItemsFromBasket(id, quantity);
  }
}
