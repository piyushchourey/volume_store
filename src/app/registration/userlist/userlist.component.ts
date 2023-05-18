import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';
import { Subject } from 'rxjs';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  title: string | undefined;
  // userlist:Array<{id:number,name:string,state:string,city:string,status:string}> = Array();
  userlist:any = [];
  selectedUser:any;

  dtOptions: DataTables.Settings = {};
  // persons: Person[] = [];

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private route: ActivatedRoute,private api: ApiService, private router:Router) { }

 
  ngOnInit(): void {
    // this.title = this.route.snapshot.url[0].path;
    this.title = 'User List';
    // this.list.push({id:1,name:'it001',state:'Sam',city:'Sam',status:'Registered'},{id:1,name:'it001',state:'Sam',city:'Sam',status:'Registered'});
    // console.log(this.list);
    this.getuserlist()
  }
  getuserlist() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,destroy:true
    };
    this.api.fetchData('admin/getAll', {}, "Get").subscribe((res:any) => {
      if(res['status']  ==1 ) {
        // this.dtOptions.destroy();
        this.userlist = res['data'];
        this.dtTrigger.next();

      }else {
        this.userlist =[]
      }
    })
  }

  viewuserlist(id:any) {

  }

  deleteuserlist(id:any) {
      this.api.deleteData('admin/remove?id='+id, {}, "DELETE").subscribe((res:any) => {
        if(res['status'] == 1) {
          // this.userlist = res['data'];
          this.getuserlist()
          this.api.showNotification('success','user deleted successfully.')
          document.getElementById('close-user')?.click();
        }else {
          // this.userlist
          this.api.showNotification('error',res['message'])
        }
      })
    
  }

  // edituserlist(id:any) {
  //   let url = 'resi/view/'+id;
  //   this.router.navigate([url]);
  // }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
