export interface IListItem {
  ID: number;
  Id: number;
  NameEn: string;
  NameFr: string;
}

export interface ICityItem {
  ID: number;
  Id: number;
  NameEn: string;
  NameFr: string;
  Region: IListItem;
}

export interface IRegionItem {
  ID: number;
  Id: number;
  NameEn: string;
  NameFr: string;
  Province: IListItem;
}