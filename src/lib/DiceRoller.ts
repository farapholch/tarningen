export class DiceRoller {
    public static rollD6(): number {
        return Math.floor(Math.random() * 6) + 1;
    }

    public static flipCoin(): "heads" | "tails" {
        return Math.random() < 0.5 ? "heads" : "tails";
    }

    public static pickRandom<T>(items: T[]): T | undefined {
        if (items.length === 0) return undefined;
        const index = Math.floor(Math.random() * items.length);
        return items[index];
    }
}
