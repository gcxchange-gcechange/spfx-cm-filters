import { WebPartContext } from "@microsoft/sp-webpart-base";
import { CrawledPropertyOption } from "../SpfxCmFiltersWebPart";

export interface ISpfxCmFiltersProps {
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  language: string;
  debug: boolean;
  cacheTime: number;
  jobTypeTermSetGuid: string;
  ClassificationCodeKey: CrawledPropertyOption;
  ClassificationLevelKey: CrawledPropertyOption;
  DepartmentKey: CrawledPropertyOption;
  WorkArrangementKey: CrawledPropertyOption;
  CityKey: CrawledPropertyOption;
  LanguageRequirementKey: CrawledPropertyOption;
}
