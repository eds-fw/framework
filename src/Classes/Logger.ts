import { accessSync, appendFileSync, mkdirSync } from "fs";
import { eds_errors } from "../errors";
import deprecated from "deprecated-decorator";

/**
 * Writes the specified text to .log files. Keeps count of the number of messages.
 * @deprecated
 */
@deprecated
export class Logger
{
    private _path: string = "";
    private _date: string;

    public msgCount: number = 0;

    public constructor(private dirpath: string = "./logs", private time_offset: number = 0)
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
        this._path = this.dirpath + `/${date}.log`;
        this._date = this._today();
    }

    public template = (message: string, level: string = 'U') => `\n[${this._time()}] [${level}] (${this.msgCount + 1}) ${message}`;

    public log(message: string, level?: 'I' | 'II' | 'III'): void
    {
        //load displacement
        setTimeout(() => {
            if (this._today() !== this._date)
            {
                this._path = this.dirpath + `/${this._today()}.log`;
                this._createFile(this._today());
                this._counterReport();
                this.msgCount = 0;
            }

            try {
                appendFileSync(this._path, this.template(message, level));
            } catch (err) {
                throw new Error(eds_errors.Logger.appendMessageError(err));
            }

            this.msgCount++;
        }, this.time_offset);
    }

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
            appendFileSync(this._path, `\n\nEnd of log file. Total messages: ${this.msgCount}`);
        } catch (err) {
            throw new Error(eds_errors.Logger.counterReportError(err));
        }
    }
}

export default Logger;