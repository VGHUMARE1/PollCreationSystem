import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './landing-page-components/sidebar/sidebar.component';
import { NavbarComponent } from './landing-page-components/navbar/navbar.component';
import { FooterComponent } from './landing-page-components/footer/footer.component';
// import {}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'poll-creation-system-angular';
}
