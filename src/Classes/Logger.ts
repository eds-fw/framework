import { accessSync, appendFileSync, mkdirSync } from "fs";

/**
 * Writes the specified text to .log files. Keeps count of the number of messages.
 */
export class Logger
{
    private path: string = "";
    private date: string;
    public msg_count: number = 0;

    public template = (message: string, level: string = 'U') => `\n[${this._time()}] [${level}] (${this.msg_count + 1}) ${message}`;

    private _format(num: number): string
    {
        return (num >= 10 ? num : '0' + num).toString();
    }

    private _today(): string
    {
        const date = new Date();
        return `${date.getFullYear()}-${this._format(date.getMonth() + 1)}-${this._format(date.getDate())}`;
    }

    private _time(): string
    {
        const date = new Date();
        return `${this._format(date.getHours())}:${this._format(date.getMinutes())}:${this._format(date.getSeconds())}`;
    }

    private _createFile(date: string): void
    {
        appendFileSync(this.dirpath + `/${date}.log`, '');
    }

    private _counterReport(): void
    {
        try {
            appendFileSync(this.path, `\n\nEnd of log file. Total messages: ${this.msg_count}`);
        } catch (err) {
            throw new Error(`Logger.log: Failed to append counter report to log file\n\t${err}`);
        }
    }

    public constructor(private dirpath = "./logs", private time_offset: number = 1_000)
    {
        try {
            accessSync(this.dirpath);
        } catch (err) {
            mkdirSync(this.dirpath);
        }

        let date = this._today();
        try {
            accessSync(`/${date}.log`);
        } catch (err) {
            this._createFile(date);
        }
        this.path = this.dirpath + `/${date}.log`;
        this.date = this._today();
    }

    public log(message: string, level?: 'I' | 'II' | 'III'): void
    {
        //load displacement
        setTimeout(() => {
            if (this._today() !== this.date)
            {
                this.path = this.dirpath + `/${this._today()}.log`;
                this._createFile(this._today());
                this._counterReport();
                this.msg_count = 0;
            }

            try {
                appendFileSync(this.path, this.template(message, level));
            } catch (err) {
                throw new Error(`Logger.log: Failed to append message to log file\n\t${err}`);
            }

            this.msg_count++;
        }, this.time_offset);
    }
}

export default Logger;