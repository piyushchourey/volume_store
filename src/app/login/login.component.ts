import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private api: ApiService
) { }

ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
}

// convenience getter for easy access to form fields
get f() { return this.form.controls; }


onSubmit() {
  this.submitted = true;

  // reset alerts on submit
  //this.alertService.clear();

  // stop here if form is invalid
  if (this.form.invalid) {
      return;
  }

  this.loading = true;
  console.log(this.f.email.value, this.f.password.value);
  // let user = {id:1, email: this.f.email.value, password: this.f.password.value , role:'super_admin'};
  // localStorage.setItem('currentUser', JSON.stringify(user));
  // const returnUrl = this.route.snapshot.queryParams['returnUrl'] 
  // || (user.role == "super_admin"?'admin':'township');
  // console.log(this.route.snapshot.queryParams['returnUrl']);
  // console.log(returnUrl);
  // this.api.showNotification('success','Logeed in Succesfully.')
  // this.router.navigate([returnUrl]);

  this.api.postData('login/',{email: this.f.email.value, password:this.f.password.value},'post').subscribe(res => {
    console.log(res);
    if(res['accessToken'] != null) {
      this.api.loader('stop')
      localStorage.setItem('currentUser', JSON.stringify(res));
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] 
        || (res.role == "super_admin"?'dashboard':'dashboard');
      // this.submited = false;
        this.router.navigate([returnUrl]);

      this.api.showNotification('success', 'Logged in successfully.');
    }else{      
      this.api.showNotification('error', res['message']);
      this.api.loader('stop')

      // this.updateFormdata({})
      
    }
    })
  // this.authenticationService.login(this.f.email.value, this.f.password.value)
  //     .pipe(first())
  //     .subscribe({
  //         next: () => {
  //             // get return url from query parameters or default to home page
  //             const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  //             this.router.navigateByUrl(returnUrl);
  //         },
  //         error: error => {
  //             //this.alertService.error(error);
  //             this.loading = false;
  //         }
  //     });
}

}
