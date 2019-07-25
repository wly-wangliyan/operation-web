import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';

/*
 * 面包屑
 * 有1才能有2,有1可没2,不能跳着来
 * */
@Component({
  selector: 'app-crumb',
  templateUrl: './crumb.component.html',
  styleUrls: ['./crumb.component.less'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class CrumbComponent {

  @Input() public level1Name: string;
  @Input() public level1RelativePath: string;
  @Input() public level1AbsolutePath: string;
  @Input() public level1RelativePathParams: any;

  public get level1Valid(): boolean {
    return !isNullOrUndefined(this.level1AbsolutePath) || !isNullOrUndefined(this.level1RelativePath);
  }

  @Input() public level2Name: string;
  @Input() public level2RelativePath: string;
  @Input() public level2AbsolutePath: string;
  @Input() public level2RelativePathParams: any;

  @Input() public level3Name: string;
  @Input() public level3RelativePath: string;
  @Input() public level3AbsolutePath: string;
  @Input() public level3RelativePathParams: any;

  @Input() public level4Name: string;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  public onLevel1LabelClick() {
    if (!isNullOrUndefined(this.level1RelativePath)) {
      if (!isNullOrUndefined(this.level1RelativePathParams)) {
        this.router.navigate([this.level1RelativePath, this.level1RelativePathParams], {relativeTo: this.route});
      } else {
        this.router.navigate([this.level1RelativePath], {relativeTo: this.route});
      }
    } else {
      this.router.navigateByUrl(this.level1AbsolutePath);
    }
  }

  public onLevel2LabelClick() {
    if (!isNullOrUndefined(this.level2RelativePath)) {
      if (!isNullOrUndefined(this.level2RelativePathParams)) {
        this.router.navigate([this.level2RelativePath, this.level2RelativePathParams], {relativeTo: this.route});
      } else {
        this.router.navigate([this.level2RelativePath], {relativeTo: this.route});
      }
    } else {
      this.router.navigateByUrl(this.level2AbsolutePath);
    }
  }

  public onLevel3LabelClick() {
    if (!isNullOrUndefined(this.level3RelativePath)) {
      if (!isNullOrUndefined(this.level3RelativePathParams)) {
        this.router.navigate([this.level3RelativePath, this.level3RelativePathParams], {relativeTo: this.route});
      } else {
        this.router.navigate([this.level3RelativePath], {relativeTo: this.route});
      }
    } else {
      this.router.navigateByUrl(this.level3AbsolutePath);
    }
  }
}
