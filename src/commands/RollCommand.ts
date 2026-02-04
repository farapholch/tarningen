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
        const args = context.getArguments();
        const room = context.getRoom();
        const sender = context.getSender();
        const firstArg = args[0];
        const subcommand = firstArg ? firstArg.toLowerCase() : "d6";

        let message: string;

        switch (subcommand) {
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
                const flip = DiceRoller.flipCoin();
                const flipResult = flip === "heads" ? "Krona" : "Klave";
                message = "🪙 " + sender.username + ": **" + flipResult + "**!";
                break;

            case "person":
            case "user":
            case "someone":
                const members = await read.getRoomReader().getMembers(room.id);
                const picked = DiceRoller.pickRandom(members);
                if (picked) {
                    message = "👤 **@" + picked.username + "** valdes slumpmässigt av " + sender.username + "!";
                } else {
                    message = "❌ Kunde inte hitta några medlemmar i kanalen.";
                }
                break;

            case "help":
            case "hjälp":
            case "hjalp":
                message = "**🎲 Roll - Hjälp**\n\n" +
                    "*/roll* eller */roll d6* - Slå en D6-tärning\n" +
                    "*/roll coin* - Singla slant\n" +
                    "*/roll person* - Välj slumpmässig person i kanalen";
                break;

            default:
                const defaultRoll = DiceRoller.rollD6();
                message = "🎲 " + sender.name + " slog en **" + defaultRoll + "**!";
        }

        await this.sendMessage(room, message, modify);
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
