import { Document } from "mongoose";

export default interface IMessage extends Document{
    from?: string //id of user that send the message
    to?: string //id of user that send the message
    content: string
    createdAt: Date
}