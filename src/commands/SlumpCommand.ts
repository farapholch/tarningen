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

            case "hjälp":
            case "hjalp":
            case "help":
                message = "**🎲 Tärningen - Hjälp**\n\n" +
                    "*/slump tärning* - Slå en D6-tärning\n" +
                    "*/slump krona* - Singla slant (krona/klave)\n" +
                    "*/slump person* - Välj en slumpmässig person i kanalen";
                break;

            default:
                message = "❓ Okänt kommando: \"" + subcommand + "\". Skriv */slump hjälp* för att se tillgängliga kommandon.";
        }

        // Skicka meddelande som användarens eget konto
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
}
