import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService

const currentTimestaps = new Date().getTime().toString();
let token = localStorage.getItem('token');


  const headers1 = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
    })
  };

  
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly notifier: NotifierService;

  constructor(private http: HttpClient,notifierService: NotifierService,private router: Router,
	private ngxService: NgxUiLoaderService) { 
	this.notifier = notifierService;

  }


  	/**
	 * Common function to call all APIs
	 * @param endpoint
	 * @param args
	 * @param httpmethod
	 * @return response as obserbalbe
	 */

	fetchData(endpoint:string, args = {}, httpmethod = 'GET'): Observable<any> {

		let requestURL = environment.apiUrl + endpoint;

		/**
		 * To covert parameters into query string
		 */
			let headers = this.getHeaders();
			requestURL = this.createUrl(requestURL, httpmethod, args);
			return  this.http.get(requestURL, endpoint =='login'? headers1:headers)
			.pipe(map(data => data),
            catchError(this.handleError('Error in getting data', []))
			);
		

  }
	postData(endpoint:string, args = {}, httpmethod = 'POST'): Observable<any> {
		console.log(environment.apiUrl);
		let requestURL = environment.apiUrl + endpoint;

		/**
		 * To covert parameters into query string
		 */
		 let headers = this.getHeaders();
		console.log(endpoint);
	return this.http.post(requestURL, args,endpoint!= 'login/'?headers:headers1) 
		.pipe(map(data => data),
			catchError(this.handleError('Error in getting data', []))
	);

  }
	putData(endpoint:string, args = {}, httpmethod = 'GET'): Observable<any> {
		let headers = this.getHeaders();

		let requestURL = environment.apiUrl + endpoint;

			return this.http.put(requestURL,args, headers) 
				.pipe(map(data => data),
					catchError(this.handleError('Error in getting data', []))
				);
  }

	deleteData(endpoint:string, args = {}, httpmethod = 'GET'): Observable<any> {
		let headers = this.getHeaders();

		let requestURL = environment.apiUrl + endpoint;


					requestURL = this.createUrl(requestURL, httpmethod, args);
	    return  this.http.delete(requestURL, headers) 
				.pipe(map(data => data),
					catchError(this.handleError('Error in getting data', []))
				);


  }


	/**
	 * Create request url with params and required options
	 * @param requestURI string
	 * @param args objext
	 * @param httpmethod get/put/post/delete
	 * @return string
	 */
	createUrl(requestURI:any, httpmethod:any, args:any) {
		let parameters:any = {};

		if (httpmethod === 'GET') {
	
			if (Object.keys(args).length > 0) {
				for (const key in args) {
					parameters[key] = args[key];
				}
			}
		}

		requestURI = requestURI + '?' + this.toQueryString(parameters); // To covert parameters into query string

		return requestURI;
	}

	/**
	 * @param obj object
	 * @return string
	 */
	private toQueryString(obj:any) {
		const parts = [];

		for (const i in obj) {
			if (obj.hasOwnProperty(i)) {
				parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
			}
		}

		return parts.join('&');
	}

	/**
	 * Handle error
	 * @param operation
	 * @param result
	 */
	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => { // TODO: send the error to remote logging infrastructure
			if(error['status'] == 401) {
				localStorage.clear()
				this.router.navigate(['login'])
			}
			
			console.log(error)
			return of(result as T);
		};
	}

	/**
	 * Show a notification
	 *
	 * @param {string} type    Notification type
	 * @param {string} message Notification message
	 */
	showNotification( type: string, message: string ): void {
		console.log('runn notifications', type,message)
		this.notifier.notify( type, message );
	}

	getHeaders(){
		let data:any = localStorage.getItem('currentUser')
		let token:any = data?JSON.parse(data).accessToken:undefined;
		const headers = {
			headers: new HttpHeaders({
				'Accept': 'application/json',
				'x-access-token' :  token,
			})
		};
		return headers
	}


		/**
	 * Show a notification
	 *
	 * @param {string} type    Notification type
	 */
		 loader( type: string  ): void {
			console.log('runn notifications', type)
			if(type == 'start'){
				this.ngxService.start(); // start foreground spinner of the master loader with 'default' taskId
	
			} else{
				this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
	
			}
			// Stop the foreground loading after 5s
		}
}