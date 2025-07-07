import { Component, OnInit, AfterViewInit } from '@angular/core';
import { StorageService } from '../_services/storage.service';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  content?: string;
  isLoggedIn = false;
  solutionModalData: any = null;
  private solutionModal: any;

  solutionsData: { [key: string]: { title: string; description: string; color: string } } = {
    integration: {
      title: 'Intégration de Données',
      description: 'Connectez et synchronisez vos systèmes en temps réel grâce à notre middleware, garantissant la cohérence et la rapidité des échanges.',
      color: 'linear-gradient(135deg, #4a90e2 0%, #046aa1 100%)'
    },
    multisource: {
      title: 'Gestion Multi-sources',
      description: 'Centralisez vos données de différentes sources pour une vision unifiée et une prise de décision facilitée.',
      color: 'linear-gradient(135deg, #60a5fa 0%, #357abd 100%)'
    },
    analytics: {
      title: 'Analyses Avancées',
      description: 'Transformez vos données en insights actionnables grâce à des tableaux de bord et des outils analytiques puissants.',
      color: 'linear-gradient(135deg, #38bdf8 0%, #003366 100%)'
    },
    config: {
      title: 'Configuration Flexible',
      description: "Adaptez la plateforme à vos besoins spécifiques grâce à une configuration simple et modulaire. Notre middleware vous permet d'activer ou de désactiver des modules, de personnaliser les flux de données et de répondre à toutes les exigences métiers.",
      color: 'linear-gradient(135deg, #4a90e2 0%, #046aa1 100%)'
    }
  };

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
  }

  ngAfterViewInit() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });

    const modalElement = document.getElementById('solutionModal');
    if (modalElement) {
      this.solutionModal = new bootstrap.Modal(modalElement, {
        keyboard: true,
        backdrop: 'static',
        focus: true
      });
    }
  }

  openSolutionModal(key: string) {
    this.solutionModalData = this.solutionsData[key];
    if (this.solutionModal) {
      this.solutionModal.show();
    }
  }
}
