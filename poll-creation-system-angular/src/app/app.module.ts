import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './authenticate-components/login/login.component';
import { RegisterComponent } from './authenticate-components/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app.routes';

// import { ChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, DashboardComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}

