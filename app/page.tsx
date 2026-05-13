import Link from 'next/link'

const roles = [
  {
    href: '/opettaja',
    icon: '📋',
    title: 'Opettaja',
    description: 'Lisää oppilaiden tiedot ja saat tekoälyn generoiman tilannearvion ja toimintaohjeet.',
    color: 'hover:border-indigo-300 hover:bg-indigo-50',
    badge: 'Opettajan näkymä',
  },
  {
    href: '/opiskelija',
    icon: '📚',
    title: 'Opiskelija',
    description: 'Näe sinulle henkilökohtaisesti kirjoitettu kannustava viesti.',
    color: 'hover:border-emerald-300 hover:bg-emerald-50',
    badge: 'Oppilaan näkymä',
  },
  {
    href: '/huoltaja',
    icon: '🏠',
    title: 'Huoltaja',
    description: 'Saat lyhyen ja selkeän katsauksen lapsesi tilanteesta koulussa.',
    color: 'hover:border-amber-300 hover:bg-amber-50',
    badge: 'Huoltajan näkymä',
  },
]

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">🌱</div>
        <h1 className="text-3xl font-bold text-stone-900 mb-3 tracking-tight">
          Kasvualusta 2035
        </h1>
        <p className="text-stone-500 text-lg leading-relaxed">
          Varhaisen tuen järjestelmä — tunnistetaan tuen tarve ajoissa,
          <br />reagoidaan lämmöllä ja yhteistyöllä.
        </p>
      </div>

      <div className="grid gap-4">
        {roles.map(role => (
          <Link
            key={role.href}
            href={role.href}
            className={`flex items-start gap-4 p-5 rounded-2xl bg-white border-2 border-stone-100 transition-all ${role.color}`}
          >
            <div className="text-3xl mt-0.5">{role.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-stone-800 text-lg">{role.title}</span>
                <span className="text-xs text-stone-400 bg-stone-100 rounded-full px-2 py-0.5">{role.badge}</span>
              </div>
              <p className="text-stone-500 text-sm leading-relaxed">{role.description}</p>
            </div>
            <span className="text-stone-300 text-lg mt-1">→</span>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-stone-50 border border-stone-100 rounded-2xl p-5 text-sm text-stone-500 text-center">
        <p>🔒 MVP-versio — ei kirjautumista. Roolinvaihto yläpalkista.</p>
      </div>
    </div>
  )
}
