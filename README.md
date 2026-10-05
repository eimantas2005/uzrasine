# Mano užrašai

Paprasta Angular 19 ir TypeScript aplikacija. Ji sukurta pagal ankstesnio KMI projekto struktūrą.

## Paleidimas

1. Įdiekite Node.js 22 (kartu įdiegiamas npm).
2. Išarchyvuokite ZIP ir atidarykite aplanką `kmi` su Visual Studio Code.
3. Atidarykite terminalą tame aplanke ir paleiskite:

```sh
npm ci
npm start
```

4. Naršyklėje atidarykite `http://localhost:4200`.
5. Serverį sustabdysite terminale paspaudę Ctrl+C.

Projekto aplanko pavadinimas `kmi` paliktas iš ankstesnės užduoties.

## Kaip veikia

- Įvedus pavadinimą ir tekstą, „Pridėti“ įtraukia užrašą į masyvą.
- Angular `@for` atvaizduoja masyvo užrašus puslapyje.
- „Ištrinti“ pašalina pasirinktą užrašą pagal jo indeksą.
- `localStorage` išsaugo sąrašą naršyklėje po kiekvieno pakeitimo.
- `ngOnInit()` perskaito užrašus atidarius ar perkrovus puslapį.
- `[(ngModel)]` susieja formos laukus su komponento kintamaisiais.
- `JSON.stringify()` paverčia masyvą tekstu, o `JSON.parse()` atkuria masyvą.

Pagrindinis failas: `src/app/app.component.ts`. Jame yra HTML šablonas, CSS ir TypeScript logika, kaip ir ankstesnėje KMI aplikacijoje.

Užrašai išlieka toje pačioje naršyklėje tuo pačiu adresu. Išvalius naršyklės svetainės duomenis, jie pašalinami. Duomenų bazė ar papildomas serveris nenaudojami.

## Kompiliavimas

```sh
npm run build
```

ZIP faile nėra `node_modules`, `.angular` ir `.git` aplankų. Priklausomybes atkuria `npm ci`.
