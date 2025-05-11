class HttpException extends Error {
    status: number;
    isError: boolean;
    message: string;
    redirectUrl: string | null
    constructor(status: number, message: string, redirectUrl: null | string = null) {
        super(message);
        this.isError = true;
        this.message = message;
        this.status = status;
        this.redirectUrl = redirectUrl
    }
}

export default HttpException;