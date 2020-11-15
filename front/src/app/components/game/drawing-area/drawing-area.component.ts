import { Component, Input, OnInit } from '@angular/core';
import { DrawingService } from '../../../services/drawing.service';

@Component({
  selector: 'app-drawing-area',
  templateUrl: './drawing-area.component.html',
  styleUrls: ['./drawing-area.component.scss']
})
export class DrawingAreaComponent implements OnInit {

  constructor(private drawingService: DrawingService) { }

  ngOnInit(): void {
    this.drawingService.createCanvas('canvas');
  }
}
