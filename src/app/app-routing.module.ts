import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TesseractComponent } from './tesseract/tesseract.component';


const routes: Routes = [{
  path: 'tesseract', component: TesseractComponent,
},
{ path: '**', redirectTo: 'tesseract', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
