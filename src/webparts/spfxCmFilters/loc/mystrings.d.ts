declare interface ISpfxCmFiltersWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;
  Filters: string;
  btnExpanderOpen: string;
  btnExpanderClosed: string;
  clear: string;
  jobType: string;
  programArea: string;
  applicationDeadline: string;
  apply: string;
  optionPlaceholder: string;
  datePlaceholder: string;
  remove: string;
  selectedJobTypes: string;
  selectedProgramAreas: string;
}

declare module 'SpfxCmFiltersWebPartStrings' {
  const strings: ISpfxCmFiltersWebPartStrings;
  export = strings;
}
