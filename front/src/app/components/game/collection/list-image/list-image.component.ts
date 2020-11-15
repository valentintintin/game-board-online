import { Component, Input, OnInit } from '@angular/core';
import { DrawingService } from '../../../../services/drawing.service';
import { ImageDef } from '../../../../../../../common/models/image';

@Component({
  selector: 'app-list-image',
  templateUrl: './list-image.component.html',
  styleUrls: ['./list-image.component.scss']
})
export class ListImageComponent implements OnInit {

  @Input() images: ImageDef[];

  constructor(private drawingService: DrawingService) { }

  ngOnInit(): void {
  }

  public addImageToCanvas(image: ImageDef): void {
    this.drawingService.addImage(image);
  }
}
