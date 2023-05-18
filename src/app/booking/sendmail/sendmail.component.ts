import { Component, OnInit } from '@angular/core';
import { FormBuilder,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../_services/api.service';

@Component({
  selector: 'app-sendmail',
  templateUrl: './sendmail.component.html',
  styleUrls: ['./sendmail.component.css']
})
export class SendmailComponent implements OnInit {
  to:any;
  subject:any
  content:any;
  title: string | undefined;
  id:any;
  bookingdetail:any;
  sendmailform:any;
  submited:any=false

  constructor(private router: Router, 
    private api : ApiService, private route: ActivatedRoute, private fb: FormBuilder) { 
  

      this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id)
  
    }

    setFroms(){
      this.sendmailform = this.fb.group({
        toEmail: [this.bookingdetail && this.bookingdetail.email? this.bookingdetail.email:"",Validators.required],
        subject: ["",Validators.required],
        content: ["",Validators.required],
      });
    
    }
    get f() { return this.sendmailform.controls}

  ngOnInit(): void {
    this.title = this.route.snapshot.url[0].path;
    if(this.id) {
      this.getbooking();
    }else{
      this.setFroms()
    }
  }
  getbooking(){
    this.api.fetchData('Booking/getAll', {id:this.id}, "GET").subscribe((res:any) => {
      if(res && res.status ==  1) {
        this.bookingdetail = res['data'][0];
        this.setFroms()
      }else {
        this.bookingdetail = []
      }
    })
  }
  onSendmail() {
    this.submited = true;
    // this.submited = true;
    console.log(this.sendmailform.value)
    if (this.sendmailform.invalid) {
      //  this.submited = false;
       return;
    }
    let obj = JSON.parse(JSON.stringify(this.sendmailform.value));
    obj['bookingId'] =this.id
    console.log(obj)

    this.api.postData('booking/sendMail',obj,'post').subscribe(res => {
      console.log(res);
      if(res['status'] == 1) {
        this.api.loader('stop')
        this.submited = false;
        this.api.showNotification('success', res['message']);
        this.router.navigate(['booking/list'])
      }else{      
        this.api.showNotification('error', res['message']);
        this.api.loader('stop')
  
        // this.updateFormdata({})
        
      }
      })
  
  }

}
