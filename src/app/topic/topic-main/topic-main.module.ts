import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { MainModule } from '../../operational-system/main/main.module';
import { TopicMainRoutingModule } from './topic-main-routing.module';
import { TopicMainComponent } from './topic-main.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ColorPickerModule,
        TopicMainRoutingModule,
        MainModule
    ],
    declarations: [
        TopicMainComponent,
    ]
})
export class TopicMainModule {
}
