import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd } from '@angular/router';

import { AuthenticationService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    path='';
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
              const path = window.location.pathname.split('/').join(' ').trim();
            
              // document.body.className = (path) ? path : 'login';
              const currentPage = (path) ? path : 'login';
              const currentPageParts = currentPage.split(' ');
              this.path = currentPageParts[currentPageParts.length - 1];
            }
          });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        console.log((currentUser))
        if (Object.keys(currentUser).length) {
            // authorised so return true
            
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}