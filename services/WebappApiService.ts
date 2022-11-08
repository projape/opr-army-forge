import axios from "axios";
import { IArmyData } from "../data/armySlice";
import { ListState } from "../data/listSlice";
import { gameSystemToEnum, isServer } from "./Helpers";
import PersistenceService from "./PersistenceService";
import UnitService from "./UnitService";

export default class WebappApiService {

  private static webCompanionUrl = "https://projape.net/checker/api";

  private static getUrl() {
    //return window.location.host.startsWith("localhost") ? "http://localhost:3000/api" : this.webCompanionUrl;
    return this.webCompanionUrl;
  }

  private static cacheResponse(key: string, res: any) {
    if (!isServer())
      localStorage[key] = JSON.stringify({
        cached: new Date(),
        res
      });
  }

  private static getFromCache(key: string) {
    if (isServer())
      return null;
    const cachedValue = localStorage[key];
    if (!cachedValue) return null;
    const cachedObject = JSON.parse(cachedValue);
    return cachedObject.res;
  }

  public static async getArmyBooks(gameSystemSlug: string) {
    const cacheKey = "AF_Cache_army-books-" + gameSystemSlug;
    try {
      const res = await fetch(this.getUrl() + "//index.php?gamebooks=" + gameSystemSlug + "-army-books");
      const data = await res.json();
      this.cacheResponse(cacheKey, data);
      return data;
    }
    catch (e) {
      return this.getFromCache(cacheKey);
    }
  }

  public static async getGameRules(gameSystemSlug: string) {

    const cacheKey = "AF_Cache_game-rules-" + gameSystemSlug;
    try {
      const res = await fetch(this.getUrl() + "/index.php?specialid=" + gameSystemSlug);
      const data = await res.json();
      this.cacheResponse(cacheKey, data);
      return data;
    }
    catch (e) {
      return this.getFromCache(cacheKey);
    }
  }

  public static async getArmyBookData(armyId: string, gameSystem: string) {

    const cacheKey = "AF_Cache_army-" + armyId + gameSystem;
    try {
      const gameSystemId = gameSystemToEnum(gameSystem);

      const url = this.getUrl() + `/index.php?id=${armyId}~${gameSystemId}`;
      console.log("Fetching army data from", url);

      const armyBookRes = await fetch(url);

      console.log("Webapp response", armyBookRes);

      const data: IArmyData = await armyBookRes.json();

      const transformedData: IArmyData = this.transformArmyBookData(data, armyId);

      this.cacheResponse(cacheKey, transformedData);

      return transformedData;
    }
    catch (e) {
      console.error("Error loading from webapp", e);
      return this.getFromCache(cacheKey);
    }
  };

  public static transformArmyBookData(data: any, armyId: string) {

    const upgradePackages = data.upgradePackages.map(upgradePackage => ({
      ...upgradePackage,
      sections: upgradePackage.sections.map(section => ({
        ...section,
        isCommandGroup: section.options
          .some(opt => opt.gains.some(g => g.name.toLocaleLowerCase() === "musician")),
        options: section.options.map(option => {
          const result: any = {
            ...option,
            parentSectionId: section.uid
          };
          delete result.proposedCost;
          delete result.proposedCostHint;
          delete result.proposedVersion;
          delete result.parentPackageUid;
          delete result.parentSectionUid;
          return result;
        })
      }))
    }));

    const transformedData: IArmyData = {
      ...data,
      units: data.units.map((unit, index) => ({
        ...unit,
        armyId: armyId,
        selectedUpgrades: [],
        sortId: index,
        disabledUpgradeSections: UnitService.getDisabledUpgradeSections(unit, upgradePackages)
      })),
      upgradePackages: upgradePackages
    };

    return transformedData;
  }

  public static async shareList(list: ListState) {
    const payload = PersistenceService.getDataForSave(list);
    return await axios.post(this.getUrl() + "/af/share", payload);
  }

  public static async getSharedList(id: string) {
    const res = await axios.get(this.getUrl() + "/af/share/" + id);
    console.log("GET Share res", res);
    return res.data;
  }
}
