import { Handler } from "./handler";
import { OutageApiService } from "./service/api/site-outage.api.service";
import { OutageService } from "./service/outage.service";

describe("SiteOutageService", () => {
  let handler: Handler;
  let outageApiService: OutageApiService;

  beforeAll(async () => {
    outageApiService = new OutageApiService();
    handler = new Handler(new OutageService(), outageApiService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getOutages", () => {
    it("Send site outages", async () => {
      jest.spyOn(outageApiService, "createOutagesForSite");
      await handler.sendEnhancedOutages();
      expect(outageApiService.createOutagesForSite).toHaveBeenCalledTimes(1);
    });

    it("No site outages to POST because no outages returned by the API", async () => {
      jest.spyOn(outageApiService, "getOutages").mockResolvedValue([]);
      jest.spyOn(outageApiService, "createOutagesForSite");
      await handler.sendEnhancedOutages();
      expect(outageApiService.createOutagesForSite).toHaveBeenCalledTimes(0);
    });
  });
});
