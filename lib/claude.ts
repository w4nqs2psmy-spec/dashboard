import Anthropic from '@anthropic-ai/sdk'
import { AnalysisResult, GradeTrend } from '@/types'
import { demoAnalysis } from './demo'

const TREND_FI: Record<GradeTrend, string> = {
  improving: 'paraneva',
  stable: 'vakaa',
  declining: 'heikkenevä',
}

const RISK_LEVELS = ['low', 'medium', 'high']

export function isDemoMode(): boolean {
  const key = process.env.ANTHROPIC_API_KEY
  return process.env.DEMO_MODE === 'true' || !key || key.startsWith('your_')
}

export async function analyzeStudent(data: {
  name: string
  absences: number
  incomplete_tasks: number
  grade_trend: GradeTrend
  wellbeing_score: number
  teacher_notes: string
}): Promise<AnalysisResult> {
  if (isDemoMode()) return demoAnalysis(data)

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const prompt = `Olet suomalaisen peruskoulun oppilashuollon asiantuntija. Tehtäväsi on analysoida oppilaan tilannetta ja tuottaa kolme erillistä viestiä: opettajalle, oppilaalle ja huoltajalle.

Oppilaan tiedot:
- Nimi: ${data.name}
- Poissaolot: ${data.absences} kertaa
- Tekemättömät tehtävät: ${data.incomplete_tasks} kpl
- Arvosanatrendi: ${TREND_FI[data.grade_trend]}
- Hyvinvointikyselyn pistemäärä: ${data.wellbeing_score}/5
- Opettajan huomiot: ${data.teacher_notes || 'Ei erillisiä huomioita.'}

Arvioi ensin oppilaan tuen tarve:
- LOW: Kaikki hyvin, pientä huomioita
- MEDIUM: Selkeitä merkkejä tuen tarpeesta, varhainen puuttuminen tärkeää
- HIGH: Välitöntä toimintaa tarvitaan

Tuota vastauksesi täsmälleen seuraavassa JSON-muodossa (ei muita merkkejä ympärillä):

{
  "risk_level": "low" | "medium" | "high",
  "teacher_message": "Opettajalle suunnattu toimintaohje: konkreettiset seuraavat askeleet, mitä tehdä lähipäivinä. Sävy ammatillinen mutta lämmin. 3–5 lausetta.",
  "student_message": "Oppilaalle suunnattu kannustava muistutus: positiivinen, toivoa antava, henkilökohtainen. EI mainita ongelmia suoraan. Sävy: turvallinen aikuinen joka välittää. 2–3 lausetta.",
  "guardian_message": "Huoltajalle suunnattu tilanneyhteenveto: rehellinen mutta rakentava, ehdottaa yhteistyötä. Sävy: kumppanuus, ei syyttely. 3–4 lausetta."
}

Kirjoita kaikki viestit suomeksi. Vältä viranomaiskieltä — käytä lämmintä, inhimillistä kieltä.`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude ei palauttanut JSON-vastausta')

  const result = JSON.parse(jsonMatch[0]) as AnalysisResult
  if (!RISK_LEVELS.includes(result.risk_level)) {
    throw new Error(`Tuntematon riskitaso: ${result.risk_level}`)
  }
  return result
}
