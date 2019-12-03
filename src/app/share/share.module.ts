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
import { ZDurationPipe, ZDuration1Pipe, ZDuration2Pipe } from './pipes/z-duration.pipe';
import { ZEmptyPipe } from './pipes/z-empty.pipe';
import { ZDebounceClickDirective } from './directives/z-debounce-click.directive';
import { ProgressModalComponent } from './components/progress-modal/progress-modal.component';
import { ZPhotoSelectComponent } from './components/z-photo-select/z-photo-select.component';
import { ZVideoSelectComponent } from './components/z-video-select/z-video-select.component';
import { ZPreviewVideoPhotoComponent } from './components/z-preview-video-photo/z-preview-video-photo.component';
import { ZConfirmationBoxComponent } from './components/tips/z-confirmation-box/z-confirmation-box.component';
import { ZPromptBoxComponent } from './components/tips/z-prompt-box/z-prompt-box.component';
import { PromptBoxComponent } from './components/tips/prompt-box/prompt-box.component';
import { ConfirmationBoxComponent } from './components/tips/confirmation-box/confirmation-box.component';
import { ZMapSelectPointComponent } from './components/z-map-select-point/z-map-select-point.component';
import { ProjectTypePipe, ProjectCategoryPipe, PayStatusPipe } from './pipes/project-type.pipe';
import { ProjectDialogComponent } from './components/project-dialog/project-dialog.component';
import { SelectBrandFirmComponent } from './components/select-brand-firm/select-brand-firm.component';
import { DateClockComponent } from './components/date-clock/date-clock.component';
import { SelectBrandFirmTypeComponent } from './components/select-brand-firm-type/select-brand-firm-type.component';
import { SelectMultiBrandFirmComponent } from './components/select-multi-brand-firm/select-multi-brand-firm.component';
import { ZCompleteNumberPipe } from './pipes/z-complete-number.pipe';
import { SearchVehicleTypeGroupComponent } from './components/search-vehicle-type-group/search-vehicle-type-group.component';
import { MallCommodityTypePipe } from './pipes/mall-format.pipe';
import {
  TicketFormatPipe,
  ThirdSaleStatusPipe,
  OrderStatusPipe,
  OrderUseStatusPipe,
  CentPriceChangePipe,
  NullDataFilterPipe,
  PayTypePipe,
  DelayTypePipe,
  RefundRulePipe,
  ValidateTimeLimitPipe,
  MaxNumberDealPipe
} from './pipes/ticket-format.pipe';
import { StoreCategoryPipe, StoreProjectTypePipe, StorePayStatus } from './pipes/store-format.pipe';
import { HtmlPipe } from './pipes/html.pipe';
import { TxtCopyComponent } from './directives/txt-copy/txt-copy.component';
import { TxtCopyDirective } from './directives/txt-copy/txt-copy.directive';
import { ZTextCkeditorComponent } from './components/z-text-ckeditor/z-text-ckeditor.component';
import { ZPhotoSelectUploadComponent } from './components/z-photo-select-upload/z-photo-select-upload.component';
import { ExemptionFormatPipe, ExemptionOrderStatusPipe, RejectTypePipe, } from './pipes/exemption-format.pipe';
import { PushPlanFormatPipe, PushRangePipe, PushSpeedPipe, RangeTypePipe } from './pipes/push-plan-format.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
  ],
  entryComponents: [TxtCopyComponent],
  declarations: [
    CrumbComponent,
    Http403TipComponent,
    Http500TipComponent,
    ProCityDistSelectComponent,
    ExpandedMenuComponent,
    ProgressModalComponent,
    ZPhotoSelectComponent,
    ZVideoSelectComponent,
    ZPreviewVideoPhotoComponent,
    ZConfirmationBoxComponent,
    ZPromptBoxComponent,
    PromptBoxComponent,
    ConfirmationBoxComponent,
    ZMapSelectPointComponent,
    ProjectDialogComponent,
    SelectBrandFirmComponent,
    SelectBrandFirmTypeComponent,
    SelectMultiBrandFirmComponent,
    DateClockComponent,
    SearchVehicleTypeGroupComponent,
    TxtCopyComponent,
    ZTextCkeditorComponent,
    ZPhotoSelectUploadComponent,

    // 管道
    ZMaxLengthPipe,
    ZMaxLengthPipe,
    ZDurationPipe,
    ZDuration1Pipe,
    ZDuration2Pipe,
    ZFormatDurationPipe,
    ZPlaceholderPipe,
    DurationFormatHMSPipe,
    ZEmptyPipe,
    ProjectTypePipe,
    ProjectCategoryPipe,
    ZCompleteNumberPipe,
    PayStatusPipe,
    TicketFormatPipe,
    ThirdSaleStatusPipe,
    OrderStatusPipe,
    OrderUseStatusPipe,
    CentPriceChangePipe,
    NullDataFilterPipe,
    HtmlPipe,
    PayTypePipe,
    DelayTypePipe,
    RefundRulePipe,
    ValidateTimeLimitPipe,
    MaxNumberDealPipe,
    ProjectTypePipe,
    StoreProjectTypePipe,
    ExemptionFormatPipe,
    ExemptionOrderStatusPipe,
    RejectTypePipe,
    PushRangePipe,
    RangeTypePipe,
    PushSpeedPipe,
    PushPlanFormatPipe,
    StoreCategoryPipe,
    StorePayStatus,
    MallCommodityTypePipe,

    // 指令
    IgnoreSpaceDirective,
    ZDebounceClickDirective,
    TxtCopyDirective,
    ZTextCkeditorComponent,
    ZPhotoSelectUploadComponent,
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
    ZVideoSelectComponent,
    ZPreviewVideoPhotoComponent,
    ZConfirmationBoxComponent,
    ZPromptBoxComponent,
    PromptBoxComponent,
    ConfirmationBoxComponent,
    ZMapSelectPointComponent,
    ProjectDialogComponent,
    SelectBrandFirmComponent,
    SelectBrandFirmTypeComponent,
    SelectMultiBrandFirmComponent,
    DateClockComponent,
    SearchVehicleTypeGroupComponent,
    TxtCopyComponent,
    ZTextCkeditorComponent,
    ZPhotoSelectUploadComponent,

    // 管道
    ZMaxLengthPipe,
    ZMaxLengthPipe,
    ZDurationPipe,
    ZDuration1Pipe,
    ZDuration2Pipe,
    ZFormatDurationPipe,
    ZPlaceholderPipe,
    DurationFormatHMSPipe,
    ZEmptyPipe,
    ProjectTypePipe,
    ProjectCategoryPipe,
    ZCompleteNumberPipe,
    PayStatusPipe,
    TicketFormatPipe,
    ThirdSaleStatusPipe,
    OrderStatusPipe,
    OrderUseStatusPipe,
    CentPriceChangePipe,
    NullDataFilterPipe,
    HtmlPipe,
    PayTypePipe,
    DelayTypePipe,
    RefundRulePipe,
    ValidateTimeLimitPipe,
    MaxNumberDealPipe,
    StoreProjectTypePipe,
    ExemptionFormatPipe,
    ExemptionOrderStatusPipe,
    RejectTypePipe,
    PushRangePipe,
    RangeTypePipe,
    PushSpeedPipe,
    PushPlanFormatPipe,
    StoreCategoryPipe,
    StorePayStatus,
    MallCommodityTypePipe,

    // 指令
    IgnoreSpaceDirective,
    ZDebounceClickDirective,
    TxtCopyDirective
  ],
})
export class ShareModule {
}
