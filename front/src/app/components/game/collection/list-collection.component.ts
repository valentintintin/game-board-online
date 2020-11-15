import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../services/collection.service';
import { Collection } from '../../../../../../common/models/storage';

@Component({
  selector: 'app-list-collection',
  templateUrl: './list-collection.component.html',
  styleUrls: ['./list-collection.component.scss']
})
export class ListCollectionComponent implements OnInit {

  constructor(public collectionService: CollectionService) { }

  ngOnInit(): void {
  }

  public setCurrentCollection(collection?: Collection): void {
    this.collectionService.changeCurrentCollection(collection);
  }
}
