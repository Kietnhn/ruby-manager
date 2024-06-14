import { Review } from "@prisma/client";
import { IBasicUser } from "./user";

export interface ISummarisePoint {
    average: number | null;
    count: number;
}
export interface IReviewWithUser extends Review {
    user: IBasicUser;
}
