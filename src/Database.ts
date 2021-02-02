import  * as bsqlite3 from 'better-sqlite3';
import { Snowflake } from "discord.js";

export interface Balance {
    userID: Snowflake,
    serverID: Snowflake,
    cash: number,
    bank: number,
}

export default class DatabaseHelper {
    private _db: bsqlite3.Database;

    private static getBalStatement: bsqlite3.Statement;
    private static getAllServerBalsStatement: bsqlite3.Statement;
    private static getAllUserBalsStatement: bsqlite3.Statement;

    private static setBalStatement: bsqlite3.Statement;

    constructor(filePath: string) {
        this._db = new bsqlite3(filePath);
        this._db.exec(`
            CREATE TABLE IF NOT EXISTS balance (
                userID TEXT NOT NULL,
                serverID TEXT NOT NULL,
                cash INT NOT NULL,
                bank INT NOT NULL,
                UNIQUE(userID, serverID)
            );
        `)

        if (!DatabaseHelper.getBalStatement)
            DatabaseHelper.getBalStatement = this._db.prepare('SELECT cash, bank FROM balance WHERE userID=? AND serverID=?');

        if (!DatabaseHelper.getAllUserBalsStatement)
            DatabaseHelper.getAllUserBalsStatement = this._db.prepare('SELECT userID, serverID, cash, bank FROM balance WHERE userID=?');

        if (!DatabaseHelper.getAllServerBalsStatement)
            DatabaseHelper.getAllServerBalsStatement = this._db.prepare('SELECT userID, serverID, cash, bank FROM balance WHERE serverID=?');

        if (!DatabaseHelper.setBalStatement)
            DatabaseHelper.setBalStatement = this._db.prepare('INSERT INTO balance (userID, serverID, cash, bank) VALUES (@userID, @serverID, @cash, @bank) ON CONFLICT(userID, serverID) DO UPDATE SET cash=@cash, bank=@bank');
    }

    getBal(userID: Snowflake, serverID: Snowflake): Balance {
        const data = DatabaseHelper.getBalStatement.get(userID, serverID);
        if (!data) return data;
        return {
            userID: userID,
            serverID: serverID,
            cash: data.cash,
            bank: data.bank
        }
    }

    getAllUserBalances(userID:Snowflake): Balance[] {
        return DatabaseHelper.getAllUserBalsStatement.all(userID);
    }

    getAllServerBalances(serverID: Snowflake): Balance[] {
        return DatabaseHelper.getAllServerBalsStatement.all(serverID);
    }

    setBal(bal: Balance): void {
        DatabaseHelper.setBalStatement.run(bal);
    }
}