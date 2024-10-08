import { createExponetialDelay, isTooManyTries, retryAsync } from "ts-retry";
import { OutageDto } from "./dto/outage.dto";
import { OutageService } from "./service/outage.service";

import * as dotenv from "dotenv";
import { OutageApiService } from "./service/api/site-outage.api.service";
import { SiteInfoDto } from "./dto/site-info.dto";
import { EnhancedOutagesDto } from "./dto/enhanced-outages.dto";
dotenv.config();

export class Handler {
  constructor(
    private readonly outageService: OutageService,
    private readonly outageApiService: OutageApiService
  ) {}
  async sendEnhancedOutages() {
    try {
      const delay = createExponetialDelay(20);
      await retryAsync(
        async () => {
          const outages: OutageDto[] = await this.outageApiService.getOutages();
          const siteInfo: SiteInfoDto =
            await this.outageApiService.getSite("norwich-pear-tree");
          const filtered: OutageDto[] = this.outageService.getFileteredOutages(
            outages,
            siteInfo
          );

          const siteOutages: EnhancedOutagesDto[] =
            this.outageService.mapSiteOutages(filtered, siteInfo);
          if (siteOutages.length === 0) {
            console.log("There is no outage to POST");
            return;
          }
          await this.outageApiService.createOutagesForSite(
            siteOutages,
            siteInfo.id
          );
        },
        { delay, maxTry: 5 }
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
// const siteOutageService = new SiteOutageService();
// const h = new Handler(siteOutageService);
// h.sendOutagesForSite();
