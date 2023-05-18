import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { Subject } from 'rxjs';

import { map } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  title: string | undefined;
  list:Array<{id:number,name:string,state:string,city:string,status:string}> = Array();
  reportList:any =[];
  selectedreport:any;
  key:any = 'townships'
  dtOptions: DataTables.Settings = {};
  // persons: Person[] = [];

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();
  
  constructor(private route: ActivatedRoute, private api:ApiService, private router:Router) {
    this.route.params.subscribe((params) => {
      this.key =params.type
      // this.ngOnDestroy();
      this.ngOnInit();
    });
    // this.key = this.route.snapshot.paramMap.get('type');
    console.log(  this.key)

   }
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;


  ngOnInit(): void {
    // this.title = this.route.snapshot.url[0].path;
    // this.list.push({id:1,name:'it001',state:'Sam',city:'Sam',status:'Registered'},{id:2,name:'it001',state:'Sam',city:'Sam',status:'Pending'});
    // console.log(this.list);
    this.getreportList()
    
  }
  getreportList() {
    // this.dtTrigger.unsubscribe();

    // this.reportList = [];
    // this.dtTrigger.next();

    // this.dtTrigger.unsubscribe();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,destroy:true,
    };
    // if(this.reportList && this.reportList.length > 0) 
    // {
    //   // this.dtTrigger.unsubscribe();
    //   // this.dtTrigger.subscribe();
    //   this.destory()
    // }
    this.api.fetchData('/report/getAll', {filteredBy:this.key}, "GET").subscribe((res:any) => {
      if(res['status'] == 1) {
        // if(this.reportList && this.reportList.length > 0) 
        // {
        //   this.dtTrigger.unsubscribe();
        //   // this.dtTrigger.subscribe();
    
        // }
        this.reportList = res['data'];
        this.dtTrigger.next(true);
        // this.rerender();
      }else {
        this.reportList =[]
      }
    })
  }

  viewreportList(id:any) {

  }

  deletereportList(id:any) {
      this.api.deleteData('reportList/'+id, {}, "Get").subscribe((res:any) => {
        if(res['status'] == 1) {
          // this.reportList = res['data'];
          this.getreportList()
          this.api.showNotification('success','reportList deleted successfully.')
        }else {
          // this.reportList
          this.api.showNotification('error',res['message'])
        }
      })
    
  }

  onselectreport(key:any){
    this.key = key;
    // this.getreportList();
    let url = key
    // this.router.navigate([url])
  }
  // editreportList(id:any) {
  //   let url = 'plots/view/'+id;
  //   this.router.navigate([url]);
  // }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  destory(): void {
    setTimeout(() => {
      this.dtElement?.dtInstance?.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
      });

    },0)
  }
  rerender(): void {
    setTimeout(() => {
      this.dtElement?.dtInstance?.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        // dtInstance.destroy();
        this.dtTrigger.next();

        // Call the dtTrigger to rerender again
      });

    },0)
  }
}
