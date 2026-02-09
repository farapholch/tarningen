# <img src="icon.png" width="32" alt="icon"> Tärningen

En Rocket.Chat-app med slumpfunktioner för Snacka.

**Av Team Våffla** | **Version 3.2.0**

## Kommandon

### /slump (Svenska)

| Kommando | Beskrivning |
|----------|-------------|
| `/slump tärning` | Slå en D6-tärning |
| `/slump krona` | Singla slant (krona/klave) |
| `/slump person` | Välj slumpmässig person i kanalen |
| `/slump 1-10` | Slumpa ett tal mellan 1 och 10 |
| `/slump 1-100` | Slumpa ett tal mellan 1 och 100 |
| `/slump hjälp` | Visa hjälptext |

### /roll (English)

| Command | Description |
|---------|-------------|
| `/roll` or `/roll d6` | Roll a D6 dice |
| `/roll coin` | Flip a coin |
| `/roll person` | Pick random person in channel |
| `/roll 1-10` | Random number between 1 and 10 |
| `/roll 1-100` | Random number between 1 and 100 |
| `/roll help` | Show help |

### Valfritt intervall

Du kan använda vilket intervall som helst mellan 0 och 1000000:

```
/slump 1-6      → Samma som en tärning
/slump 1-52     → Slumpa ett kort i en kortlek
/slump 0-99     → Slumpa 0-99
/roll 1-1000    → Slumpa 1-1000
```

## Features

- 🎲 Tärning (D6) och myntkastning
- 🎯 Valfritt intervall (t.ex. 1-100)
- 👤 Slumpa person i kanalen (med @mention)
- 🧵 Trådstöd - svarar i samma tråd
- 🇸🇪 Stöd för svenska tecken (å, ä, ö)
- 🔒 Minimala permissions
- 🎨 Mörkröd tärningsikon som avatar

## Installation

1. Ladda ner `tarningen_3.2.0.zip` från [Releases](https://github.com/farapholch/tarningen/releases)

2. I Rocket.Chat: **Admin → Apps → ⋮ → Private Apps → Upload App**

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
