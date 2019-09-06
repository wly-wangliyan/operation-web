import { Component, OnInit } from '@angular/core';
import { ProjectEntity } from '../project-managemant-http.service';

const PageSize = 15;
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  public projectList: Array<ProjectEntity> = [];

  constructor() { }

  ngOnInit() {
  }

}
