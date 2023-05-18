import { Component, OnInit } from '@angular/core';
import { FormBuilder,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../_services/api.service';
@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.css']
})
export class BrokerComponent implements OnInit {

  title: string | undefined;
  registrationForm:any;
  submited = false;
  constructor(private router: Router, 
    private api : ApiService, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.title = this.route.snapshot.url[0].path;
    this.registrationForm = this.fb.group({
      first_name: ["",Validators.required],
      // ClientName: ["",Validators.required],
      last_name: ["",[Validators.required, ]],
      email: ["",[Validators.required,Validators.email]],
      password:["",[Validators.required,Validators.pattern(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
      )]],
      address:["",[Validators.required]],
      mobile_number:["",[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      aadhar_number:["",[Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(12), Validators.maxLength(12)]],
      documents:["",[Validators.required]],
      document_data:["",[Validators.required]],
      type:[""],
   
    });
 }
get f() { return this.registrationForm.controls}

 register(){
  this.submited = true;
  this.submited = true;
  if (this.registrationForm.invalid) {
    //  this.submited = false;
     return;
  }
  this.api.loader('start')

  let obj = JSON.parse(JSON.stringify(this.registrationForm.value));
  delete obj['document_data'];
  delete obj['type'];
   obj['role'] = 'admin';
   obj['mobile_number'] = parseInt(obj['mobile_number']);
   obj['aadhar_number'] = parseInt(obj['aadhar_number']);
  this.api.postData('broker/register',obj,'post').subscribe(res => {
    console.log(res);
    if(res['status'] == 1) {
      this.api.loader('stop')
      this.submited = false;
      this.api.showNotification('success', res['message']);
      this.router.navigate(['broker/list'])
    }else{      
      this.api.showNotification('error', res['message']);
      this.api.loader('stop')

      // this.updateFormdata({})
      
    }
    })

 }

 onfileUpload(event:any){
 // console.log(event.target.files[0]);
 let regex  =new RegExp('^.*\.(jpg|JPG|jpeg|JPEG|png|PNG)$')
 const reader = new FileReader();
 reader.readAsDataURL(event.target.files[0]);
 let type:any = event.target.files[0].type;
     // console.log(event.target.files[0])
 let filename:any = event.target.files[0].name;

     reader.onload = (event:any) => {
 
     let data =  event.target['result'];
     console.log('type',type)
     console.log('bs64',data)
     this.registrationForm.patchValue({
      documents :data,
      type:type
     })
     }
 }

}
