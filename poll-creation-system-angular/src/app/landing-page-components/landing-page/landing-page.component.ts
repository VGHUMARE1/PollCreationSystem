import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { PollFormComponent } from '../../poll-components/poll-form/poll-form.component';
@Component({
  selector: 'app-landing-page',
  imports: [RouterModule,NavbarComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
