import { OutageDto } from "../dto/outage.dto";
import { SiteInfoDto } from "../dto/site-info.dto";
import { OutageApiService } from "./api/site-outage.api.service";
import { OutageService } from "./outage.service";

describe("OutageService", () => {
  let outageApiService: OutageApiService;
  let outageService: OutageService;
  let site: SiteInfoDto;

  global.fetch = jest
    .fn()
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
              begin: "2021-07-26T17:09:31.036Z",
              end: "2021-08-29T00:37:42.253Z",
            },
            {
              id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
              begin: "2022-05-23T12:21:27.377Z",
              end: "2022-11-13T02:16:38.905Z",
            },
            {
              id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
              begin: "2022-12-04T09:59:33.628Z",
              end: "2022-12-12T22:35:13.815Z",
            },
            {
              id: "04ccad00-eb8d-4045-8994-b569cb4b64c1",
              begin: "2022-07-12T16:31:47.254Z",
              end: "2022-10-13T04:05:10.044Z",
            },
            {
              id: "086b0d53-b311-4441-aaf3-935646f03d4d",
              begin: "2022-07-12T16:31:47.254Z",
              end: "2022-10-13T04:05:10.044Z",
            },
            {
              id: "27820d4a-1bc4-4fc1-a5f0-bcb3627e94a1",
              begin: "2021-07-12T16:31:47.254Z",
              end: "2022-10-13T04:05:10.044Z",
            },
          ]),
        ok: true,
      }),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            id: "kingfisher",
            name: "KingFisher",
            devices: [
              {
                id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
                name: "Battery 1",
              },
              {
                id: "086b0d53-b311-4441-aaf3-935646f03d4d",
                name: "Battery 2",
              },
            ],
          }),
        ok: true,
      }),
    );

  beforeAll(async () => {
    outageService = new OutageService();
    site = {
      id: "kingfisher",
      name: "KingFisher",
      devices: [
        {
          id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
          name: "Battery 1",
        },
        {
          id: "086b0d53-b311-4441-aaf3-935646f03d4d",
          name: "Battery 2",
        },
      ],
    };
  });

  describe("getFileteredOutages", () => {
    it("No outage because outages happen before 2022-01-01T00:00:00.000Z or outageId does not match any device", async () => {
      const outages: OutageDto[] = [
        {
          id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
          begin: new Date("2021-07-26T17:09:31.036Z"),
          end: new Date("2021-08-29T00:37:42.253Z"),
        },
      ];

      const filteredOutages = outageService.getFileteredOutages(outages, site);
      expect(filteredOutages).toEqual([]);
    });

    it("No outage because outageId does not match any device", async () => {
      const outages = [
        {
          id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
          begin: new Date("2021-07-26T17:09:31.036Z"),
          end: new Date("2021-08-29T00:37:42.253Z"),
        },
      ];

      const filteredOutages = outageService.getFileteredOutages(outages, site);
      expect(filteredOutages).toEqual([]);
    });

    it("Find one outage", async () => {
      const outages = [
        {
          id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
          begin: new Date("2021-07-26T17:09:31.036Z"),
          end: new Date("2021-08-29T00:37:42.253Z"),
        },
        {
          id: "002b28fc-283c-47ec-9af2-ea287336daaa",
          begin: new Date("2023-07-26T17:09:31.036Z"),
          end: new Date("2023-08-29T00:37:42.253Z"),
        },
        {
          id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
          begin: new Date("2024-07-26T17:09:31.036Z"),
          end: new Date("2024-08-29T00:37:42.253Z"),
        },
      ];

      const filteredOutages = outageService.getFileteredOutages(outages, site);
      expect(filteredOutages).toEqual([
        {
          id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
          begin: new Date("2024-07-26T17:09:31.036Z"),
          end: new Date("2024-08-29T00:37:42.253Z"),
        },
      ]);
    });
  });

  describe("mapSiteOutages", () => {
    it("Map siteOutage by attaching device name", async () => {
      const outages: OutageDto[] = [
        {
          id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
          begin: new Date("2021-07-26T17:09:31.036Z"),
          end: new Date("2021-08-29T00:37:42.253Z"),
        },
      ];

      const filteredOutages = outageService.mapSiteOutages(outages, site);
      expect(filteredOutages).toEqual([
        {
          id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
          begin: new Date("2021-07-26T17:09:31.036Z"),
          end: new Date("2021-08-29T00:37:42.253Z"),
          name: "Battery 1",
        },
      ]);
    });

    it("Map siteOutage when device name could not be found", async () => {
      const outages: OutageDto[] = [
        {
          id: "002b28fc-283c-47ec-9af2-ea287336dc1a",
          begin: new Date("2021-07-26T17:09:31.036Z"),
          end: new Date("2021-08-29T00:37:42.253Z"),
        },
      ];

      const filteredOutages = outageService.mapSiteOutages(outages, site);
      expect(filteredOutages).toEqual([
        {
          id: "002b28fc-283c-47ec-9af2-ea287336dc1a",
          begin: new Date("2021-07-26T17:09:31.036Z"),
          end: new Date("2021-08-29T00:37:42.253Z"),
          name: "Unknown",
        },
      ]);
    });

    it("Map siteOutage by attaching device name on several outages", async () => {
      const outages: OutageDto[] = [
        {
          id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
          begin: new Date("2021-07-26T17:09:31.036Z"),
          end: new Date("2021-08-29T00:37:42.253Z"),
        },
        {
          id: "086b0d53-b311-4441-aaf3-935646f03d4d",
          begin: new Date("2021-07-26T17:09:31.036Z"),
          end: new Date("2021-08-29T00:37:42.253Z"),
        },
      ];

      const filteredOutages = outageService.mapSiteOutages(outages, site);
      expect(filteredOutages).toEqual([
        {
          id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
          begin: new Date("2021-07-26T17:09:31.036Z"),
          end: new Date("2021-08-29T00:37:42.253Z"),
          name: "Battery 1",
        },
        {
          id: "086b0d53-b311-4441-aaf3-935646f03d4d",
          begin: new Date("2021-07-26T17:09:31.036Z"),
          end: new Date("2021-08-29T00:37:42.253Z"),
          name: "Battery 2",
        },
      ]);
    });
  });
});
