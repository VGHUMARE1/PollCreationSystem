import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './authenticate-components/login/login.component';
import { RegisterComponent } from './authenticate-components/register/register.component';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent,BrowserAnimationsModule,ToastrModule],
  imports: [BrowserModule, AppRoutingModule, FormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,                   // Default toast timeout (ms)
      positionClass: 'toast-top-right', // Position
      preventDuplicates: true,         // Prevent showing duplicate toasts
      progressBar: true,               // Show progress bar
      closeButton: true,               // Show close button
      tapToDismiss: false              // Click toast to dismiss
    })
  ],
 
  providers: [CookieService],
  bootstrap: [AppComponent],
})

export class AppModule {
  
}

