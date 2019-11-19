import { Component, OnInit } from "@angular/core";
import { AppService } from "../app.service";

@Component({
  selector: "app-account-details",
  templateUrl: "./account-details.component.html",
  styleUrls: ["./account-details.component.css"]
})
export class AccountDetailsComponent implements OnInit {
  constructor(public AppService: AppService) {}

  ngOnInit() {
    this.AppService.checkLogin();
    if (this.AppService.token != null) {
      this.AppService.WHOIS();
    }
  }
}
