import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  state: 'network.error' | 'game.pause';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.state = this.route.snapshot.data['state'];
  }
}
