import { Conservation_Status } from "../models/conservation_status.models.js";

export async function AddConservationStatus(cs = new Conservation_Status()) {
    const result = await cs.AddConservationStatus();
    return result;
}

export async function UpdateConservationStatus(cs = new Conservation_Status()) {
    const result = await cs.UpdateConservationStatus();
    return result;
}

export async function GetConservationStatus(csId = 0, status = null) {
    const result =  Conservation_Status.GetConservationStatus(csId, status);
    return result;
}