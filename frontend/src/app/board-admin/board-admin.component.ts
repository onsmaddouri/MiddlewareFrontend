import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { EventBusService } from '../_shared/event-bus.service';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  content?: string;
  userCount: number = 0;

  constructor(
    private userService: UserService,
    private eventBusService: EventBusService
  ) {}

  ngOnInit(): void {
    this.userService.getAdminBoard().subscribe({
      next: data => {
        this.content = data;
      },
      error: err => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            this.content = res.message;
          } catch {
            this.content = `Error with status: ${err.status} - ${err.statusText}`;
          }
        } else {
          this.content = `Error with status: ${err.status}`;
        }
      }
    });

    this.userService.getCount().subscribe({
      next: count => {
        this.userCount = count;
      },
      error: err => {
        console.error('Error fetching user count:', err);
      }
    });
  }

  logout(): void {
    this.eventBusService.emit({ name: 'logout', value: null });
  }
} 