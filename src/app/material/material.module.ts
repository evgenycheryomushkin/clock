import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {DragDropModule} from '@angular/cdk/drag-drop'
import {MatButtonModule} from '@angular/material/button'
import {MatProgressBarModule} from '@angular/material/progress-bar'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatTabsModule} from '@angular/material/tabs'
import { MatIconModule } from '@angular/material/icon'


const MaterialComponents = [
  MatCardModule,
  DragDropModule,
  MatButtonModule,
  MatProgressBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatTabsModule,
  MatIconModule
]

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
