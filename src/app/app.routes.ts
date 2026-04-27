import { Routes } from '@angular/router';
import { ClientLoginComponent } from './pages/auth/client/client-login/client-login.component';
import { InfluencerLoginComponent } from './pages/auth/influencer-login/influencer-login';
import { SuperAdminLoginComponent } from './pages/auth/super-admin-login/super-admin-login';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { SocialMediaPosting } from './pages/social-media-posting/social-media-posting';
import { PostSchedulingComponent } from './pages/post-scheduling/post-scheduling';
import { ReportsComponent } from './pages/reports/reports';
import { Header } from './layouts/main-layout/header/header';
import { Footer } from './layouts/main-layout/footer/footer';
import { SidebarComponent } from './layouts/main-layout/sidebar/sidebar';
import { InvitationPage } from './layouts/invitation-page/invitation-page';
import { Dashboard } from './layouts/dashboard/dashboard';
import { AcceptInviteComponent } from './pages/auth/accept-invite/accept-invite.component';
import { ConnectAccountsComponent } from './pages/connect-accounts/connect-accounts';
import { AdminApprovalsComponent } from './pages/admin-approvals/admin-approvals';

import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { "path": "client-login", component: ClientLoginComponent },
    { "path": "influencer-login", component: InfluencerLoginComponent },
    { "path": "super-admin-login", component: SuperAdminLoginComponent },
    { "path": "admin-dashboard", component: Dashboard, canActivate: [AuthGuard] },
    { "path": "member-dashboard", component: Dashboard, canActivate: [AuthGuard] },
    { "path": "dashboard", component: Dashboard, canActivate: [AuthGuard] },
    { "path": "social-media-posting", component: SocialMediaPosting, canActivate: [AuthGuard] },
    { "path": "post-scheduling", component: PostSchedulingComponent, canActivate: [AuthGuard] },
    { "path": "reports", component: ReportsComponent, canActivate: [AuthGuard] },
    { "path": "main-layout", component: MainLayoutComponent, canActivate: [AuthGuard] },
    { "path": "header", component: Header },
    { "path": "footer", component: Footer },
    { "path": "sidebar", component: SidebarComponent },
    { "path": "invitation-page", component: InvitationPage, canActivate: [AuthGuard] },
    { "path": "accept-invite", component: AcceptInviteComponent },
    { "path": "connect-accounts", component: ConnectAccountsComponent, canActivate: [AuthGuard] },
    { "path": "admin-approvals", component: AdminApprovalsComponent, canActivate: [AuthGuard] },
    { "path": "", redirectTo: "client-login", pathMatch: "full" }, // Default route
    { path: '**', redirectTo: 'client-login' } // Fallback
];
