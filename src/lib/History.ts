import {
    IPersistence,
    IPersistenceRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { RocketChatAssociationModel, RocketChatAssociationRecord } from "@rocket.chat/apps-engine/definition/metadata";

export interface HistoryEntry {
    type: "dice" | "coin" | "person";
    result: string;
    user: string;
    timestamp: Date;
}

export class History {
    private static readonly MAX_ENTRIES = 5;

    public static async addEntry(
        persistence: IPersistence,
        roomId: string,
        entry: HistoryEntry
    ): Promise<void> {
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.ROOM,
            "history_" + roomId
        );

        const entries = await this.getHistory(persistence as unknown as IPersistenceRead, roomId);
        entries.unshift(entry);
        
        if (entries.length > this.MAX_ENTRIES) {
            entries.pop();
        }

        await persistence.updateByAssociation(association, { entries }, true);
    }

    public static async getHistory(
        persistenceRead: IPersistenceRead,
        roomId: string
    ): Promise<HistoryEntry[]> {
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.ROOM,
            "history_" + roomId
        );

        const records = await persistenceRead.readByAssociation(association);
        
        if (records.length === 0) {
            return [];
        }
        
        const firstRecord = records[0];
        if (!firstRecord) {
            return [];
        }

        const data = firstRecord as { entries: HistoryEntry[] };
        return data.entries || [];
    }
}
