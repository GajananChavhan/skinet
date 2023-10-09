import { Injectable } from '@angular/core';
import { BehaviorSubject, retry } from 'rxjs';
import { Basket, BasketItem, BasketTotals } from '../shared/models/basket';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<Basket | null>(null);
  private basketTotalsSource = new BehaviorSubject<BasketTotals | null>(null);
  basketTotalsSource$ = this.basketTotalsSource.asObservable();
  basketSource$ = this.basketSource.asObservable();
  constructor(private http: HttpClient) { }

  getBasket(id: string) {
    return this.http.get<Basket>(this.baseUrl + 'basket?id=' + id).subscribe({
      next: basket => {
        this.basketSource.next(basket);
        this.calculateTotals();
      }
    });
  }

  setBasket(basket: Basket) {
    return this.http.post<Basket>(this.baseUrl + 'basket', basket).subscribe({
      next: basket => this.basketSource.next(basket)
    });
  }

  getCurretValueOfBasket() {
    return this.basketSource.value;
  }

  addItemToBasket(item: Product | BasketItem, quantity = 1) {
    if (this.isProduct(item))
      item = this.mapProductToBasketItem(item);
    const basket = this.getCurretValueOfBasket() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, item, quantity);
    this.setBasket(basket);
    this.calculateTotals();
  }

  removeItemsFromBasket(id: number, quantity = 1) {
    const basket = this.getCurretValueOfBasket();
    if (!basket) {
      return;
    }
    const item = basket.items.find(x => x.id === id);
    if (item) {
      item.quantity -= quantity;
      if (item.quantity === 0) {
        basket.items = basket.items.filter(x => x.id !== id);
      }
      if(basket.items.length > 0){
        this.setBasket(basket);
      }
      else {
        this.deleteBasket(basket)
      }
      this.calculateTotals();
    }
  }
  deleteBasket(basket: Basket) {
    return this.http.delete(this.baseUrl + 'basket?id='+basket.id).subscribe({
      next:()=>{
        this.basketSource.next(null);
        this.basketTotalsSource.next(null);
        localStorage.removeItem('basketId');
      }
    })
  }

  addOrUpdateItem(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[] {
    const item = items.find(x => x.id === itemToAdd.id);
    if (item) {
      item.quantity += quantity;
    }
    else {
      itemToAdd.quantity += quantity;
      items.push(itemToAdd);
    }
    return items;
  }

  createBasket(): Basket {
    const basket = new Basket();
    localStorage.setItem('basketId', basket.id);
    return basket;
  }

  mapProductToBasketItem(item: Product): BasketItem {
    return {
      id: item.id,
      productName: item.name,
      brand: item.productBrand,
      type: item.productType,
      quantity: 0,
      price: item.price,
      pictureUrl: item.pictureUrl
    }
  }
  private calculateTotals(){
    const basket = this.getCurretValueOfBasket();
    if(!basket){
      return;
    }
    const shipping = 0;
    const subtotal = basket.items.reduce((a,b)=>(b.price*b.quantity)+ a, 0);
    const total = subtotal + shipping;
    this.basketTotalsSource.next({shipping, subtotal, total});
  }
  isProduct(item: Product | BasketItem): item is Product {
    return (item as Product).productType !== undefined
  }
}
