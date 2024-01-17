import { Animal_Type } from "../models/animal_types.models.js";

export async function AddAnimalType(animalType = new Animal_Type()) {
    const result = await animalType.AddAnimalType();
    return result;
}

export async function UpdateAnimalType(animalType = new Animal_Type()) {
    const result = await animalType.UpdateAnimalType();
    return result;
}

export async function GetAnimalTypes(animalTypeId = 0, status = null) {
    const result = Animal_Type.GetAnimalTypes(animalTypeId, status);
    return result;
}