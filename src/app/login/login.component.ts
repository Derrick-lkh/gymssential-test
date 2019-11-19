import { Component, OnInit, Input } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { AppService } from "../app.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  contactForm: FormGroup;
  constructor(public AppService: AppService) {}

  ngOnInit() {
    this.contactForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }
  login() {
    var username, password;

    username = this.contactForm.controls.username.value;
    password = this.contactForm.controls.password.value;
    console.log(username, password);
    this.AppService.login({
      email: username,
      user_password: password
    });
  }
}
