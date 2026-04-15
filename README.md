<div align="center">

<img src="public/favicon.svg" width="80" alt="H3X Ticketing Logo" />

# H3X Ticketing System

**Ein modernes, vollständiges Support-Ticketing-System – gebaut mit React, TypeScript und Tailwind CSS v4.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-5-brown?style=flat-square)](https://zustand-demo.pmnd.rs)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## Übersicht

H3X Ticketing ist eine vollständige Frontend-Anwendung zur Verwaltung von Support-Tickets. Mit einem übersichtlichen Dashboard, mächtigen Filtern, Kommentarfunktion und Dark Mode eignet es sich als Grundlage für jede Support- oder Issue-Tracking-Lösung.

---

## Features

### Dashboard
- Live-Statistiken (Gesamt, Offen, In Bearbeitung, Gelöst)
- Kritische-Ticket-Warnung mit direktem Navigationslink
- Status- & Prioritätsverteilung mit Fortschrittsbalken
- Team-Auslastungsübersicht pro Agent
- Zuletzt aktualisierte Tickets auf einen Blick

### Tickets
- **Erstellen** – Titel, Beschreibung, Priorität, Kategorie, Zuweisung, Tags
- **Bearbeiten** – alle Felder inline editierbar
- **Detail-Ansicht** – vollständige Informationen, Status-Workflow, schnelle Zuweisung
- **Löschen** – mit Bestätigungsdialog
- **Volltext-Suche** – durchsucht Titel, Beschreibung, Tags und ID

### Filter & Navigation
- Filter nach Status, Priorität, Kategorie, Mitarbeiter
- Aktive Filter als entfernbare Chips angezeigt
- Sidebar-Schnellfilter: Offen · Kritisch · Nicht zugewiesen
- URL-basierte Filter (direkter Deeplink möglich)

### Kommentare
- Kommentare hinzufügen & löschen
- **Interne Notizen** – nur für Agents & Admins sichtbar markierbar
- Relative Zeitanzeige (z. B. „vor 3 Stunden")

### UX & Design
- Vollständiger **Dark Mode** (automatisch & manuell umschaltbar)
- Responsive Layout für Desktop, Tablet und Mobile
- Animierte Seitenübergänge
- Lokale Persistenz via `localStorage` – Daten bleiben nach Reload erhalten

### Rollen
| Rolle | Rechte |
|---|---|
| `admin` | Alle Aktionen, interne Notizen, Löschen |
| `agent` | Tickets bearbeiten, Status ändern, interne Notizen |
| `user` | Tickets erstellen & kommentieren |

---

## Tech Stack

| Technologie | Version | Zweck |
|---|---|---|
| [React](https://react.dev) | 19 | UI Framework |
| [TypeScript](https://www.typescriptlang.org) | 5.9 | Typsicherheit |
| [Vite](https://vite.dev) | 7 | Build Tool & Dev Server |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Styling |
| [Zustand](https://github.com/pmndrs/zustand) | 5 | State Management |
| [React Router](https://reactrouter.com) | 7 | Routing |
| [Lucide React](https://lucide.dev) | – | Icons |
| [date-fns](https://date-fns.org) | 4 | Datumsformatierung |
| [uuid](https://github.com/uuidjs/uuid) | – | ID-Generierung |

---

## Schnellstart

### Voraussetzungen

- [Node.js](https://nodejs.org) **≥ 18**
- npm **≥ 9**

### Installation

```bash
# Repository klonen
git clone https://github.com/dein-user/h3x-ticketing.git
cd h3x-ticketing

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter **http://localhost:5173** erreichbar.

---

## Scripts

| Befehl | Beschreibung |
|---|---|
| `npm run dev` | Startet den Vite-Entwicklungsserver |
| `npm run build` | Erstellt den Produktions-Build in `/dist` |
| `npm run preview` | Vorschau des Production-Builds |
| `npm run clean` | Löscht `dist` und `node_modules` |

---

## Projektstruktur

```
h3x-ticketing/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx       # Haupt-Layout mit Sidebar
│   │   │   ├── Sidebar.tsx      # Navigation & Schnellfilter
│   │   │   └── Header.tsx       # Suche, Dark Mode, Nutzerinfo
│   │   └── tickets/
│   │       ├── TicketCard.tsx   # Ticket-Karte für Listenansicht
│   │       └── TicketForm.tsx   # Wiederverwendbares Formular
│   ├── lib/
│   │   ├── utils.ts             # Helper, Labels, Farben
│   │   └── demo-data.ts         # Beispieldaten
│   ├── pages/
│   │   ├── Dashboard.tsx        # Übersichts-Dashboard
│   │   ├── TicketList.tsx       # Ticket-Liste mit Filtern
│   │   ├── TicketDetail.tsx     # Ticket-Detail & Kommentare
│   │   ├── CreateTicket.tsx     # Ticket erstellen
│   │   └── EditTicket.tsx       # Ticket bearbeiten
│   ├── store/
│   │   └── useStore.ts          # Zustand Store (global state)
│   ├── types/
│   │   └── index.ts             # TypeScript Typen
│   ├── App.tsx                  # Router-Konfiguration
│   ├── main.tsx                 # Entry Point
│   └── index.css                # Globale Styles & Tailwind
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Ticket-Workflow

```
open  ──►  in_progress  ──►  resolved  ──►  closed
  ▲              │                              │
  └──────────────┴──────────────────────────────┘
```

Alle Statusübergänge sind über den Status-Button in der Ticket-Detailansicht steuerbar.

---

## Demo-Daten

Beim ersten Start sind 8 vorgefertigte Tickets und 5 Testnutzer geladen:

- **Max Mustermann** – Admin
- **Anna Schmidt** – Agent
- **Tobias Müller** – Agent
- **Laura Weber** – User
- **Klaus Fischer** – User

Die Daten werden in `localStorage` gespeichert und bleiben nach Reload erhalten. Zum Zurücksetzen einfach `localStorage` im Browser leeren.

---

## License

[MIT](LICENSE) © 2026 H3XX1TT
