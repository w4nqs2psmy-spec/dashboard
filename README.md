# 🌱 Kasvualusta 2035

Varhaisen tuen järjestelmä suomalaisille kouluille (MVP). Opettaja syöttää oppilaan tiedot, ja järjestelmä arvioi tuen tarpeen ja kirjoittaa kolme viestiä: toimintaohjeen opettajalle, kannustuksen oppilaalle ja tilannekatsauksen huoltajalle.

## Käynnistys

```bash
npm install
cp .env.example .env.local   # lisää ANTHROPIC_API_KEY, tai jätä tyhjäksi demotilaa varten
npm run seed                 # tyhjentää tietokannan ja lisää 5 testioppilasta
npm run dev                  # → http://localhost:3000
```

## Demotila

Jos `ANTHROPIC_API_KEY` puuttuu tai `DEMO_MODE=true`, Claudea ei kutsuta. Arvio tehdään yksinkertaisilla säännöillä ja viestit valmiista pohjista. Opettajanäkymä näyttää tällöin violetin "Demotila"-merkinnän. Demotila sopii käyttöliittymän esittelyyn, ei viestien laadun arviointiin.

## Testioppilaat (`npm run seed`)

| Oppilas | Poissaolot | Tehtävät | Trendi | Hyvinvointi | Tarkoitus |
|---|---|---|---|---|---|
| Aino Virtanen | 1 | 0 | paraneva | 5 | matala riski |
| Eetu Korhonen | 6 | 3 | vakaa | 3 | kohtalainen |
| Venla Mäkinen | 14 | 8 | heikkenevä | 1 | korkea |
| Leo Nieminen | 0 | 0 | heikkenevä | 2 | ristiriitainen (muutto) |
| Mira Hämäläinen | 10 | 0 | vakaa | 4 | ristiriitainen |

Kaikki testitiedot ovat keksittyjä. **Älä syötä oikeiden oppilaiden tietoja** ennen kuin tietosuoja-asiat on sovittu koulutuksen järjestäjän kanssa.

## Rakenne

- `app/opettaja`, `app/opiskelija`, `app/huoltaja`: roolinäkymät
- `app/api/students`, `app/api/analyze`: rajapinta
- `lib/claude.ts`: Claude-kutsu, `lib/demo.ts`: demotilan säännöt
- `lib/schema.sql`: tietokantaskeema (SQLite, tiedosto `kasvualusta.db`)
