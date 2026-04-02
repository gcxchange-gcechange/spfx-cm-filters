import { WebPartContext } from "@microsoft/sp-webpart-base";

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
}
