import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import { StatusCodes, ReasonPhrases } from "http-status-codes"

async function authMiddleware(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization

    if (!authToken) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, "/login")
    }
    else {
        //verify token api
        const tokenVerified = false
        if (!tokenVerified) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, "/login")
        }
        else {
            next()
        }
    }

}


export default authMiddleware