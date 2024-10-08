import { EnhancedOutagesDto } from "../dto/enhanced-outages.dto";
import { OutageDto } from "../dto/outage.dto";
import { SiteInfoDto } from "../dto/site-info.dto";
const retry = require("retry");

export class OutageService {
  constructor() {}
  private readonly endpoint = `https://api.krakenflex.systems/interview-tests-mock-api/v1`;
  async getOutages(): Promise<OutageDto[]> {
    return await this.fetch<OutageDto[]>(
      `${this.endpoint}/outages`,
      "GET",
      `Could not GET outages `
    );
  }

  async getSite(siteId: string): Promise<SiteInfoDto> {
    return await this.fetch<SiteInfoDto>(
      `${this.endpoint}/site-info/${siteId}`,
      "GET",
      `Could not GET site ${siteId} `
    );
  }

  async createOutagesForSite(
    outages: EnhancedOutagesDto[],
    siteId: string
  ): Promise<void> {
    const response = await this.fetch<{}>(
      `${this.endpoint}/site-outages/${siteId}`,
      "POST",
      "Could not POST site outages for norwich-pear-tree",
      outages
    );
    if (response) {
      console.log("Outages for`norwich-pear-tree` where created successfully");
    }
  }

  getFileteredOutages(
    outages: OutageDto[],
    siteInfo: SiteInfoDto
  ): OutageDto[] {
    const deviceIds: string[] = siteInfo.devices.map((device) => device.id);

    return outages.filter((outage: OutageDto) => {
      return (
        new Date(outage.begin) >= new Date("2022-01-01T00:00:00.000Z") &&
        deviceIds.includes(outage.id)
      );
    });
  }

  mapSiteOutages(filteredOutages: OutageDto[], siteInfo: SiteInfoDto) {
    return filteredOutages.map((outage: OutageDto) => {
      return {
        ...outage,
        name:
          siteInfo.devices.find((device) => device.id === outage.id)?.name ||
          "Unknown",
      };
    });
  }

  private async fetch<T>(
    url: string,
    method: "GET" | "POST" | "DELETE",
    errorMessage: string,
    data?: Record<string, unknown> | FormData | any[]
  ): Promise<T> {
    const response = await fetch(url, {
      method,
      headers: {
        "x-api-key": process.env.API_KEY || "",
        "Content-Type": "application/json",
      },

      ...(data ? { body: JSON.stringify(data) } : {}),
    });
    if (!response.ok) {
      throw new Error(
        JSON.stringify(
          { errorMessage, statusText: response.statusText, data },
          null,
          4
        )
      );
    }
    return response.json() as T;
  }
}
