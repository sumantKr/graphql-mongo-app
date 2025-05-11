import mongoose from "mongoose";



export const  MODEL_NAMES = {
    CUSTOMER:'Customer',
    PRODUCT:'Product',
    ORDER:'Order',
}


export interface IIdTimestampMixin{
    _id: typeof mongoose.Schema.Types.UUID;
    createdAt?: Date;
    updatedAt?: Date;
} 