import { Building } from "@prisma/client";
import prisma from "../../../shared/prisma";

const insertIntoDB = async(buildingData: Building):Promise<Building> => {
    const result = await prisma.building.create({
        data: buildingData
    });
    return result;
} 

export const BuildingService = {
    insertIntoDB
}