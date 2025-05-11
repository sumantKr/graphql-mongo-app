import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import { StatusCodes } from "http-status-codes";


function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || "Something went wrong";
    const { isError, redirectUrl } = error
    return response
        .status(status)
        .send({
            status, message, error: isError, redirectUrl
        })
}


export default errorMiddleware;