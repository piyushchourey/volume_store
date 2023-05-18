import { Component, OnInit } from '@angular/core';
import { FormBuilder,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  title: string | undefined;
  registrationForm:any;
  submited = false;
  townshiplist:any =[];
  blocklist:any =[];
  brokerList:any = [];
  AllblockData:any = [];
  plotslist:any = [];
  id:any;
  bookingdetail:any;
  constructor(private router: Router, 
    private api : ApiService, private route: ActivatedRoute, private fb: FormBuilder) { 
      this.getBrokerList()
      this.getTownshipList()
      this.getBlocklist()

      this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id)
  
    }
    setFroms(){
      this.registrationForm = this.fb.group({
        townshipId: [this.bookingdetail && this.bookingdetail.townshipId ? this.bookingdetail.townshipId:"",Validators.required],
        blockId: [this.bookingdetail && this.bookingdetail.blockId ? this.bookingdetail.blockId:"",Validators.required],
        plotId: [this.bookingdetail && this.bookingdetail.plotId ? this.bookingdetail.plotId:"",Validators.required],
        // ClientName: [this.bookingdetail && this.bookingdetail.town ? this.bookingdetail:"",Validators.required],
        client_name: [this.bookingdetail && this.bookingdetail.client_name ? this.bookingdetail.client_name:"",[Validators.required, ]],
        email: [this.bookingdetail && this.bookingdetail.email ? this.bookingdetail.email:"",[Validators.required,Validators.email]],
        mobile:[this.bookingdetail && this.bookingdetail.mobile ? this.bookingdetail.mobile:"",[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        aadharcardNumber:[this.bookingdetail && this.bookingdetail.aadharcardNumber ? this.bookingdetail.aadharcardNumber:"",[Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(12), Validators.maxLength(12)]],
    
      aadharcardDoc:[this.bookingdetail && this.bookingdetail.aadharcardDoc ? this.bookingdetail.aadharcardDoc:"",[Validators.required]],
      aadharcardDocData:[this.bookingdetail && this.bookingdetail.aadharcardDoc ? this.bookingdetail.aadharcardDoc:"",[Validators.required]],
      salarySlipDoc:[this.bookingdetail && this.bookingdetail.salarySlipDoc ? this.bookingdetail.salarySlipDoc:"",[Validators.required]],
      salarySlipDocData:[this.bookingdetail && this.bookingdetail.salarySlipDoc ? this.bookingdetail.salarySlipDoc:"",[Validators.required]],
      agreementDoc:[this.bookingdetail && this.bookingdetail.agreementDoc ? this.bookingdetail.agreementDoc:"",[Validators.required]],
      agreementDocData:[this.bookingdetail && this.bookingdetail.agreementDoc ? this.bookingdetail.agreementDoc:"",[Validators.required]],
      plotAmount:[this.bookingdetail && this.bookingdetail.plotAmount ? this.bookingdetail.plotAmount:"",[Validators.required]],
      bookingAmount:[this.bookingdetail && this.bookingdetail.bookingAmount ? this.bookingdetail.bookingAmount:"",[Validators.required]],
      paymentMode:[this.bookingdetail && this.bookingdetail.paymentMode ? this.bookingdetail.paymentMode:"",[Validators.required]],
      description:[this.bookingdetail && this.bookingdetail.description ? this.bookingdetail.description:"",[Validators.required]],
      status:[this.bookingdetail && this.bookingdetail.status ? this.bookingdetail.status:""],
      commission_type:[this.bookingdetail && this.bookingdetail.commission_type ? this.bookingdetail.commission_type:"",[Validators.required]],
      commission_type_amount:[this.bookingdetail && this.bookingdetail.commission_type_amount ? this.bookingdetail.commission_type_amount:"",],
      commission_amount:[this.bookingdetail && this.bookingdetail.commission_amount ? this.bookingdetail.commission_amount:"",],
      brokerId:[this.bookingdetail && this.bookingdetail.brokerId ? this.bookingdetail.brokerId:"",[Validators.required]],
     
      });
      if(this.id){

        this.onchangeTownship({set:'form'})
        this.onchangeBlock({set:'form'})
      }
    }

  ngOnInit(): void {
    this.title = this.route.snapshot.url[0].path;
    if(this.id) {
      this.getbooking();
    }else{
      this.setFroms()
    }

 }
get f() { return this.registrationForm.controls}

 register(){
  this.submited = true;
  // this.submited = true;
  console.log(this.registrationForm.value)
  if (this.registrationForm.invalid) {
    //  this.submited = false;
     return;
  }
  this.api.loader('start')

  let obj = JSON.parse(JSON.stringify(this.registrationForm.value));
  // delete obj['aadha'];
  // delete obj['type'];
  //  obj['role'] = 'admin';
   obj['status'] = 1;
   delete obj['salarySlipDocData'] 
   delete obj['agreementDocData'] 
   delete obj['aadharcardDocData'] 
   let endpoint = this.id ? 'update':'register'
   if(this.id) {
    let matches = (obj.agreementDoc).match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    console.log(matches);
    if(null == matches) {
      obj.agreementDoc = ''
    }
    let matches2 = (obj.salarySlipDoc).match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    console.log(matches2);
    if(null == matches2) {
      obj.salarySlipDoc = ''
    }
    let matches3 = (obj.aadharcardDocData).match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    console.log(matches3);
    if(null == matches3) {
      obj.aadharcardDocData = ''
    }
    obj['id'] = this.id;
    this.api.putData('booking/update',obj,'post').subscribe(res => {
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
   }else{
     this.api.postData('booking/register',obj,'post').subscribe(res => {
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

 onfileUpload(event:any, key:any){
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
     if(key == 'aadharcard') {
       this.registrationForm.patchValue({
        aadharcardDoc :data,
       })

     }
     if(key == 'salaryslip') {
       this.registrationForm.patchValue({
        salarySlipDoc :data,
       })

     }
     if(key == 'aggrement') {
       this.registrationForm.patchValue({
        agreementDoc :data,
       })

     }
     }
 }

 getTownshipList() {
  this.api.fetchData('township/getAll', {}, "Get").subscribe((res:any) => {
    if(res && res.status ==  1) {
      this.townshiplist = res['data'];
    }else {
      this.townshiplist = []
    }
  })
}
 getBrokerList() {
  this.api.fetchData('broker/getAll', {}, "Get").subscribe((res:any) => {
    if(res && res.status ==  1) {
      this.brokerList = res['data'];
    }else {
      this.brokerList = []
    }
  })
}
getBlocklist() {
  this.api.fetchData('block/getAll', {}, "Get").subscribe((res:any) => {
    if(res && res.status ==  1) {
      this.AllblockData = res['data'];
    }else {
      this.AllblockData = []
    }
  })
}
 
onchangeTownship(event:any){
  if(event.set == 'form') {
    console.log(this.bookingdetail.townshipId)
    let id = this.bookingdetail.townshipId
    console.log(this.townshiplist)
    let data = this.townshiplist.filter((f:any) => f.id == id)
    console.log(data)
    this.blocklist = data[0]['blocks']

    console.log(data)
  }else {
  let id = event.target.value
  let data = this.townshiplist.filter((f:any) => f.id == id)
  console.log(data)
  this.blocklist = data[0]['blocks']
  this.registrationForm.patchValue({
    blockId:'',
    plotId:''

  });
}
}

changeCommisiontype(event:any){
  console.log(event.target.value);
  if(event.target.value == 'flat'){
    this.registrationForm.controls.commission_type_amount.setValidators(null);
    this.registrationForm.patchValue({
      commission_amount:''
    })
    
  }else{
    
    this.registrationForm.controls.commission_type_amount.setValidators(Validators.required);
  }
}
onchangeBlock(event:any){
  if(event.set == 'form') {
    
    console.log('block',this.bookingdetail.blockId, this.AllblockData)
    let id = this.bookingdetail.blockId
    let data = this.AllblockData.filter((f:any) => f.id == id);
    console.log(data)
    this.plotslist = data[0]['plots']

    console.log(data)
  }else {

    let id = event.target.value
    let data = this.AllblockData.filter((f:any) => f.id == id)
    console.log(data)
    this.plotslist = data[0]['plots']
    this.registrationForm.patchValue({
      // blockId:'',
      plotId:''
  
    });
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
onselectPlot(event:any) {
  console.log(event.target.value)
  let x = this.plotslist.findIndex((f:any) => f.id == event.target.value );
  if(x != -1){
    console.log(this.plotslist[x])
    this.registrationForm.patchValue({
      plotAmount: this.plotslist[x].selling_amount
    })
  }
}
onchangeper(event:any){
  let value = event.target.value;
  if(value) {
    value = parseFloat(value)
    let amount = (parseFloat(this.registrationForm.value.plotAmount)*value)/100;
    this.registrationForm.patchValue({
      commission_amount: amount
    })
  }

}

}
