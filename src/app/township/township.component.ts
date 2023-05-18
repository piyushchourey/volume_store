import { Component, OnInit, Renderer2, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ScriptService } from "../_services/scriptService";
import { MapsAPILoader } from '@agm/core';

import { ActivatedRoute,Router } from '@angular/router';
import { FormBuilder,  Validators } from '@angular/forms';
import { ApiService } from '../_services/api.service';



@Component({
  selector: 'app-township',
  templateUrl: './township.component.html',
  styleUrls: ['./township.component.css']
})
export class TownshipComponent implements OnInit {

  title: string | undefined;
  latitude: number = 51.678418;
  longitude: number = 7.809007;
  zoom!: number;
  address: string = "";
  private geoCoder!: google.maps.Geocoder;

  @ViewChild('search')
  public searchElementRef!: ElementRef;
  townshipForm:any;
  submited = false;
  id:any
  townshipData:any;
  state:any =[];
  city:any =[];
  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private router: Router, 
    private api : ApiService, private fb: FormBuilder
  ) { 
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id)
    if(this.id) {
      this.getTownshipList(this.id);
    }else{
      this.setFroms()
    }
    this.getState()


  }
  onchangestate(event:any) {
    this.getCity(event.target.value)
    this.townshipForm.patchValue({
      city:''
    })
  }
  getTownshipList(id:any) {
    this.api.fetchData('township/getAll/', {id:id}, "GET").subscribe((res:any) => {
      if(res['status'] == 1) {
        this.townshipData = res['data'][0];
        this.setFroms()
        this.getCity(this.townshipData.state)

      }else {
        this.setFroms()
      }
    })
  }
  getState() {
    this.api.fetchData('admin/getStates/', {}, "GET").subscribe((res:any) => {
      if(res['status'] == 1) {
        this.state = res['data']
        // this.setFroms()

      }else {
        // this.setFroms()
      }
    })
  }
  getCity(id:any) {
    this.api.fetchData('admin/getcitiesByState', {stateId:id}, "GET").subscribe((res:any) => {
      if(res['status'] == 1) {
        this.city = res['data'];
        // this.setFroms()

      }else {
        this.setFroms()
      }
    })
  }

ngOnInit() {
  this.title = this.route.snapshot.url[0].path;


 
}

setFroms(){
  let data = this.townshipData ? this.townshipData : {}
  this.townshipForm = this.fb.group({
    township_name: [data.township_name?data.township_name:"",Validators.required],
    state: [data.state?data.state:"",[Validators.required]],
    city: [data.city?data.city:"",[Validators.required]],
    pincode:[data.pincode?data.pincode:"",[Validators.required,Validators.pattern("^[0-9]*$"),
    Validators.minLength(6), Validators.maxLength(6)]],
    number_of_blocks:[data.number_of_blocks?data.number_of_blocks:"",[Validators.required,Validators.minLength(1)]],
    number_of_plots:[data.number_of_plots?data.number_of_plots:"",[Validators.required,Validators.minLength(1)]],
    total_size_of_township:[data.total_size_of_township?data.total_size_of_township:"",[Validators.required,Validators.pattern("^[0-9]*$")]],
    colonizer:[data.colonizer?data.colonizer:"",[Validators.required]],
    colonizer_status:[data.colonizer_status?data.colonizer_status:"",[Validators.required]],
    documents:[data.documents?data.documents:"",[Validators.required]],
    document_data:[data.documents?data.documents:"",[Validators.required]],
    // longitude:[data.longitude?data.longitude:"",[Validators.required]],
    // latitude:[data.latitude?data.latitude:"",[Validators.required]],
    description:[data.description?data.description:"",[Validators.required]],
  });
}









get f() { return this.townshipForm.controls}

 register(){
   console.log(this.townshipForm.value);
   this.submited = true;
   if (this.townshipForm.invalid) {
     //  this.submited = false;
      return;
   }
   if(this.id){
      this.update()
   }else {

     this.api.loader('start')
   
     let obj = JSON.parse(JSON.stringify(this.townshipForm.value));
     delete obj['document_data']
     delete obj['type']
     obj['status'] = 1;
     this.api.postData('township/create',obj,'post').subscribe(res => {
       console.log(res);
       if(res['status'] == 1) {
         this.api.loader('stop')
         this.router.navigate(['township/list'])
         this.submited = false;
         this.api.showNotification('success', res['message']);
       }else{      
         this.api.showNotification('error', res['message']);
         this.api.loader('stop')
   
         // this.updateFormdata({})
         
       }
       })
   }

 }
 update(){
   console.log(this.townshipForm.value);
  this.submited = true;
  if (this.townshipForm.invalid) {
    //  this.submited = false;
     return;
  }
  this.api.loader('start')

  let obj = JSON.parse(JSON.stringify(this.townshipForm.value));
  // let obj = this.townshipForm.value;
  obj['status'] = 1
  delete obj['document_data']
  delete obj['type']
  obj['status'] = 1;
  obj['id'] = this.id;
  let matches = (obj.documents).match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  console.log(matches);
  if(null == matches) {
    obj.documents = ''
  }


  this.api.putData('township/update',obj,'post').subscribe(res => {
    console.log(res);
    if(res['status'] == 1) {
      this.api.loader('stop')

      this.submited = false;
      this.api.showNotification('success', res['message']);
      this.router.navigate(['township/list'])

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
     this.townshipForm.patchValue({
      documents :data,
      // type:type
     })
     }
 }

 ondecriptionchange(event:any){
   console.log(event)
  this.townshipForm.patchValue({
    description:event.target.value
  })
 }


}