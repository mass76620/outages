import { createExponetialDelay, isTooManyTries, retryAsync } from "ts-retry";
import { OutageDto } from "./dto/outage.dto";
import { SiteOutageDto } from "./dto/site-outage.dto";
import { SiteDto } from "./dto/site.dto";
import { SiteOutageService } from "./service/site-outage.service";

import * as dotenv from "dotenv";
dotenv.config();

export class Handler {
  constructor(private readonly siteOutageService: SiteOutageService) {}
  async sendOutagesForSite() {
    try {
      const delay = createExponetialDelay(20);
      await retryAsync(
        async () => {
          const outages: OutageDto[] =
            await this.siteOutageService.getOutages();
          const siteInfo: SiteDto =
            await this.siteOutageService.getSite("norwich-pear-tree");
          const filtered: OutageDto[] =
            this.siteOutageService.getFileteredOutages(outages, siteInfo);

          const siteOutages: SiteOutageDto[] =
            this.siteOutageService.mapSiteOutages(filtered, siteInfo);
          if (siteOutages.length === 0) {
            console.log("There is no outage to POST");
            return;
          }
          await this.siteOutageService.createOutagesForSite(
            siteOutages,
            siteInfo.id,
          );
        },
        { delay, maxTry: 5 },
      );
    } catch (e) {
      if (isTooManyTries(e)) {
        // retry failed
        console.error(`last error is ${e.getLastResult()}`);
      } else {
        console.error(e);
      }
      throw e;
    }
  }
}
const siteOutageService = new SiteOutageService();
const h = new Handler(siteOutageService);
h.sendOutagesForSite();
