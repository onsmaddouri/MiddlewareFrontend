import { Injectable } from '@angular/core';

export interface ConnectorGuide {
  type: string;
  title: string;
  description: string;
  gitLink: string;
  modelFields: any; // Champs du modèle Connecteur
  configTemplate: any; // Template JSON pour le champ configuration
  examples: Array<{
    name: string;
    modelFields: any;
    config: any;
    description?: string;
  }>;
  validationRules?: any;
}

@Injectable({
  providedIn: 'root'
})
export class GuideService {
  private guides: Map<string, ConnectorGuide> = new Map();

  constructor() {
    this.initializeGuides();
  }

  private initializeGuides() {
    // REST_API Guide - Structure hybride corrigée
    this.guides.set('REST_API', {
      type: 'REST_API',
      title: 'Configuration API REST',
      description: 'Configuration pour connecteurs API REST. Supporte l\'authentification Bearer, Basic, API Key et plus.',
      gitLink: 'https://github.com/company/middleware/blob/main/docs/REST_API_GUIDE.md',
      modelFields: {
        nom: 'Mon API REST',
        type: 'REST_API',
        urlEndpoint: 'https://api.example.com',
        protocole: 'HTTPS',
        authentification: 'Bearer',
        credentials: 'your_bearer_token_here',
        timeout: 30000,
        maxRetries: 3,
        actif: true
      },
      configTemplate: {
        auth_type: 'Bearer',
        extract_endpoint: '/api/data',
        insert_endpoint: '/api/create',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      },
      examples: [
        {
          name: 'API avec Bearer Token',
          description: 'Authentification via Bearer Token (ex: DanceScape)',
          modelFields: {
            urlEndpoint: 'http://localhost:8081',
            protocole: 'HTTP',
            authentification: 'Bearer',
            credentials: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            timeout: 30000,
            maxRetries: 3
          },
          config: {
            auth_type: 'Bearer',
            extract_endpoint: '/competition/list-competitions',
            insert_endpoint: '/competition/create'
          }
        },
        {
          name: 'API avec API Key',
          description: 'Authentification via API Key',
          modelFields: {
            urlEndpoint: 'https://api.service.com',
            protocole: 'HTTPS',
            authentification: 'API_KEY',
            credentials: '',
            timeout: 30000,
            maxRetries: 3
          },
          config: {
            auth_type: 'API_KEY',
            api_key: 'your_api_key_here',
            extract_endpoint: '/api/v1/data',
            insert_endpoint: '/api/v1/data'
          }
        },
        {
          name: 'API avec Basic Auth',
          description: 'Authentification basique username:password',
          modelFields: {
            urlEndpoint: 'https://api.service.com',
            protocole: 'HTTPS',
            authentification: 'BASIC',
            credentials: '',
            timeout: 30000,
            maxRetries: 3
          },
          config: {
            auth_type: 'BASIC',
            username: 'api_user',
            password: 'api_password',
            extract_endpoint: '/api/v1/get',
            insert_endpoint: '/api/v1/post'
          }
        }
      ],
      validationRules: {
        modelRequired: ['nom', 'type', 'urlEndpoint', 'protocole'],
        configRequired: ['auth_type'],
        urlEndpoint: { pattern: '^https?://.*', message: 'URL doit commencer par http:// ou https://' },
        timeout: { min: 1000, max: 300000, message: 'Timeout entre 1 et 300 secondes' }
      }
    });

    // SOAP Guide
    this.guides.set('SOAP', {
      type: 'SOAP',
      title: 'Configuration SOAP Web Service',
      description: 'Configuration pour services web SOAP avec support WSDL et authentification.',
      gitLink: 'https://github.com/company/middleware/blob/main/docs/SOAP_GUIDE.md',
      modelFields: {
        nom: 'Mon Service SOAP',
        type: 'SOAP',
        urlEndpoint: 'https://service.example.com/soap',
        protocole: 'HTTPS',
        authentification: 'Basic',
        credentials: 'username:password',
        timeout: 60000,
        maxRetries: 2,
        actif: true
      },
      configTemplate: {
        wsdl_url: 'https://service.example.com/soap?wsdl',
        service_name: 'MyService',
        operation_name: 'GetData',
        namespace: 'http://example.com/',
        soap_action: 'http://example.com/GetData'
      },
      examples: [
        {
          name: 'Service SOAP SAP',
          description: 'Configuration pour services SOAP SAP',
          modelFields: {
            urlEndpoint: 'https://sap.company.com:8000/sap/bc/srt/rfc',
            protocole: 'HTTPS',
            authentification: 'Basic',
            credentials: 'sap_user:sap_password',
            timeout: 120000,
            maxRetries: 2
          },
          config: {
            wsdl_url: 'https://sap.company.com:8000/sap/bc/srt/wsdl',
            service_name: 'CustomerService',
            operation_name: 'GetCustomerData',
            soap_action: 'http://sap.company.com/GetCustomerData',
            namespace: 'urn:sap-com:document:sap:soap:functions:mc-style'
          }
        }
      ]
    });

    // DATABASE Guide
    this.guides.set('DATABASE', {
      type: 'DATABASE',
      title: 'Configuration Base de Données',
      description: 'Configuration pour connexions base de données MySQL, PostgreSQL, Oracle.',
      gitLink: 'https://github.com/company/middleware/blob/main/docs/DATABASE_GUIDE.md',
      modelFields: {
        nom: 'Ma Base de Données',
        type: 'DATABASE',
        urlEndpoint: 'jdbc:mysql://localhost:3306/database',
        protocole: 'MySQL',
        authentification: 'Basic',
        credentials: 'username:password',
        timeout: 30000,
        maxRetries: 3,
        actif: true
      },
      configTemplate: {
        driver: 'com.mysql.cj.jdbc.Driver',
        schema: 'production',
        connection_url: 'jdbc:mysql://localhost:3306/database',
        username: 'db_user',
        password: 'db_password'
      },
      examples: [
        {
          name: 'MySQL Production',
          description: 'Connexion MySQL production',
          modelFields: {
            urlEndpoint: 'jdbc:mysql://mysql.company.com:3306/production',
            protocole: 'MySQL',
            credentials: 'db_user:db_password',
            timeout: 30000,
            maxRetries: 3
          },
          config: {
            driver: 'com.mysql.cj.jdbc.Driver',
            schema: 'production'
          }
        },
        {
          name: 'PostgreSQL',
          description: 'Connexion PostgreSQL',
          modelFields: {
            urlEndpoint: 'jdbc:postgresql://postgres.company.com:5432/erp_db',
            protocole: 'PostgreSQL',
            credentials: 'postgres_user:postgres_password',
            timeout: 30000,
            maxRetries: 3
          },
          config: {
            driver: 'org.postgresql.Driver',
            schema: 'public'
          }
        }
      ]
    });

    // FTP_SFTP Guide
    this.guides.set('FTP_SFTP', {
      type: 'FTP_SFTP',
      title: 'Configuration FTP/SFTP',
      description: 'Configuration pour transferts de fichiers via FTP et SFTP.',
      gitLink: 'https://github.com/company/middleware/blob/main/docs/FTP_SFTP_GUIDE.md',
      modelFields: {
        nom: 'Mon Serveur FTP',
        type: 'FTP_SFTP',
        urlEndpoint: 'ftp://ftp.example.com',
        protocole: 'FTP',
        authentification: 'Basic',
        credentials: 'username:password',
        timeout: 30000,
        maxRetries: 3,
        actif: true
      },
      configTemplate: {
        host: 'ftp.example.com',
        port: 21,
        username: 'ftp_user',
        password: 'ftp_password',
        remote_path: '/data/export',
        file_pattern: '*.csv'
      },
      examples: [
        {
          name: 'FTP Client Export',
          description: 'Export de fichiers clients via FTP',
          modelFields: {
            urlEndpoint: 'ftp://ftp.client.com',
            protocole: 'FTP',
            credentials: 'ftp_user:ftp_password',
            timeout: 30000,
            maxRetries: 3
          },
          config: {
            host: 'ftp.client.com',
            port: 21,
            remote_path: '/data/export',
            file_pattern: 'customers_*.csv'
          }
        },
        {
          name: 'SFTP Secure',
          description: 'Transfert sécurisé via SFTP',
          modelFields: {
            urlEndpoint: 'sftp://sftp.secure.com',
            protocole: 'SFTP',
            credentials: 'sftp_user:sftp_password',
            timeout: 30000,
            maxRetries: 3
          },
          config: {
            host: 'sftp.secure.com',
            port: 22,
            remote_path: '/secure/data',
            file_pattern: '*.xml'
          }
        }
      ]
    });

    // ODOO Guide
    this.guides.set('ODOO', {
      type: 'ODOO',
      title: 'Configuration Odoo ERP',
      description: 'Configuration spécifique pour Odoo ERP avec XML-RPC.',
      gitLink: 'https://github.com/company/middleware/blob/main/docs/ODOO_CONFIGURATION.md',
      modelFields: {
        nom: 'Odoo Production',
        type: 'ODOO',
        urlEndpoint: 'https://odoo.company.com/xmlrpc/2/object',
        protocole: 'HTTPS',
        authentification: 'Basic',
        credentials: 'odoo_user:odoo_password',
        timeout: 30000,
        maxRetries: 3,
        actif: true
      },
      configTemplate: {
        api_key: 'odoo_api_key',
        database: 'company_prod',
        model: 'sale.order',
        modules: ['sale', 'purchase', 'inventory', 'accounting']
      },
      examples: [
        {
          name: 'Odoo Production',
          description: 'Connexion Odoo production',
          modelFields: {
            urlEndpoint: 'https://odoo.company.com/xmlrpc/2/object',
            protocole: 'HTTPS',
            credentials: 'admin:odoo_password',
            timeout: 30000,
            maxRetries: 3
          },
          config: {
            api_key: 'odoo_api_key_here',
            database: 'company_prod',
            model: 'sale.order',
            modules: ['sale', 'purchase', 'inventory', 'accounting']
          }
        }
      ]
    });

    // ERPNEXT Guide
    this.guides.set('ERPNEXT', {
      type: 'ERPNEXT',
      title: 'Configuration ERPNext',
      description: 'Configuration pour ERPNext avec API REST.',
      gitLink: 'https://github.com/company/middleware/blob/main/docs/ERPNEXT_CONFIGURATION.md',
      modelFields: {
        nom: 'ERPNext Production',
        type: 'ERPNEXT',
        urlEndpoint: 'https://erpnext.company.com/api/resource',
        protocole: 'HTTPS',
        authentification: 'API_KEY',
        credentials: '',
        timeout: 30000,
        maxRetries: 3,
        actif: true
      },
      configTemplate: {
        api_key: 'erpnext_api_key',
        api_secret: 'erpnext_api_secret',
        doctype: 'Item',
        modules: ['Selling', 'Buying', 'Stock', 'Accounting']
      },
      examples: [
        {
          name: 'ERPNext Production',
          description: 'Connexion ERPNext production',
          modelFields: {
            urlEndpoint: 'https://erpnext.company.com/api/resource',
            protocole: 'HTTPS',
            timeout: 30000,
            maxRetries: 3
          },
          config: {
            api_key: 'erpnext_api_key',
            api_secret: 'erpnext_api_secret',
            doctype: 'Item',
            modules: ['Selling', 'Buying', 'Stock', 'Accounting']
          }
        }
      ]
    });

    // PRESTASHOP Guide
    this.guides.set('PRESTASHOP', {
      type: 'PRESTASHOP',
      title: 'Configuration PrestaShop',
      description: 'Configuration pour PrestaShop e-commerce.',
      gitLink: 'https://github.com/company/middleware/blob/main/docs/PRESTASHOP_GUIDE.md',
      modelFields: {
        nom: 'PrestaShop Store',
        type: 'PRESTASHOP',
        urlEndpoint: 'https://shop.example.com/api',
        protocole: 'HTTPS',
        authentification: 'API_KEY',
        credentials: '',
        timeout: 30000,
        maxRetries: 3,
        actif: true
      },
      configTemplate: {
        api_key: 'prestashop_api_key',
        resource: 'products'
      },
      examples: [
        {
          name: 'PrestaShop Products',
          description: 'Synchronisation des produits PrestaShop',
          modelFields: {
            urlEndpoint: 'https://shop.example.com/api',
            protocole: 'HTTPS',
            timeout: 30000,
            maxRetries: 3
          },
          config: {
            api_key: 'your_prestashop_api_key',
            resource: 'products'
          }
        }
      ]
    });

    // MAGENTO Guide
    this.guides.set('MAGENTO', {
      type: 'MAGENTO',
      title: 'Configuration Magento',
      description: 'Configuration pour Magento e-commerce.',
      gitLink: 'https://github.com/company/middleware/blob/main/docs/MAGENTO_GUIDE.md',
      modelFields: {
        nom: 'Magento Store',
        type: 'MAGENTO',
        urlEndpoint: 'https://magento.example.com/rest/V1',
        protocole: 'HTTPS',
        authentification: 'Bearer',
        credentials: '',
        timeout: 30000,
        maxRetries: 3,
        actif: true
      },
      configTemplate: {
        access_token: 'magento_access_token',
        resource: 'products'
      },
      examples: [
        {
          name: 'Magento Products',
          description: 'Synchronisation des produits Magento',
          modelFields: {
            urlEndpoint: 'https://magento.example.com/rest/V1',
            protocole: 'HTTPS',
            timeout: 30000,
            maxRetries: 3
          },
          config: {
            access_token: 'your_magento_access_token',
            resource: 'products'
          }
        }
      ]
    });
  }

  getGuide(type: string): ConnectorGuide | undefined {
    return this.guides.get(type);
  }

  getAllGuides(): ConnectorGuide[] {
    return Array.from(this.guides.values());
  }

  getAvailableTypes(): string[] {
    return Array.from(this.guides.keys());
  }

  /**
   * Génère la configuration complète pour un connecteur (modèle + JSON)
   */
  getCompleteConfiguration(type: string, exampleIndex: number = -1): { modelFields: any; configuration: string } | null {
    const guide = this.getGuide(type);
    if (!guide) return null;

    let modelFields: any;
    let configJson: any;

    if (exampleIndex >= 0 && guide.examples[exampleIndex]) {
      const example = guide.examples[exampleIndex];
      modelFields = { ...guide.modelFields, ...example.modelFields };
      configJson = example.config;
    } else {
      modelFields = guide.modelFields;
      configJson = guide.configTemplate;
    }

    return {
      modelFields,
      configuration: JSON.stringify(configJson, null, 2)
    };
  }

  validateConfiguration(type: string, modelFields: any, config: any): { valid: boolean; errors: string[] } {
    const guide = this.getGuide(type);
    if (!guide || !guide.validationRules) {
      return { valid: true, errors: [] };
    }

    const errors: string[] = [];
    const rules = guide.validationRules;

    // Vérifier les champs requis du modèle
    if (rules.modelRequired) {
      for (const field of rules.modelRequired) {
        if (!modelFields[field] || modelFields[field] === '') {
          errors.push(`Le champ modèle '${field}' est requis`);
        }
      }
    }

    // Vérifier les champs requis de la configuration
    if (rules.configRequired) {
      for (const field of rules.configRequired) {
        if (!config[field] || config[field] === '') {
          errors.push(`Le champ configuration '${field}' est requis`);
        }
      }
    }

    // Vérifier les patterns
    if (rules.urlEndpoint && modelFields.urlEndpoint) {
      const pattern = new RegExp(rules.urlEndpoint.pattern);
      if (!pattern.test(modelFields.urlEndpoint)) {
        errors.push(rules.urlEndpoint.message);
      }
    }

    // Vérifier les valeurs numériques
    if (rules.timeout && modelFields.timeout) {
      const timeout = parseInt(modelFields.timeout);
      if (timeout < rules.timeout.min || timeout > rules.timeout.max) {
        errors.push(rules.timeout.message);
      }
    }

    return { valid: errors.length === 0, errors };
  }
}