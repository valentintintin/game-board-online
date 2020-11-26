import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DrawingService } from '../../../services/drawing.service';
import { NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-drawing-area',
  templateUrl: './drawing-area.component.html',
  styleUrls: ['./drawing-area.component.scss']
})
export class DrawingAreaComponent implements AfterViewInit {

  @ViewChild('menu') menu: NzDropdownMenuComponent;

  constructor(public drawingService: DrawingService) { }

  ngAfterViewInit(): void {
    document.getElementById('canvas').addEventListener("contextmenu", function (e) {
      e.preventDefault();
    }, false);

    this.drawingService.createCanvas('canvas', this.menu);
  }
}
