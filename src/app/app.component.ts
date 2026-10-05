import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Aprašome, kokius duomenis turi vienas užrašas.
interface Uzrasas {
  pavadinimas: string;
  tekstas: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="langelis">
      <header class="antraste">
        <h1>Mano užrašai</h1>
        <p class="paaiskinimas">Užrašai saugomi šioje naršyklėje.</p>
      </header>

      <form class="forma" (ngSubmit)="pridetiUzrasa()">
        <label for="pavadinimas">Pavadinimas</label>
        <input
          id="pavadinimas"
          name="pavadinimas"
          type="text"
          [(ngModel)]="pavadinimas"
          required>

        <label for="tekstas">Tekstas</label>
        <textarea
          id="tekstas"
          name="tekstas"
          rows="5"
          [(ngModel)]="tekstas"
          required></textarea>

        <button type="submit">Pridėti</button>
      </form>

      <p class="klaida" role="status">{{ klaida }}</p>

      <h2>Išsaugoti užrašai</h2>

      @if (uzrasai.length === 0) {
        <p class="tuscia">Užrašų dar nėra.</p>
      }

      <ul>
        @for (uzrasas of uzrasai; track $index; let i = $index) {
          <li class="uzrasas">
            <h3>{{ uzrasas.pavadinimas }}</h3>
            <p>{{ uzrasas.tekstas }}</p>
            <button
              type="button"
              class="trinti"
              [attr.aria-label]="'Ištrinti užrašą: ' + uzrasas.pavadinimas"
              (click)="istrintiUzrasa(i)">
              Ištrinti
            </button>
          </li>
        }
      </ul>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      padding: 32px 16px;
      box-sizing: border-box;
      background: #dce8df;
      color: #243028;
      font-family: Segoe UI, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
    }

    .langelis {
      max-width: 640px;
      margin: 0 auto;
      padding: 28px;
      background: #fbfaf6;
      border-radius: 12px;
      border: 1px solid #c5d2c8;
      box-shadow: 0 8px 24px rgba(40, 70, 50, 0.12);
    }

    .antraste {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 3px solid #3f6f55;
    }

    h1 {
      margin: 0 0 8px;
      color: #2f5a43;
      font-size: 32px;
    }

    h2 {
      margin-top: 28px;
      font-size: 22px;
      color: #2f5a43;
    }

    .forma {
      padding: 18px;
      background: #eef5f0;
      border-radius: 8px;
    }

    label {
      display: block;
      margin-bottom: 6px;
      font-weight: bold;
    }

    input, textarea {
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 16px;
      padding: 10px 12px;
      border: 1px solid #9fb5a6;
      border-radius: 6px;
      background: white;
      font: inherit;
    }

    textarea { resize: vertical; }

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      background: #3f6f55;
      color: white;
      font: inherit;
      cursor: pointer;
    }

    button:hover { background: #315744; }

    button:focus-visible, input:focus-visible, textarea:focus-visible {
      outline: 3px solid #6a87ed;
      outline-offset: 3px;
    }

    .paaiskinimas { margin: 0; color: #5d6b62; font-size: 14px; }
    .klaida { color: #a32222; }
    .klaida:empty { display: none; }
    .tuscia { color: #5d6b62; }
    ul { list-style: none; padding: 0; margin: 0; }

    .uzrasas {
      margin-bottom: 12px;
      padding: 16px;
      border: 1px solid #e0d7c4;
      border-left: 6px solid #e0b35a;
      border-radius: 8px;
      background: #fff8e8;
      overflow-wrap: anywhere;
    }

    .uzrasas h3 { margin: 0 0 8px; }
    .uzrasas p { margin: 0 0 12px; white-space: pre-wrap; }
    .trinti { background: #b92b35; }
    .trinti:hover { background: #96212a; }

    @media (max-width: 600px) {
      :host { padding: 16px 10px; }
      .langelis { padding: 16px; }
    }
  `]
})
export class AppComponent implements OnInit {
  pavadinimas = '';
  tekstas = '';
  klaida = '';
  uzrasai: Uzrasas[] = [];

  // Šiuo raktu randame užrašus naršyklės saugykloje.
  private saugyklosRaktas = 'mano-angular-uzrasai';

  // Paleidus komponentą atkuriame išsaugotą sąrašą.
  ngOnInit() {
    try {
      const issaugoti = localStorage.getItem(this.saugyklosRaktas);

      if (issaugoti !== null) {
        const duomenys = JSON.parse(issaugoti);

        if (!Array.isArray(duomenys) || !duomenys.every(uzrasas =>
          uzrasas !== null &&
          typeof uzrasas.pavadinimas === 'string' &&
          typeof uzrasas.tekstas === 'string'
        )) {
          throw new Error('Netinkami užrašų duomenys');
        }

        this.uzrasai = duomenys;
      }
    } catch {
      this.klaida = 'Nepavyko perskaityti išsaugotų užrašų.';
    }
  }

  pridetiUzrasa() {
    const pavadinimas = this.pavadinimas.trim();
    const tekstas = this.tekstas.trim();

    if (pavadinimas === '' || tekstas === '') {
      this.klaida = 'Įveskite pavadinimą ir tekstą.';
      return;
    }

    const naujasUzrasas: Uzrasas = { pavadinimas, tekstas };
    const naujasSarasas = this.uzrasai.slice();
    naujasSarasas.push(naujasUzrasas);

    if (this.issaugotiUzrasus(naujasSarasas)) {
      this.pavadinimas = '';
      this.tekstas = '';
    }
  }

  istrintiUzrasa(indeksas: number) {
    const naujasSarasas = this.uzrasai.slice();
    naujasSarasas.splice(indeksas, 1);
    this.issaugotiUzrasus(naujasSarasas);
  }

  // JSON.stringify masyvą paverčia tekstu, kurį priima localStorage.
  // Sąrašą atnaujiname tik tada, kai išsaugoti pavyksta.
  private issaugotiUzrasus(naujasSarasas: Uzrasas[]): boolean {
    try {
      localStorage.setItem(this.saugyklosRaktas, JSON.stringify(naujasSarasas));
      this.uzrasai = naujasSarasas;
      this.klaida = '';
      return true;
    } catch {
      this.klaida = 'Nepavyko išsaugoti. Naršyklės saugykla neprieinama arba pilna.';
      return false;
    }
  }
}
