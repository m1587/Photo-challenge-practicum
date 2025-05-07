import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  userCount: number | null = null
  challengeCount: number | null = null
  completionRate: string | null = null

  constructor() {}

  ngOnInit(): void {
  }
}
