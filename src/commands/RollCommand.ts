import {
    IRead,
    IModify,
    IHttp,
    IPersistence,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { TarningenApp } from "../TarningenApp";
import { DiceRoller } from "../lib/DiceRoller";
import { AVATAR_BASE64 } from "../lib/Avatar";

export class RollCommand implements ISlashCommand {
    public command = "roll";
    public i18nParamsExample = "roll_params";
    public i18nDescription = "roll_description";
    public providesPreview = false;

    private app: TarningenApp;

    constructor(app: TarningenApp) {
        this.app = app;
    }

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<void> {
        const sender = context.getSender();
        const room = context.getRoom();
        const args = context.getArguments();
        const subcommand = args[0]?.toLowerCase() || "tarning";

        let message = "";

        // Kolla om det är ett intervall (t.ex. "1-10" eller "1-100")
        const rangeMatch = subcommand.match(/^(\d+)-(\d+)$/);
        if (rangeMatch) {
            const min = parseInt(rangeMatch[1], 10);
            const max = parseInt(rangeMatch[2], 10);

            if (min >= max) {
                message = "❌ Ogiltigt intervall! Första talet måste vara mindre än det andra.";
            } else if (min < 0 || max > 1000000) {
                message = "❌ Intervallet måste vara mellan 0 och 1000000.";
            } else {
                const result = DiceRoller.rollRange(min, max);
                message = "🎯 " + sender.name + " slumpade **" + result + "** (" + min + "-" + max + ")";
            }
            await this.sendMessageWithThread(context, room, sender, message, modify);
            return;
        }

        switch (subcommand) {
            case "help":
            case "hjälp":
            case "hjalp":
                message = `**Tärningen - Hjälp**\n\n` +
                    `**Kommandon:**\n` +
                    `• \`/roll\` eller \`/roll tarning\` - Slå en tärning (1-6)\n` +
                    `• \`/roll krona\` eller \`/roll flip\` - Singla mynt (Krona/Klave)\n` +
                    `• \`/roll person\` - Välj slumpmässig person i kanalen\n` +
                    `• \`/roll 1-10\` - Slumpa ett tal mellan 1 och 10\n` +
                    `• \`/roll 1-100\` - Slumpa ett tal mellan 1 och 100\n` +
                    `• \`/roll help\` - Visa denna hjälp`;
                break;

            case "d6":
            case "dice":
            case "tärning":
            case "tarning":
                const roll = DiceRoller.rollD6();
                message = "🎲 " + sender.name + " slog en **" + roll + "**!";
                break;

            case "coin":
            case "flip":
            case "krona":
            case "klave":
                const flip = DiceRoller.flipCoin();
                const flipResult = flip === "heads" ? "Krona" : "Klave";
                message = "🪙 " + sender.name + " singlade ett mynt och fick **" + flipResult + "**!";
                break;

            case "person":
            case "user":
            case "someone":
                const members = await read.getRoomReader().getMembers(room.id);
                const picked = DiceRoller.pickRandom(members);
                if (picked) {
                    // Använd @username för att skapa mention
                    message = "👤 **@" + picked.username + "** valdes slumpmässigt av " + sender.name + "!";
                } else {
                    message = "❌ Kunde inte hitta några medlemmar i kanalen.";
                }
                break;

            default:
                const defaultRoll = DiceRoller.rollD6();
                message = "🎲 " + sender.name + " slog en **" + defaultRoll + "**!";
        }

        await this.sendMessageWithThread(context, room, sender, message, modify);
    }

    private async sendMessageWithThread(
        context: SlashCommandContext,
        room: IRoom,
        sender: IUser,
        text: string,
        modify: IModify
    ): Promise<void> {
        const builder = modify.getCreator().startMessage()
            .setSender(sender)
            .setRoom(room)
            .setText(text);

        const threadId = context.getThreadId();
        if (threadId) {
            builder.setThreadId(threadId);
        }

        await modify.getCreator().finish(builder);
    }

    private async sendMessage(
        room: IRoom,
        text: string,
        modify: IModify
    ): Promise<void> {
        const messageBuilder = modify.getCreator().startMessage()
            .setRoom(room)
            .setText(text)
            .setUsernameAlias("Tärningen")
            .setAvatarUrl(AVATAR_BASE64);

        await modify.getCreator().finish(messageBuilder);
    }
}
