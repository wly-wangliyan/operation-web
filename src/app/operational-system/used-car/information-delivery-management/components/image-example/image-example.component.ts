import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
    selector: 'app-image-example',
    templateUrl: './image-example.component.html',
    styleUrls: ['./image-example.component.css']
})
export class ImageExampleComponent {

    public onShow() {
        $('#imageExamplePromptDiv').modal('show');
    }

}
