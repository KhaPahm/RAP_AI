import { History_Watch } from "../models/history_watch.js";

export async function GetHistory(user_id = 0) {
    return await History_Watch.GetHistory(user_id);
}