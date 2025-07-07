import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../_services/application.service';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.css']
})
export class IntegrationComponent implements OnInit {
  applications: any[] = [];
  currentApplication: any = null;
  currentIndex = -1;

  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.retrieveApplications();
  }

  retrieveApplications(): void {
    this.applicationService.getAll()
      .subscribe(
        data => {
          this.applications = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrieveApplications();
    this.currentApplication = null;
    this.currentIndex = -1;
  }

  setActiveApplication(application: any, index: number): void {
    this.currentApplication = application;
    this.currentIndex = index;
  }
} 