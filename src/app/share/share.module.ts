import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { CrumbComponent } from './components/crumb/crumb.component';
import { Http403TipComponent } from './components/tips/http403-tip/http403-tip.component';
import { Http500TipComponent } from './components/tips/http500-tip/http500-tip.component';
import { ProCityDistSelectComponent } from './components/pro-city-dist-select/pro-city-dist-select.component';
import { ExpandedMenuComponent } from './components/expanded-menu/expanded-menu.component';
import { IgnoreSpaceDirective } from './directives/ignore-space.directive';
import { ZMaxLengthPipe } from './pipes/z-max-length.pipe';
import { DurationFormatHMSPipe, ZFormatDurationPipe } from './pipes/z-format-duration.pipe';
import { ZPlaceholderPipe } from './pipes/z-placeholder.pipe';
import { ZDurationPipe } from './pipes/z-duration.pipe';
import { ZEmptyPipe } from './pipes/z-empty.pipe';
import { ZDebounceClickDirective } from './directives/z-debounce-click.directive';
import { ProgressModalComponent } from './components/progress-modal/progress-modal.component';
import { ZPhotoSelectComponent } from './components/z-photo-select/z-photo-select.component';
import { ZConfirmationBoxComponent } from './components/tips/z-confirmation-box/z-confirmation-box.component';
import { ZPromptBoxComponent } from './components/tips/z-prompt-box/z-prompt-box.component';
import { PromptBoxComponent } from './components/tips/prompt-box/prompt-box.component';
import { ConfirmationBoxComponent } from './components/tips/confirmation-box/confirmation-box.component';
import { ZMapSelectPointComponent } from './components/z-map-select-point/z-map-select-point.component';
import { ProjectTypePipe, ProjectCategoryPipe } from './pipes/project-type.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
  ],
  entryComponents: [],
  declarations: [
    CrumbComponent,
    Http403TipComponent,
    Http500TipComponent,
    ProCityDistSelectComponent,
    ExpandedMenuComponent,
    ProgressModalComponent,
    ZPhotoSelectComponent,
    ZConfirmationBoxComponent,
    ZPromptBoxComponent,
    PromptBoxComponent,
    ConfirmationBoxComponent,
    ZMapSelectPointComponent,

    // 管道
    ZMaxLengthPipe,
    ZMaxLengthPipe,
    ZDurationPipe,
    ZFormatDurationPipe,
    ZPlaceholderPipe,
    DurationFormatHMSPipe,
    ZEmptyPipe,
    ProjectTypePipe,
    ProjectCategoryPipe,

    // 指令
    IgnoreSpaceDirective,
    ZDebounceClickDirective,
    ProjectTypePipe,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    CrumbComponent,
    Http403TipComponent,
    Http500TipComponent,
    ProCityDistSelectComponent,
    ExpandedMenuComponent,
    ProgressModalComponent,
    ZPhotoSelectComponent,
    ZConfirmationBoxComponent,
    ZPromptBoxComponent,
    PromptBoxComponent,
    ConfirmationBoxComponent,
    ZMapSelectPointComponent,

    // 管道
    ZMaxLengthPipe,
    ZMaxLengthPipe,
    ZDurationPipe,
    ZFormatDurationPipe,
    ZPlaceholderPipe,
    DurationFormatHMSPipe,
    ZEmptyPipe,
    ProjectTypePipe,
    ProjectCategoryPipe,

    // 指令
    IgnoreSpaceDirective,
    ZDebounceClickDirective,
  ],
})
export class ShareModule {
}
