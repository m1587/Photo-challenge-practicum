import { Routes } from '@angular/router';
import { LoginComponent } from '../features/login/login.component';
import { MonthlyPhotoReportComponent } from '../features/monthly-photo-report/monthly-photo-report.component';
import { HomeComponent } from '../features/home/home.component';
import { ChallengeManagementComponent } from '../features/challenge-management/challenge-management.component';
import { UserManagementComponent } from '../features/user-management/user-management.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
     { path: 'users-management', component: UserManagementComponent },
     { path: 'challenge-management', component: ChallengeManagementComponent },
    { path: 'monthly-photo-report', component: MonthlyPhotoReportComponent },
    { path: 'home', component: HomeComponent },
];
