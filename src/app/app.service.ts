import { Injectable, EventEmitter } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";

import { CookieService } from "ngx-cookie-service";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AppService {
  // Event Emitter
  initComplete = new EventEmitter<void>();
  productLoaded = new EventEmitter<void>();
  cartLoaded = new EventEmitter<void>();
  cartUpdated = new EventEmitter<void>();

  constructor(
    public httpClient: HttpClient,
    private CookieService: CookieService,
    public router: Router
  ) {}
  url = "http://localhost";

  // token // User Data
  token;
  userDetails;
  currentUserId;
  isUser = false;
  // cart Details
  cartList = [];
  subtotal;
  shipping;
  orderTotal;

  deliveryList = [];

  // Declare Variables
  Product_list = [];
  Category_list = [];

  // Product Details page
  Product_details;

  // Functions
  lauch_init() {
    this.loadProducts();
    this.loadCategory();
  }

  initDone() {
    this.initComplete.emit();
  }

  // Check Login Status
  checkLogin() {
    this.token = this.CookieService.get("token");
    // console.log(this.token);
    if (!this.token) {
      console.log("not logged in");
      this.router.navigate(["login"]);
    } else {
      console.log("Proceed");
    }
  }

  WHOIS() {
    console.log("whois");
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "auth-token": this.token
    });
    const options = {
      headers: httpHeaders
    };
    console.log(this.token);
    this.httpClient
      .get<any[]>(this.url + ":3000/api/whois", options)
      .subscribe(data => {
        console.log(data);
        this.currentUserId = data;

        // Loading user related data
        this.loadUserDetails();
        this.ListDelivery();

        // Cart
        if (this.token != null && this.currentUserId != null) {
          console.log("listing cart");
          this.ListCart();
        }
      });
  }

  // User Details
  loadUserDetails() {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "auth-token": this.token
    });
    const options = {
      headers: httpHeaders
    };
    return this.httpClient
      .get<any[]>(
        this.url + ":3000/api/user/get_details/" + this.currentUserId,
        options
      )
      .subscribe(data => {
        console.log(data);
        this.userDetails = data;
        this.isUser = true;
      });
  }

  // Login
  login(info) {
    console.log(info);
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json"
      // 'auth-token': this.UserService.auth_token
    });
    const options = {
      headers: httpHeaders
    };
    return this.httpClient
      .post<any>(
        this.url + ":3000/api/auth/check",
        {
          info: info
        },
        options
      )
      .subscribe(
        response => {
          console.log(response);
          // this.storage.set("token", response.token);
          this.userDetails = response.userInfo;
          this.router.navigate(["home"]);
          this.CookieService.set("token", response.token);
          this.token = this.CookieService.get("token");
        },
        err => {
          console.log(err.error);
        }
      );
  }

  // PRODUCTS
  loadProducts() {
    console.log("the app is running");
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json"
      // "auth-token": this.token
    });
    const options = {
      headers: httpHeaders
    };
    return this.httpClient
      .get<any[]>(this.url + ":3000/api/product/get", options)
      .subscribe(data => {
        console.log(data);
        this.Product_list = data;
      });
  }

  // Category
  loadCategory() {
    console.log("the app is running");
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json"
      // "auth-token": this.token
    });
    const options = {
      headers: httpHeaders
    };
    return this.httpClient
      .get<any[]>(this.url + ":3000/api/category/get", options)
      .subscribe(data => {
        console.log(data);
        this.Category_list = data;
        this.initComplete.emit();
      });
  }

  // Product Details Page
  loadProductDetails(id) {
    var product_info;
    var product_bullet;
    for (var i = 0; i < this.Product_list.length; i++) {
      console.log(this.Product_list[i]);
      if (this.Product_list[i].product_id === id) {
        product_info = this.Product_list[i];
      }
    }
    // bullet
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json"
    });
    const options = {
      headers: httpHeaders
    };
    this.httpClient
      .get<any[]>(this.url + ":3000/api/product_bullet/get/" + id, options)
      .subscribe(data => {
        console.log(data);
        product_bullet = data;
        console.log({ product_info, product_bullet });
        this.Product_details = { product_info, product_bullet };
        this.productLoaded.emit();
      });
  }

  // Cart
  AddToCart(info) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "auth-token": this.token
    });
    const options = {
      headers: httpHeaders
    };
    return this.httpClient
      .post<any>(
        this.url + ":3000/api/cart/post",
        {
          info: info
        },
        options
      )
      .subscribe(response => {
        this.cartUpdated.emit();
      });
  }

  ListCart() {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "auth-token": this.token
    });
    const options = {
      headers: httpHeaders
    };
    return this.httpClient
      .get<any[]>(
        this.url + ":3000/api/cart/get/" + this.currentUserId,
        options
      )
      .subscribe(data => {
        console.log(data);
        this.cartList = data;
        this.subtotal = 0;
        this.cartList.map(x => {
          this.subtotal = this.subtotal + x.product_price * x.qty;
        });
        console.log(this.subtotal);
      });
  }

  updateCart(id, qty) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "auth-token": this.token
    });
    const options = {
      headers: httpHeaders
    };

    return this.httpClient
      .put<any>(
        this.url + ":3000/api/cart/put/" + id,
        {
          info: {
            qty: qty
          }
        },
        options
      )
      .subscribe(response => {
        this.cartUpdated.emit();
        this.ListCart();
      });
  }

  removeCart(id) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "auth-token": this.token
    });
    const options = {
      headers: httpHeaders
    };
    return this.httpClient
      .delete<any>(this.url + ":3000/api/cart/remove/" + id, options)
      .subscribe(response => {
        this.ListCart();
      });
  }

  // Delivery
  ListDelivery() {
    // console.log(user_id);
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "auth-token": this.token
    });
    const options = {
      headers: httpHeaders
    };
    return this.httpClient
      .get<any[]>(
        this.url + ":3000/api/delivery/get/" + this.currentUserId,
        options
      )
      .subscribe(data => {
        console.log(data);
        this.deliveryList = data;
      });
  }

  // Payment Statements // ! Important !
  makePayment(item, total, orderID) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "auth-token": this.token
    });
    const options = {
      headers: httpHeaders
    };
    return this.httpClient
      .post<any>(
        this.url + ":3000/api/paypal/post/" + orderID,
        {
          info: item,
          total: total
        },
        options
      )
      .subscribe(response => {
        console.log(response);
        this.router.navigate(["/home"]);
        window.open(response.link, "_system");
      });
  }

  CreateOrder(info) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "auth-token": this.token
    });
    const options = {
      headers: httpHeaders
    };
    return this.httpClient
      .post<any>(
        this.url + ":3000/api/order/create",
        {
          info: info
        },
        options
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  CreateOrderItem(info) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "auth-token": this.token
    });
    const options = {
      headers: httpHeaders
    };
    return this.httpClient
      .post<any>(
        this.url + ":3000/api/order_item/create",
        {
          info: info
        },
        options
      )
      .subscribe(response => {
        // this.cartUpdated.emit();
        console.log(response);
      });
  }

  cartOrder(id, orderID) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "auth-token": this.token
    });
    const options = {
      headers: httpHeaders
    };

    return this.httpClient
      .put<any>(
        this.url + ":3000/api/cart/put/" + id,
        {
          info: {
            order_number: orderID
          }
        },
        options
      )
      .subscribe(response => {
        // this.cartUpdated.emit();
        // console.log("reloaded");
        console.log(response);
      });
  }

  randomString(length) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split(
      ""
    );

    if (!length) {
      length = Math.floor(Math.random() * chars.length);
    }

    var str = "";
    for (var i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }
}
