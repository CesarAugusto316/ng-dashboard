import { Routes } from "@angular/router";
import { DetailComponent } from "../log-in-out/detail/detail.component";
import { LogInOutComponent } from "../log-in-out/log-in-out.component";
import { StatisticsComponent } from "../log-in-out/statistics/statistics.component";


export const dashboardRoutes: Routes = [
  { path: '', component: StatisticsComponent },
  { path: 'log-in-out', component: LogInOutComponent },
  { path: 'detail', component: DetailComponent },
]
