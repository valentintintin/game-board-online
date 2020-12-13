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
  private canvas: HTMLCanvasElement;

  constructor(public drawingService: DrawingService) { }

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.drawingService.createCanvas(this.canvas, this.menu);
  }
}
