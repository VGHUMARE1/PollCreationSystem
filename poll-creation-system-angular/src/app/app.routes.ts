import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authenticate-components/login/login.component';
import { RegisterComponent } from './authenticate-components/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './landing-page-components/sidebar/sidebar.component';
import { HomeComponent } from './landing-page-components/home/home.component';
import { PollFormComponent } from './poll-components/poll-form/poll-form.component';
import { ActivePollsComponent } from './poll-components/active-polls/active-polls.component';
import { MyPollsComponent } from './poll-components/my-polls/my-polls.component';
import { ProfileComponent } from './landing-page-components/profile/profile.component';
import { EditPollComponent } from './poll-components/edit-poll/edit-poll.component';
import { LandingPageComponent } from './landing-page-components/landing-page/landing-page.component';
import { PollAnalysisComponent } from './poll-components/poll-analysis/poll-analysis.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
 
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'my-polls',
        component: MyPollsComponent,
      },
      { path: 'active-polls', component: ActivePollsComponent }, //  Nested route
      { path: 'new-poll', component: PollFormComponent }, //  Nested route
      { path: 'profile', component: ProfileComponent },
      { path: 'poll-analysis/:pollId', component: PollAnalysisComponent },
      { path: 'edit-poll/:id', component: EditPollComponent },
      //  Nested route
    ],
  },

  { path: '', component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
