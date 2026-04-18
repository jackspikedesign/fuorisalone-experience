# Fuori Salone Experience — Brief di Prodotto
> Versione 2.0
> Prodotto da: JackSpike Design
> Documento destinato a: Claude Code

---

## 1. Contesto e Obiettivo

### Il problema
Il Fuori Salone / Milano Design Week distribuisce ogni anno decine di installazioni, mostre ed eventi in tutta la città. L'app ufficiale è confusa, le informazioni sono sparse, e molti visitatori si perdono installazioni importanti semplicemente perché non sanno dove sono o come raggiungerle.

### La soluzione
Un'app mobile-first semplice, visiva e guidata che mappa tutte le installazioni chiave, suggerisce un itinerario ottimizzato e permette di navigare verso ogni tappa con un tap.

### Nome app
**Fuori Salone Experience**
URL temporaneo su Vercel: `fuorisalone-experience.vercel.app`
Dominio custom: da collegare successivamente (verificare disponibilità `.it` e `.app`)

### Visione allargata — Template replicabile
Questa app è il primo caso di utilizzo di un template replicabile — **"Event Experience"** — che JackSpike Design può adattare e vendere per qualsiasi evento urbano distribuito su territorio: festival culturali, percorsi enogastronomici, open house, fiere, mercatini, tour tematici. Il codice deve essere scritto con questa replicabilità in mente fin dal primo giorno.

---

## 2. Utente Target

Uso personale e network di riferimento. Non un'app pubblica consumer ma uno strumento pratico per chi si muove a Milano durante la Design Week e vuole orientarsi senza perdere tempo. Ogni utente ha il proprio account e i propri preferiti salvati — i dati di un utente non si mescolano con quelli di un altro. L'utente è esperto del settore, usa lo smartphone durante il giro, non ha pazienza per interfacce complesse.

---

## 3. Funzionalità — Priorità MoSCoW

### MUST HAVE (Fase 1 — MVP)
- **Mappa interattiva** con pin per ogni installazione (Leaflet.js)
- **Lista installazioni** navigabile con anteprima rapida
- **Dettaglio installazione**: nome, brand, zona, tipo, orari, descrizione breve, foto, indirizzo
- **Navigazione esterna**: bottone "Naviga" che apre Google Maps con indirizzo precompilato
- **Itinerario suggerito**: percorso pre-costruito editorialmente, visualizzato su mappa con ordine delle tappe
- **Filtri**: per zona/quartiere, per tipo, per giorno/orario
- **Preferiti**: salvataggio per utente, persistente — Supabase Auth + tabella favorites
- **Dark/Light mode**: toggle accessibile, preferenza salvata in localStorage
- **Dati statici**: JSON file nel repo, compilato da fuorisalone.it

### SHOULD HAVE (Fase 1 se il tempo lo permette)
- Indicatore "aperto adesso" basato sull'orario corrente del dispositivo
- Ricerca testuale per nome installazione o brand
- Contatore tappe completate nell'itinerario

### COULD HAVE (Fase 2)
- Scraping automatico via N8N → aggiornamento dati Supabase
- Sostituzione JSON statico con Supabase come unica fonte dati
- PWA con supporto offline e tile mappa cachate
- Notifiche push per aggiornamenti last-minute

### WON'T HAVE (fuori scope)
- Social features o condivisione percorsi tra utenti
- Contenuti generati da AI a runtime
- Integrazione con ticketing o prenotazioni

---

## 4. Architettura Tecnica

### Stack
- **Framework**: React + Vite
- **Mappa**: Leaflet.js (open source, zero costi API)
- **Auth + DB**: Supabase (progetto dedicato, separato da altri progetti JSD)
- **Dati installazioni**: JSON statico nel repo (`/src/data/events.json`)
- **Styling**: Tailwind CSS
- **Deploy**: Vercel — free tier, deploy automatico da Git

### Supabase — Setup
Creare un **nuovo progetto Supabase dedicato** chiamato `fuorisalone-experience`.
Non riutilizzare progetti esistenti JSD.

Recuperare da **Settings → API**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Tabella da creare:
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

### Struttura dati — `events.json`
```json
{
  "id": "uuid",
  "name": "Nome installazione",
  "brand": "Brand o studio",
  "zone": "Tortona",
  "type": "installazione | mostra | brand_experience | evento",
  "address": "Via Tortona 27, Milano",
  "lat": 45.4572,
  "lng": 9.1627,
  "description": "Descrizione breve (max 200 caratteri)",
  "image": "/images/installazione.jpg",
  "hours": {
    "lun": "10:00-20:00",
    "mar": "10:00-20:00",
    "mer": "10:00-20:00",
    "gio": "10:00-20:00",
    "ven": "10:00-22:00",
    "sab": "10:00-22:00",
    "dom": "10:00-15:00"
  },
  "itinerary_order": 3,
  "highlight": true
}
```

### Configurazione centralizzata — `app.config.js`
Creare `/src/config/app.config.js`:
```js
export const APP_CONFIG = {
  name: "Fuori Salone Experience",
  city: "Milano",
  dateRange: { start: "2025-04-07", end: "2025-04-13" },
  centerMap: { lat: 45.4654, lng: 9.1859 },
  zoomDefault: 13,
  colors: {
    cyan: "#0080C9",
    fucsia: "#FF006E",
  },
  zones: ["Tortona", "Brera", "Porta Venezia", "Isola", "5Vie", "Università Statale", "Castello Sforzesco"],
  types: ["installazione", "mostra", "brand_experience", "evento"],
}
```
**Cambiando solo questo file e il JSON dei dati, l'app diventa un evento completamente diverso.**

---

## 5. Design System

### Filosofia
Design sobrio, professionale, leggibile. Neutro e replicabile — non brandizzato JSD in modo esplicito. Due modalità: dark e light, selezionabili dall'utente con toggle. Gli accenti cyan e fucsia hanno significati semantici precisi e coerenti in tutta l'app.

### Semantica dei colori
| Colore | Uso |
|--------|-----|
| **Cyan `#0080C9`** | Navigazione, azioni primarie, badge zona, CTA principali, elementi informativi |
| **Fucsia `#FF006E`** | Highlight editoriali, preferiti, badge "da non perdere", accenti emotivi |

### Palette Dark Mode
| Token | Valore |
|-------|--------|
| Background | `#0A0A0A` |
| Surface | `#141414` |
| Border | `#222222` |
| Text primary | `#FFFFFF` |
| Text secondary | `#888888` |

### Palette Light Mode
| Token | Valore |
|-------|--------|
| Background | `#F5F5F5` |
| Surface | `#FFFFFF` |
| Border | `#E0E0E0` |
| Text primary | `#0A0A0A` |
| Text secondary | `#666666` |

### Tipografia — Montserrat
Font unico: **Montserrat** (Google Fonts). Nessun font display o decorativo.

| Uso | Peso | Dimensione |
|-----|------|------------|
| Titolo principale | 700 | 24px |
| Titolo sezione | 600 | 18px |
| Label/Badge | 600 | 12px |
| Body | 400 | 14px |
| Caption | 400 | 12px |

### Componenti chiave
- **Pin mappa**: cerchio filled — cyan per standard, fucsia per highlight
- **Card installazione**: surface color, bordo sottile, foto 16:9, badge zona (cyan outline) + badge tipo (fucsia filled se highlight)
- **Bottom sheet**: apre dal basso su mobile, drag handle, surface color
- **Toggle dark/light**: icona luna/sole, in alto a destra nella header
- **Tab bar**: 4 tab, icone minimal, active state cyan
- **Badge**: pill shape — outline per zona, filled per tipo

---

## 6. UX e Flussi Principali

### Navigazione — Bottom Tab Bar
- 🗺 **Mappa** — vista principale con pin
- 📋 **Lista** — tutte le installazioni con filtri
- 🧭 **Itinerario** — percorso suggerito ordinato
- ❤️ **Preferiti** — installazioni salvate (richiede login)

### Flusso principale
1. Apertura app → mappa con tutti i pin
2. Tap su pin o card → bottom sheet con dettaglio installazione
3. Dal dettaglio → "Naviga" apre Google Maps / cuore salva nei preferiti
4. Tab Itinerario → lista tappe ordinate + mappa del percorso completo
5. Filtri → aggiornano mappa e lista in tempo reale

### Dettaglio installazione (bottom sheet)
- Foto hero full-width
- Nome + brand
- Badge zona (cyan) + badge tipo
- Orari — giorno corrente evidenziato + indicatore aperto/chiuso
- Descrizione breve
- CTA primario: **"Naviga"** → apre Google Maps con indirizzo precompilato
- CTA secondario: **icona cuore** → salva/rimuovi dai preferiti

### Autenticazione
Login con email + magic link (Supabase Auth). Nessuna password. I preferiti sono visibili solo dopo login — tutto il resto dell'app funziona senza account.

---

## 7. Dati Iniziali — Installazioni

Obiettivo: **30-40 installazioni** compilate manualmente da fuorisalone.it

Zone e installazioni prioritarie:
1. **Tortona** — Superstudio Più (Via Tortona 27)
2. **Università Statale** — Amazon The Amazing Plaza, Lavazza, Interni Cre-Action
3. **Porta Venezia** — Google Light Installation, TOILETPAPER, Marc-Antoine Barrois
4. **Isola** — Kerastase serra (BAM), installazioni selezionate
5. **Brera** — Piazza Gae Aulenti, Brera Design Apartment
6. **Castello Sforzesco** — Robert Wilson light installation
7. **5Vie** — installazioni selezionate
8. **Corso Como / Porta Nuova** — installazioni urbane esterne (es. sculture, piovra)

---

## 8. Itinerario Suggerito

Percorso geograficamente ottimizzato — riduce gli spostamenti, raggruppa zone vicine.

| Orario | Zona | Note |
|--------|------|------|
| Mattina | Castello Sforzesco → Brera → 5Vie | Zona centro-nord |
| Pranzo | Università Statale | Pausa naturale in zona |
| Pomeriggio | Porta Venezia → Isola | Zona est |
| Sera | Tortona → Navigli | Zona ovest, aperture serali |

L'ordine va inserito nel campo `itinerary_order` del JSON per ogni installazione.

---

## 9. Deploy

### Fase 1
- **Piattaforma**: Vercel (free tier)
- **URL**: `fuorisalone-experience.vercel.app`
- **Deploy**: automatico da branch `main` su GitHub
- **Variabili d'ambiente su Vercel**:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### Fase 2
- Collegare dominio custom (verificare: `fuorisaloneexperience.it`, `milanoexperience.app`, `fsexperience.it`, `experiencemilano.it`)
- Nessuna modifica al codice necessaria per il cambio dominio

---

## 10. Roadmap

### Fase 1 — MVP (oggi)
App funzionante con tutti i MUST HAVE. Tempo stimato: 4-6 ore con Claude Code.

### Fase 2 — Automazione dati
- N8N workflow: scraping fuorisalone.it → aggiornamento Supabase
- Sostituzione JSON statico con Supabase come fonte dati principale
- PWA e supporto offline base

### Fase 3 — Template Event Experience
- Refactoring per massima replicabilità documentata
- Documentazione per adattamento a nuovi eventi
- Case study JSD completo

---

## 11. Note Tecniche per Claude Code

- Separare **sempre** il layer dati dalla logica UI. Tutti i dati arrivano da `events.json` tramite hook dedicato `useInstallations()`. In Fase 2 si modifica solo l'hook, non i componenti.
- Usare `APP_CONFIG` per qualsiasi valore configurabile — mai hardcodare colori, testi o coordinate nel codice.
- **Mobile-first**: layout pensato per viewport 390px (iPhone 14). Desktop secondario.
- Dark/Light mode via CSS custom properties su `:root`. Toggle salva preferenza in `localStorage`.
- Leaflet richiede import CSS separato — non dimenticare `import 'leaflet/dist/leaflet.css'`.
- Usare `react-leaflet`. Applicare il fix noto per le icone default di Leaflet su Vite/Webpack.
- Supabase client inizializzato in `/src/lib/supabase.js` con variabili d'ambiente Vite (`VITE_`).
- Commentare le sezioni da sostituire in Fase 2 con `// TODO FASE 2: sostituire con chiamata Supabase`.

---

*Documento creato da JackSpike Design — Aprile 2026*
*Template: Event Experience App v1.0*
