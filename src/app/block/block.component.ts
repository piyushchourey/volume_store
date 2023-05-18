import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder,  FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent implements OnInit {


  title: string | undefined;
  registrationForm:any;
  submited = false;
  items:any=[];
  id:any;
  townshipdata:any = [];
  selectedTownship:any;
  constructor(private router: Router, 
    private api : ApiService, private route: ActivatedRoute, private fb: FormBuilder) { 
      this.route.params.subscribe(params => {
        this.id = params.id; // --> Name must match wanted parameter
      });    }
    ngOnInit(): void {
      this.title = this.route.snapshot.url[0].path;
      this.registrationForm = this.fb.group({
        blockData : this.fb.array([  ]),
        townshipId:null
      });
      this.registrationForm.controls.townshipId.disable()
      this.getAllTownshipList();
      this.getTownshipList(this.id)
     
   }
  get f() { return this.registrationForm.controls}
  pointAt(index:any) {
    let form:any = (<FormArray>this.registrationForm.get('blockData')).at(index);
    return form['controls'];
  }
  addItem(data:any={}): void {
    this.items = this.registrationForm.get('blockData') as FormArray;
    this.items.push(this.createItem(data));
 
  }
  remove(i:any): void {
    this.items = this.registrationForm.get('blockData') as FormArray;
    this.items.removeAt(i);

   
  }

  createItem(data:any): FormGroup {

    return this.fb.group({
      townshipId: [data&&data.townshipId&&data.townshipId?data.townshipId:this.id,[Validators.required]],
      name:  [data&&data.name&&data.name?data.name:'',[Validators.required]],
      size: [data&&data.size?data.size:'' ,[Validators.required]],
      id:[data&&data.id?data.id:'' ],
    });
  }
   register(){
    this.submited = true;
    // this.submited = true;
    console.log(this.registrationForm.value)
    if (this.registrationForm.invalid) {
      //  this.submited = false;
       return;
    }
    // return false;
    this.api.loader('start')
  
    let obj = JSON.parse(JSON.stringify(this.registrationForm.value.blockData ));
  
    this.api.postData('/block/create',obj,'post').subscribe(res => {
      console.log(res);
      if(res['status'] == 1) {
        this.api.loader('stop')
        this.submited = false;
        this.api.showNotification('success', res['message']);
        this.router.navigate(['blocklist'])
      }else{      
        this.api.showNotification('error', res['message']);
        this.api.loader('stop')
  
        // this.updateFormdata({})
        
      }
      })
  
   }

   getTownshipList(id:any) {
    this.api.fetchData('township/getAll/', {id:id}, "GET").subscribe((res:any) => {
      if(res['status'] == 1) {
        let data  = res['data'][0];
        this.registrationForm.patchValue({
          townshipId:this.id
        })
        // for(let i = 0; i< data.number_of_blocks; i++){
     
        //   this.addItem({})
        // }
        if(data.blocks.length == 0) {
          for(let i = 0; i< data.number_of_blocks; i++){
            this.addItem({})
          }

        }else {
          data.blocks.map((f:any) => {
            this.addItem(f)

          })
          
          if(data.blocks.length < data.number_of_blocks) {
            for(let i = data.blocks.length; i< data.number_of_blocks; i++){
              this.addItem({})
            }

          }
        }

      }else {
        // this.setFroms()
      }
    })

  
  }
   getAllBlockdetail(id:any) {
    this.api.fetchData('block/getAll/', {id:id}, "GET").subscribe((res:any) => {
      if(res['status'] == 1) {
        let data  = res['data'][0];
        if(data.blocks.length == 0) {
          for(let i = 0; i< this.selectedTownship.number_of_blocks; i++){
            this.addItem({})
          }

        }else {
          data.blocks.map((f:any) => {
            this.addItem(f)

          })
        }

      }else {
        // this.setFroms()
      }
    })

  
  }
  getAllTownshipList() {
    this.api.fetchData('township/getAll/', {}, "GET").subscribe((res:any) => {
      if(res['status'] == 1) {
        this.townshipdata = res['data'];
        this.selectedTownship = this.townshipdata.filter((f:any) => f.id == this.id)
        // this.getAllBlockdetail(this.id)
        // if(this.selectedTownship[0].blocks.length == 0) {
        //   for(let i = 0; i< this.selectedTownship.number_of_blocks; i++){
        //     this.addItem({})
        //   }

        // }else {
        //   this.selectedTownship[0].blocks.map((f:any) => {
        //     this.addItem(f)

        //   })
        // }

     
      }else {
        this.townshipdata = []
              }
    })
  }
}
