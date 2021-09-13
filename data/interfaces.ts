


export interface IEquipment {
    name: string;
    range: number;
    attacks: number;
    cost?: number;
    count?: number;
    specialRules?: string[];
}

export interface IUnit {
    category: string;
    name: string;
    size: number;
    cost: number;
    quality: string;
    defense: string;
    specialRules: string[];
    upgradeSets: string[];
    equipment: IEquipment[]
}

export interface IUpgrade {
    type: "replace" | "upgrade" | "upgradeRule";
    affects: "any" | "one" | "all";
    select: "any" | "one";
    replacesWhat: string;
    options: IEquipment[];
}

export interface ISelectedUnit extends IUnit {
    selectionId: number;
    selectedEquipment: IEquipment[];
}