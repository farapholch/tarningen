# <img src="icon.png" width="32" alt="icon"> Tärningen

En Rocket.Chat-app med slumpfunktioner för Snacka.

**Av Team Våffla** | **Version 1.2.0**

## Kommandon

### /slump (Svenska)

| Kommando | Beskrivning |
|----------|-------------|
| `/slump tärning` | Slå en D6-tärning |
| `/slump krona` | Singla slant (krona/klave) |
| `/slump person` | Välj slumpmässig person i kanalen |
| `/slump hjälp` | Visa hjälptext |

### /roll (English)

| Command | Description |
|---------|-------------|
| `/roll` or `/roll d6` | Roll a D6 dice |
| `/roll coin` | Flip a coin |
| `/roll person` | Pick random person in channel |
| `/roll help` | Show help |

## Features

- 🎲 Tärning (D6) och myntkastning
- 👤 Slumpa person i kanalen
- 🇸🇪 Stöd för svenska tecken (å, ä, ö)
- 🔒 Minimala permissions
- 🎨 Mörkröd tärningsikon som avatar

## Installation

1. Ladda ner `tarningen_1.2.0.zip` från [Releases](https://github.com/farapholch/tarningen/releases)

2. I Rocket.Chat: **Admin → Marketplace → Private Apps → Upload App**

3. Aktivera appen

## Permissions

Appen begär endast minimala rättigheter:
- `slashcommand` - Registrera /slump och /roll
- `room.read` - Läsa rumsmedlemmar
- `message.write` - Skicka meddelanden

## Utveckling

```bash
# Installera dependencies
npm install

# Bygg paketet
rc-apps package
```

## Licens

MIT

---

*Icon från [IconsDB](https://www.iconsdb.com) (CC BY-ND 3.0)*
