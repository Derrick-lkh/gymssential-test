import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { ProductsComponent } from "./products/products.component";
import { CartComponent } from "./cart/cart.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";
import { LoginComponent } from "./login/login.component";
import { AccountDetailsComponent } from "./account-details/account-details.component";

import { HomePageComponent } from "./home-page/home-page.component";
import { ShopComponent } from "./shop/shop.component";
const appRoutes: Routes = [
  { path: "", redirectTo: "/main", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "main", component: HomePageComponent },
  { path: "shop", component: ShopComponent },
  {
    path: "product",
    component: ProductsComponent
  },
  {
    path: "product/:id",
    component: ProductDetailsComponent
  },
  { path: "cart", component: CartComponent },
  { path: "account", component: AccountDetailsComponent },
  { path: "login", component: LoginComponent },
  { path: "**", redirectTo: "/main" }
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModuleModule {}
