export class SiteInfoDto {
  id: string;
  name: string;
  devices: { id: string; name: string }[];
}
