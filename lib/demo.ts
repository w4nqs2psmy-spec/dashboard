// Demotila: sääntöpohjainen arvio ja valmiit viestipohjat ilman Claude-kutsua.
// Käytössä, kun ANTHROPIC_API_KEY puuttuu tai DEMO_MODE=true.
import { AnalysisResult, GradeTrend, RiskLevel } from '@/types'

interface Input {
  name: string
  absences: number
  incomplete_tasks: number
  grade_trend: GradeTrend
  wellbeing_score: number
  teacher_notes: string
}

function score(d: Input): number {
  let s = 0
  if (d.absences >= 10) s += 2
  else if (d.absences >= 5) s += 1
  if (d.incomplete_tasks >= 6) s += 2
  else if (d.incomplete_tasks >= 3) s += 1
  if (d.grade_trend === 'declining') s += 2
  if (d.grade_trend === 'improving') s -= 1
  if (d.wellbeing_score <= 2) s += 2
  else if (d.wellbeing_score === 3) s += 1
  return s
}

function riskFromScore(s: number): RiskLevel {
  if (s >= 5) return 'high'
  if (s >= 2) return 'medium'
  return 'low'
}

function concerns(d: Input): string[] {
  const c: string[] = []
  if (d.absences >= 5) c.push(`poissaoloja on kertynyt ${d.absences}`)
  if (d.incomplete_tasks >= 3) c.push(`tehtäviä on kesken ${d.incomplete_tasks}`)
  if (d.grade_trend === 'declining') c.push('arvosanat ovat laskusuunnassa')
  if (d.wellbeing_score <= 2) c.push('hyvinvointikyselyn tulos on matala')
  return c
}

function list(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} ja ${items[items.length - 1]}`
}

export function demoAnalysis(d: Input): AnalysisResult {
  const risk = riskFromScore(score(d))
  const first = d.name.split(' ')[0]
  const c = concerns(d)
  const noteLine = d.teacher_notes ? ` Huomioi myös oma havaintosi: "${d.teacher_notes}"` : ''

  if (risk === 'high') {
    return {
      risk_level: 'high',
      teacher_message: `Tilanteessa on useita samanaikaisia huolen merkkejä: ${list(c)}. Ehdotan, että juttelet oppilaan kanssa kahden kesken vielä tällä viikolla ja kysyt avoimesti, miten hänellä menee. Ota yhteyttä huoltajaan ja kutsu koolle lyhyt yhteinen tapaaminen. Konsultoi kuraattoria tai terveydenhoitajaa, ja sopikaa yhdessä 1–2 konkreettista tukitoimea, esimerkiksi tehtävien priorisointi.${noteLine}`,
      student_message: `Hei ${first}! Haluan, että tiedät: olet tärkeä osa tätä porukkaa, ja olen täällä sinua varten. Mitä jos juteltaisiin pian hetki kahdestaan? Katsotaan yhdessä, miten saadaan arki tuntumaan vähän kevyemmältä.`,
      guardian_message: `Hei! Olemme koulussa huomanneet, että ${first} on viime aikoina tarvinnut tavallista enemmän tukea: ${list(c)}. Haluaisimme kuulla teidän näkemyksenne ja miettiä yhdessä, miten voimme parhaiten auttaa. Ehdotamme lyhyttä tapaamista tai puhelua lähipäivinä. Tavoitteena on yhteinen suunta, ei syyllisten etsiminen.`,
    }
  }

  if (risk === 'medium') {
    return {
      risk_level: 'medium',
      teacher_message: `Tilanteessa on joitakin merkkejä, joihin kannattaa tarttua ajoissa${c.length ? `: ${list(c)}` : ''}. Varaa lähiaikoina hetki lyhyelle, rennolle keskustelulle ja kysy, mikä tuntuu nyt haastavalta. Sopikaa yhdessä yksi pieni, saavutettava tavoite seuraavalle viikolle. Seuraa tilannetta kahden viikon ajan ja ole tarvittaessa yhteydessä kotiin.${noteLine}`,
      student_message: `Hei ${first}! Olet tehnyt hyvää työtä, ja huomaan sen. Jos jokin tuntuu juuri nyt raskaalta, voit aina tulla juttelemaan. Otetaan yhdessä pieni askel kerrallaan.`,
      guardian_message: `Hei! Halusimme kertoa, että ${first} pärjää koulussa monessa asiassa hyvin, mutta${c.length ? ` ${list(c)}` : ' muutamassa asiassa olisi hyvä tukea'}. Emme ole huolissamme, mutta pieni yhteinen tsemppaus nyt auttaa ehkäisemään isompia haasteita. Olisi kiva kuulla, miltä tilanne näyttää kotona.`,
    }
  }

  return {
    risk_level: 'low',
    teacher_message: `Tilanne näyttää hyvältä, eikä erityisiä tukitoimia tarvita nyt. Anna myönteistä palautetta ja kerro, mitä olet huomannut hänen tehneen hyvin. Pidä tilanne tavallisessa seurannassa.${noteLine}`,
    student_message: `Hei ${first}! Olet tehnyt upeaa työtä, ja se näkyy. Jatka samaan malliin, ja muista, että voit aina kysyä apua, jos tarvitset.`,
    guardian_message: `Hei! Lyhyt ja iloinen kuulumisviesti: ${first} on pärjännyt koulussa hyvin. Hän on ollut aktiivinen ja hoitanut tehtävänsä. Kiitos yhteistyöstä, ja jatketaan samaan malliin!`,
  }
}
