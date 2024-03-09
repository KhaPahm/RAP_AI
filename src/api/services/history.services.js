import { Status } from "../interfaces/enum.interfaces.js";
import { History_Watch } from "../models/history_watch.js";

export async function GetHistory(user_id = 0) {
    return await History_Watch.GetHistory(user_id);
}

export async function SetStatusForHistory(userId, animalRedListId, status = Status.OK) {
    return await History_Watch.SetStatusForHistory(userId, animalRedListId, status)
}