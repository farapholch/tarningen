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

export class SlumpCommand implements ISlashCommand {
    public command = "slump";
    public i18nParamsExample = "slump_params";
    public i18nDescription = "slump_description";
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
        const args = context.getArguments();
        const room = context.getRoom();
        const sender = context.getSender();
        const firstArg = args[0];
        const subcommand = firstArg ? firstArg.toLowerCase() : "tärning";

        let message: string;

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
            case "tärning":
            case "tarning":
            case "dice":
            case "d6":
                const roll = DiceRoller.rollD6();
                message = "🎲 " + sender.name + " slog en **" + roll + "**!";
                break;

            case "krona":
            case "coin":
            case "mynt":
                const flip = DiceRoller.flipCoin();
                const flipResult = flip === "heads" ? "Krona" : "Klave";
                message = "🪙 " + sender.name + " singlade ett mynt och fick **" + flipResult + "**!";
                break;

            case "person":
            case "user":
            case "medlem":
                const members = await read.getRoomReader().getMembers(room.id);
                const picked = DiceRoller.pickRandom(members);
                if (picked) {
                    // Använd @username för att skapa mention
                    message = "👤 **@" + picked.username + "** valdes slumpmässigt av " + sender.name + "!";
                } else {
                    message = "❌ Kunde inte hitta några medlemmar i kanalen.";
                }
                break;

            case "hjälp":
            case "hjalp":
            case "help":
                message = "**🎲 Tärningen - Hjälp**\n\n" +
                    "*/slump tärning* - Slå en D6-tärning\n" +
                    "*/slump krona* - Singla slant (krona/klave)\n" +
                    "*/slump person* - Välj en slumpmässig person i kanalen\n" +
                    "*/slump 1-10* - Slumpa ett tal mellan 1 och 10\n" +
                    "*/slump 1-100* - Slumpa ett tal mellan 1 och 100";
                break;

            default:
                message = "❓ Okänt kommando: \"" + subcommand + "\". Skriv */slump hjälp* för att se tillgängliga kommandon.";
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
}
