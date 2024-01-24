import ImageModel from "../models/image.models.js";

export async function UpdateImage(image = new ImageModel()) {
    const result = await image.UpdateStatus();

    return result;
}