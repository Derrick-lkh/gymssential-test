import { Component, OnInit } from "@angular/core";
import { AppService } from "../app.service";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css", "../app.component.scss"]
})
export class ProductDetailsComponent implements OnInit {
  constructor(
    public AppService: AppService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  currentPage;
  productDetails;

  ngOnInit() {
    // this.AppService.checkLogin();
    // if (this.AppService.token != null) {
    //   this.AppService.WHOIS();
    // }
    // this.AppService.lauch_init();
    // console.log(this.route.snapshot.paramMap.get("id"));
    // this.AppService.initComplete.subscribe(() => {
    //   console.log("completed");
    //   this.AppService.loadProductDetails(
    //     this.route.snapshot.paramMap.get("id")
    //   );
    // });
    // this.AppService.productLoaded.subscribe(() => {
    //   this.productDetails = this.AppService.Product_details;
    //   console.log(this.productDetails);
    // });
    // this.AppService.cartUpdated.subscribe(() => {
    //   this.AppService.ListCart();
    //   this.router.navigate(["/cart"]);
    // });
  }

  relatedProductRedirect(n) {
    console.log(window.status.valueOf);
    this.router.navigate(["/product/" + n]);
    this.ngOnInit();
  }

  // Add to cart
  AddToCart() {
    // if (this.AppService.token != null) {
    //   console.log("added to cart");
    // }

    this.AppService.checkLogin(); // redirect if user is not logged in
    console.log(this.productDetails.product_info.product_id);
    console.log(this.AppService.cartList);
    var counter = 0;
    for (var i = 0; i < this.AppService.cartList.length; i++) {
      if (
        this.AppService.cartList[i].product_id ===
        this.productDetails.product_info.product_id
      ) {
        counter = counter + 1;
        console.log("Product exist");
        var newQty = this.AppService.cartList[i].qty + 1;
        this.AppService.updateCart(this.AppService.cartList[i].id, newQty);
      }
    }

    if (counter === 0) {
      this.AppService.AddToCart({
        user_id: this.AppService.currentUserId,
        product_id: this.productDetails.product_info.product_id,
        product_name: this.productDetails.product_info.product_name,
        product_price: this.productDetails.product_info.product_price,
        product_description: this.productDetails.product_info
          .product_description,
        product_image: this.productDetails.product_info.product_image,
        qty: 1
      });
    }
  }
}
