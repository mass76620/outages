import { Handler } from "./handler";
import { SiteOutageService } from "./service/site-outage.service";

describe("SiteOutageService", () => {
  let handler: Handler;
  let siteOutageService: SiteOutageService;

  beforeAll(async () => {
    siteOutageService = new SiteOutageService();
    handler = new Handler(siteOutageService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getOutages", () => {
    it("Send site outages", async () => {
      jest.spyOn(siteOutageService, "createOutagesForSite");
      await handler.sendOutagesForSite();
      expect(siteOutageService.createOutagesForSite).toHaveBeenCalledTimes(1);
    });

    it("No site outages to POST because no outages returned by the API", async () => {
      process.env.NODE_ENV = "dev";
      jest.spyOn(siteOutageService, "getOutages").mockResolvedValue([]);
      jest.spyOn(siteOutageService, "createOutagesForSite");
      await handler.sendOutagesForSite();
      expect(siteOutageService.createOutagesForSite).toHaveBeenCalledTimes(0);
    });
  });
});
