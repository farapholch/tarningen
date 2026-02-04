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
        const subcommand = args[0]?.toLowerCase();

        let message = "";

        switch (subcommand) {
            case "help":
            case "hjälp":
            case "hjalp":
                message = `**Tärningen - Hjälp**\n\n` +
                    `**Kommandon:**\n` +
                    `• \`/roll\` eller \`/roll tarning\` - Slå en tärning (1-6)\n` +
                    `• \`/roll krona\` eller \`/roll flip\` - Singla mynt (Krona/Klave)\n` +
                    `• \`/roll person\` - Välj slumpmässig person i kanalen\n` +
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
                    message = "👤 **" + picked.name + "** valdes slumpmässigt av " + sender.name + "!";
                    
                    const builder = modify.getCreator().startMessage()
                        .setSender(sender)
                        .setRoom(room)
                        .setText(message);
                    
                    // Lägg till mention så personen notifieras
                    const mentions = builder.getMentionedUsers();
                    mentions.push(picked);
                    
                    const threadId = context.getThreadId();
                    if (threadId) {
                        builder.setThreadId(threadId);
                    }
                    
                    await modify.getCreator().finish(builder);
                    return; // Avsluta tidigt eftersom vi redan skickat meddelandet
                } else {
                    message = "❌ Kunde inte hitta några medlemmar i kanalen.";
                }
                break;

            default:
                const defaultRoll = DiceRoller.rollD6();
                message = "🎲 " + sender.name + " slog en **" + defaultRoll + "**!";
        }

        const builder = modify.getCreator().startMessage()
            .setSender(sender)
            .setRoom(room)
            .setText(message);

        // Om kommandot kördes i en tråd, svara i samma tråd
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
