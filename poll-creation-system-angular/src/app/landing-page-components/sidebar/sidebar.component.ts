import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = false;
  // authService:any='';
 constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
    
    if(!this.authService.isLoggedIn()){
      this.router.navigate([`/login`]);
    }
  }
  
  

  async logout() {
  
      try {
      const response=  await this.authService.logout();
       
        console.log(response);
        // alert("welcome")
        this.router.navigate(['/']);
       
      } catch (error) {
        console.log(error);
      }
   
  }


  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    // if (this.isCollapsed) {
    //   sidebar.style.width = '60px';
    // } else {
    //   sidebar.style.width = '250px';
    // }
  }
}


