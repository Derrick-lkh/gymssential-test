import { Component, OnInit } from "@angular/core";
import { AppService } from "../app.service";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"]
})
export class ProductsComponent implements OnInit {
  constructor(public AppService: AppService) {}

  // Declare Variable
  selectedCategory = "all";
  ngOnInit() {
    this.AppService.lauch_init();
  }

  selectCat(event) {
    console.log(event);
    console.log(event.srcElement.value);
    this.selectedCategory = event.srcElement.value;
  }

  goToProduct(product_id) {
    console.log(product_id);
  }
}
