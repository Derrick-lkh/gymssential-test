import { Component, OnInit } from "@angular/core";
import { AppService } from "../app.service";
@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"]
})
export class CartComponent implements OnInit {
  constructor(public AppService: AppService) {}

  currentPage = "cart";
  options = [];
  selectedAddress = "hgPda-y0SsL-t2fzw";
  ngOnInit() {
    this.currentPage = "cart";
    this.AppService.checkLogin();
    if (this.AppService.token != null) {
      this.AppService.WHOIS();
    }

    for (var i = 0; i < 21; i++) {
      this.options.push(i);
    }
    console.log(this.options);
  }

  checkout() {
    this.AppService.checkLogin();
    this.currentPage = "checkout";
  }

  qtyChange(event, id) {
    //console.log(id);
    // console.log(event.srcElement.value);
    if (event.srcElement.value === "0") {
      console.log("removed");
      this.AppService.removeCart(id);
    } else {
      this.AppService.updateCart(id, event.srcElement.value);
    }
  }

  selectAdd(id) {
    // console.log(id);
    this.selectedAddress = id;
  }

  payment() {
    var orderID =
      this.AppService.randomString(10) + "-" + this.AppService.randomString(10);

    // Create order
    this.AppService.CreateOrder({
      order_id: orderID,
      user_id: this.AppService.currentUserId,
      total_amount: this.AppService.subtotal,
      delivery_info: this.selectedAddress,
      order_status: "Processing",
      transactions_id: null
    });

    // console.log("clicked");
    var checkoutArr = [];

    for (var i = 0; i < this.AppService.cartList.length; i++) {
      checkoutArr.push({
        name: this.AppService.cartList[i].product_name,
        sku: this.AppService.cartList[i].product_id,
        price: this.AppService.cartList[i].product_price,
        currency: "SGD",
        quantity: this.AppService.cartList[i].qty
      });
      this.AppService.CreateOrderItem({
        order_id: orderID,
        product_id: this.AppService.cartList[i].product_id,
        product_price: this.AppService.cartList[i].product_price,
        qty: this.AppService.cartList[i].qty
      });
      this.AppService.cartOrder(this.AppService.cartList[i].id, orderID);
    }
    // console.log(checkoutArr);
    this.AppService.makePayment(checkoutArr, this.AppService.subtotal, orderID);
  }
}
