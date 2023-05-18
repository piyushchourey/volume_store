import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';
import { Subject } from 'rxjs';

import { map } from 'rxjs/operators';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class PlotListComponent implements OnInit {
  title: any;
  list:Array<{id:number,name:string,state:string,city:string,status:string}> = Array();
  plotlist:any=[];
  selectedPlot:any;
  dtOptions: DataTables.Settings = {};
  // persons: Person[] = [];

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();
  showerror:boolean = false;
  bulkUpload:any;
  constructor(private route: ActivatedRoute, private api:ApiService, private router:Router) { }

  ngOnInit(): void {
    this.title = this.route.snapshot.url[0].path;
    this.list.push({id:1,name:'it001',state:'Sam',city:'Sam',status:'Registered'},{id:1,name:'it001',state:'Sam',city:'Sam',status:'Registered'});
    console.log(this.list);
    this.getplotlist()
  }
  getplotlist() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,destroy:true
    };
    this.api.fetchData('plot/getAll', {}, "Get").subscribe((res:any) => {
      if(res && res['status'] == 1) {
        this.plotlist = res['data'];
        this.dtTrigger.next();

      }else {
        this.plotlist =[]
      }
    })
  }

  viewPlotlist(id:any) {

  }

  deletePlotlist(id:any) {
      this.api.deleteData('plot/remove?id='+id, {}, "DELETE").subscribe((res:any) => {
        if(res['status'] == 1) {
          // this.plotlist = res['data'];
          this.getplotlist()
          this.api.showNotification('success','Plotlist deleted successfully.')
          document.getElementById('close-plot')?.click()
        }else {
          // this.plotlist
          this.api.showNotification('error',res['message'])
        }
      })
    
  }

  editPlotlist(id:any) {
    let url = 'plots/view/'+id;
    this.router.navigate([url]);
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  Onselectfile(event:any) {
    // console.log(event.target.files[0]);
    let regex  =new RegExp('^.*\.(jpg|JPG|jpeg|JPEG|png|PNG)$')
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    let type:any = event.target.files[0].type;
        // console.log(event.target.files[0])
    let filename:any = event.target.files[0].name;
   //  let file:any = event.target.files[0];
    this.bulkUpload =  event.target.files[0];
   
       //  reader.onload = (event:any) => {
    
       //  let data =  event.target['result'];
       //  console.log('type',type)
       //  console.log('bs64',data)
       
    
       //  }
     }
   
     onsubmitBulkUpload(){
       if(!this.bulkUpload) {
         this.showerror = true
       }
       const formData: FormData = new FormData();
       
       formData.append('importFile', this.bulkUpload);
       this.api.loader('start')
       
       this.api.postData('plot/import',formData,"POST").subscribe(res => {
         if(res['status'] == 1) {
           this.api.loader('stop')
           
           this.api.showNotification('success', res['message']);
           this.showerror = false;
           this.getplotlist();
           this.bulkUpload = undefined;
         }else {
           this.api.showNotification('error', res['message']);
           this.api.loader('stop')
           this.showerror = false;
         }
       })
     }

}
