# CLAUDE.md
> File di configurazione per Claude Code.
> Leggi questo file all'inizio di ogni sessione prima di fare qualsiasi cosa.
> Aggiorna la sezione "Stato del progetto" a fine di ogni sessione.

---

## 1. Identità del progetto

**Nome**: Fuori Salone Experience
**Tipo**: Event Explorer App — template replicabile per eventi urbani distribuiti
**Prodotto da**: JackSpike Design
**Brief completo**: vedi `BRIEF.md` nella root del progetto

---

## 2. Stack tecnico

- **Framework**: React + Vite
- **Mappa**: Leaflet.js via `react-leaflet`
- **Auth + DB**: Supabase
- **Styling**: Tailwind CSS
- **Deploy**: Vercel (free tier, deploy automatico da `main`)
- **Package manager**: npm

---

## 3. Struttura cartelle prevista

```
/
├── public/
│   └── images/          # Foto installazioni
├── src/
│   ├── config/
│   │   └── app.config.js        # Configurazione centralizzata evento
│   ├── data/
│   │   └── events.json          # Dati installazioni (fonte dati Fase 1)
│   ├── lib/
│   │   └── supabase.js          # Client Supabase inizializzato
│   ├── hooks/
│   │   ├── useInstallations.js  # Hook dati — DA MODIFICARE IN FASE 2
│   │   ├── useFavorites.js      # Hook preferiti Supabase
│   │   └── useTheme.js          # Hook dark/light mode
│   ├── components/
│   │   ├── Map/                 # Componenti mappa Leaflet
│   │   ├── List/                # Lista installazioni + filtri
│   │   ├── Itinerary/           # Percorso suggerito
│   │   ├── Favorites/           # Preferiti utente
│   │   ├── Detail/              # Bottom sheet dettaglio
│   │   └── UI/                  # Componenti base (Badge, Button, ecc.)
│   ├── pages/                   # Pagine principali
│   ├── styles/
│   │   └── globals.css          # CSS custom properties dark/light
│   └── App.jsx
├── BRIEF.md
├── CLAUDE.md                    # Questo file
├── .env.local                   # Variabili d'ambiente (non committare)
└── .env.example                 # Template variabili da committare
```

---

## 4. Variabili d'ambiente

File `.env.local` (non committare mai):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

File `.env.example` (committare, senza valori reali):
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 5. Regole e convenzioni

### Generale
- **Mobile-first sempre** — viewport di riferimento 390px (iPhone 14)
- Nessun valore hardcodato — tutto passa da `app.config.js`
- Commentare con `// TODO FASE 2: sostituire con chiamata Supabase` le sezioni da aggiornare
- Un componente = un file = una responsabilità

### Dati
- Tutti i dati installazioni passano dall'hook `useInstallations()`
- In Fase 1 l'hook legge da `events.json`
- In Fase 2 l'hook leggerà da Supabase — nessun componente deve cambiare
- Non accedere mai direttamente al JSON dai componenti

### Stile
- Dark/Light mode via CSS custom properties su `:root`
- Preferenza tema salvata in `localStorage`
- **Cyan `#0080C9`** → azioni primarie, navigazione, zone
- **Fucsia `#FF006E`** → preferiti, highlight editoriali, accenti emotivi
- Font: solo **Montserrat** (Google Fonts), pesi 400/500/600/700

### Leaflet
- Importare sempre `import 'leaflet/dist/leaflet.css'` in `App.jsx`
- Applicare il fix icone default Leaflet su Vite all'inizializzazione
- Usare `react-leaflet` per tutti i componenti mappa

### Supabase
- Client inizializzato una sola volta in `/src/lib/supabase.js`
- Auth: magic link via email (nessuna password)
- I preferiti richiedono login — tutto il resto funziona senza account
- Row Level Security abilitata sulla tabella `favorites`

---

## 6. Comandi principali

```bash
npm run dev        # Avvia dev server locale
npm run build      # Build produzione
npm run preview    # Preview build locale
```

*(Aggiornare con eventuali comandi aggiuntivi dopo il setup)*

---

## 7. Supabase — Schema DB

```sql
create table favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  installation_id text not null,
  created_at timestamp with time zone default now()
);

alter table favorites enable row level security;

create policy "Users can manage their own favorites"
on favorites for all
using (auth.uid() = user_id);
```

---

## 8. Priorità di sviluppo — Sessione 1

Costruire in questo ordine:

1. Setup progetto Vite + React + Tailwind
2. `app.config.js` e `events.json` con dati reali
3. Dark/Light mode base
4. Mappa con pin (Leaflet)
5. Lista installazioni con filtri
6. Bottom sheet dettaglio installazione
7. Tab bar navigazione
8. Tab Itinerario
9. Supabase Auth + preferiti
10. Deploy su Vercel

---

## 9. Schema dati attuale (Sessione 2)

```json
{
  "id": "fs26-001",
  "name": "Nome installazione",
  "artist_studio": "Studio / Artista",
  "zone": "Porta Nuova",
  "setting": "outdoor | cortile",
  "address": "Via ..., Milano",
  "lat": 45.4848,
  "lng": 9.1917,
  "description": "Max 200 caratteri.",
  "image": "https://...",
  "hours": { "lun": "10:00-20:00", ... },
  "night_note": "Testo o null",
  "highlight": true,
  "routes": { "30min": 1, "pausa": 2, "mezza": 3, "full": 4, "notte": 1 }
}
```

Percorsi: `30min` (2–3 tappe), `pausa` (4–5h), `mezza` (metà città), `full` (tutto), `notte` (solo night_note)

---

## 10. Stato del progetto

*(Claude Code aggiorna questa sezione a fine di ogni sessione)*

**Ultimo aggiornamento**: 2026-04-18
**Sessione**: 2
**Completato**:
- Sessione 1: setup, hooks, TabBar, MapView, ListView, DetailSheet, ItineraryView, Supabase Auth, FavoritesView, code splitting
- Sessione 2: Pivot "Free Art Trail" — 21 installazioni gratuite outdoor/cortile, nuovo schema dati (artist_studio, setting, night_note, routes dict), HomeView dashboard (percorsi + highlights + nearby), GPS UserLocation real-time, 5 percorsi a tempo (30min/pausa/mezza/full/notte), FilterBar redesign (zone/ambientazione), DetailSheet + share button + night_note, ItineraryView con tempi cammino haversine
**In corso**: —
**Prossimo step**: Step 10 — Deploy su Vercel

---

*JackSpike Design — Aprile 2026*
