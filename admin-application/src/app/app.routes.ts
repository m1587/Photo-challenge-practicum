import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { MonthlyPhotoReportComponent } from '../components/monthly-photo-report/monthly-photo-report.component';
import { HomeComponent } from '../components/home/home.component';
import { UserManagementComponent } from '../components/user-management/user-management.component';
import { ChallengeManagementComponent } from '../components/challenge-management/challenge-management.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
     { path: 'users-management', component: UserManagementComponent },
     { path: 'challenge-management', component: ChallengeManagementComponent },
    { path: 'monthly-photo-report', component: MonthlyPhotoReportComponent },
    { path: 'home', component: HomeComponent },
];
