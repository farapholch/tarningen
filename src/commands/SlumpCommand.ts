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
        const subcommand = firstArg ? firstArg.toLowerCase() : "tarning";

        let message: string;

        switch (subcommand) {
            case "tarning":
            case "dice":
            case "d6":
                const roll = DiceRoller.rollD6();
                message = ":game_die: " + sender.username + " slog en **" + roll + "**!";
                break;

            case "krona":
            case "coin":
            case "mynt":
                const flip = DiceRoller.flipCoin();
                const flipResult = flip === "heads" ? "Krona" : "Klave";
                message = ":coin: " + sender.username + ": **" + flipResult + "**!";
                break;

            case "person":
            case "user":
            case "medlem":
                const members = await read.getRoomReader().getMembers(room.id);
                const picked = DiceRoller.pickRandom(members);
                if (picked) {
                    message = ":bust_in_silhouette: **@" + picked.username + "** valdes slumpmassigt av " + sender.username + "!";
                } else {
                    message = ":x: Kunde inte hitta nagra medlemmar i kanalen.";
                }
                break;

            case "hjalp":
            case "help":
                message = "**:game_die: Tarningen - Hjalp**\n\n" +
                    "*/slump tarning* - Sla en D6 tarning\n" +
                    "*/slump krona* - Singla slant (krona/klave)\n" +
                    "*/slump person* - Valj en slumpmassig person i kanalen";
                break;

            default:
                message = ":question: Okant kommando: \"" + subcommand + "\". Skriv */slump hjalp* for att se tillgangliga kommandon.";
        }

        await this.sendMessage(room, message, sender, modify);
    }

    private async sendMessage(
        room: IRoom,
        text: string,
        sender: IUser,
        modify: IModify
    ): Promise<void> {
        const messageBuilder = modify.getCreator().startMessage()
            .setRoom(room)
            .setText(text);

        await modify.getCreator().finish(messageBuilder);
    }
}
