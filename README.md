# 🎲 Tärningen

En Rocket.Chat-app med slumpfunktioner för Snacka.

**Av Team Våffla**

## Funktioner

| Kommando | Beskrivning |
|----------|-------------|
| `/slump tarning` | Slå en D6-tärning |
| `/slump krona` | Singla slant (krona/klave) |
| `/slump person` | Välj slumpmässig person i kanalen |
| `/slump hjalp` | Visa hjälptext |

## Installation

1. Bygg appen:
   ```bash
   npm install
   rc-apps package
   ```

2. Ladda upp `dist/tarningen_x.x.x.zip` via:
   - Admin → Marketplace → Private Apps → Upload App

3. Aktivera appen

## Utveckling

```bash
# Installera dependencies
npm install

# Bygg paketet
rc-apps package
```

## Licens

MIT
