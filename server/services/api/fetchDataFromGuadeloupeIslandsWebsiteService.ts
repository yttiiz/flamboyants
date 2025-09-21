import { Helper } from "@utils";
import { VisitsDataType } from "@components";

export const fetchDataFromGuadeloupeIslandsWebsiteService = async () => {
  const data = await Helper.convertJsonToObject<{ items: VisitsDataType[] }>(
    "/server/data/visits/visits.json",
  );

  return { data: JSON.stringify(data), status: 200 };
};
