import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShopService } from './shop.service';
import { Product } from '../shared/models/product';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search') searchTerm?: ElementRef;
  public products: Product[] = [];
  public brands: Brand[] = [];
  public types: Type[] = [];
  public shopParams = new ShopParams();
  public sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: low to high', value: 'priceAsc' },
    { name: 'Price: high to low', value: 'priceDesc' }
  ];
  public totalCount = 0;

  constructor(private shopService: ShopService) {

  }
  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }


  private getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => {
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalCount = response.count
      },
      error: error => console.log(error)
    });
  }

  private getBrands() {
    this.shopService.getBrands().subscribe({
      next: response => this.brands = [{ id: 0, name: "All" }, ...response],
      error: error => console.log(error)
    });
  }

  private getTypes() {
    this.shopService.getTypes().subscribe({
      next: response => this.types = [{ id: 0, name: "All" }, ...response],
      error: error => console.log(error)
    });
  }

  public onBrandSelected(brandId: number) {
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }
  public onTypeSelected(typeId: number) {
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  public onSortSelected(sort: any) {
    this.shopParams.sort = sort.target.value;
    this.getProducts();
  }

  public onPageChanged(event: any) {
    if (this.shopParams.pageNumber !== event.page) {
      this.shopParams.pageNumber = event.page
      this.getProducts();
    }
  }
  public onSearch() {
    this.shopParams.search = this.searchTerm?.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }
  public onReset() {
    this.shopParams.search = '';
    if(this.searchTerm) this.searchTerm.nativeElement.value='';
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
