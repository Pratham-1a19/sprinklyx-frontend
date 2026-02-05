import { Routes } from '@angular/router';
import { ClientLoginComponent } from './pages/auth/client/client-login/client-login.component';
import { InfluencerLoginComponent } from './pages/auth/influencer-login/influencer-login';
import { SuperAdminLoginComponent } from './pages/auth/super-admin-login/super-admin-login';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { Header } from './layouts/main-layout/header/header';
import { Footer } from './layouts/main-layout/footer/footer';
import { SidebarComponent } from './layouts/main-layout/sidebar/sidebar';

export const routes: Routes = [
    {"path": "client-login", component: ClientLoginComponent},
    {"path": "influencer-login", component: InfluencerLoginComponent},
    {"path": "super-admin-login", component: SuperAdminLoginComponent},
    {"path": "main-layout", component: MainLayoutComponent},
    {"path": "header", component: Header},
    {"path": "footer", component: Footer},
    {"path": "sidebar", component: SidebarComponent}
];
