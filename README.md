# <img src="icon.png" width="32" alt="icon"> Tärningen

A Rocket.Chat app with random functions.

**By Team Våffla** | **Version 3.2.4**

## Commands

### /slump (Swedish)

| Command | Description |
|---------|-------------|
| `/slump tärning` | Roll a D6 dice |
| `/slump krona` | Flip a coin (heads/tails) |
| `/slump person` | Pick random person in channel |
| `/slump 1-10` | Random number between 1 and 10 |
| `/slump 1-100` | Random number between 1 and 100 |
| `/slump hjälp` | Show help |

### /roll (English)

| Command | Description |
|---------|-------------|
| `/roll` or `/roll d6` | Roll a D6 dice |
| `/roll coin` | Flip a coin |
| `/roll person` | Pick random person in channel |
| `/roll 1-10` | Random number between 1 and 10 |
| `/roll 1-100` | Random number between 1 and 100 |
| `/roll help` | Show help |

### Custom Range

You can use any range between 0 and 1000000:

```
/slump 1-6      → Same as a dice
/slump 1-52     → Random card in a deck
/slump 0-99     → Random 0-99
/roll 1-1000    → Random 1-1000
```

## Features

- 🎲 Dice (D6) and coin flip
- 🎯 Custom range (e.g. 1-100)
- 👤 Random person in channel (with @mention)
- 🧵 Thread support - replies in the same thread
- 🇸🇪 Swedish character support (å, ä, ö)
- 🔒 Minimal permissions
- 🎨 Dark red dice icon as avatar

## Installation

1. Download `tarningen_3.2.4.zip` from [Releases](https://github.com/farapholch/tarningen/releases)

2. In Rocket.Chat: **Admin → Apps → ⋮ → Private Apps → Upload App**

3. Enable the app

## Permissions

The app only requests minimal permissions:
- `slashcommand` - Register /slump and /roll commands
- `room.read` - Read room members
- `message.write` - Send messages

## Development

```bash
# Install dependencies
npm install

# Build package
rc-apps package
```

## License

MIT

---

*Icon from [IconsDB](https://www.iconsdb.com) (CC BY-ND 3.0)*
