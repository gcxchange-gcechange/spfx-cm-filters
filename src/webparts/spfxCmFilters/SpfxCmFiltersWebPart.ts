import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'SpfxCmFiltersWebPartStrings';
import SpfxCmFilters from './components/SpfxCmFilters';
import { ISpfxCmFiltersProps } from './components/ISpfxCmFiltersProps';
import { Globals, Language } from './Globals';
import { FilterSessionKeys } from './components/FilterForm';

export interface ISpfxCmFiltersWebPartProps {
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

export enum CrawledPropertyOption {
  ID = "ID",
  Id = "Id",
  NameEn = "NameEn",
  NameFr = "NameFr"
}

export default class SpfxCmFiltersWebPart extends BaseClientSideWebPart<ISpfxCmFiltersWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    // This is duplicated in Advaced Search, so the first one to render will inject the style
    const styleId = 'global-panel-commands-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .ms-Panel-commands {
          left: 0;
        }
        .ms-Callout-main div[class*="dropdownItemsWrapper-"] {
          width: auto !important;
        }
      `;
      document.head.appendChild(style);
    }

    const element: React.ReactElement<ISpfxCmFiltersProps> = React.createElement(
      SpfxCmFilters,
      {
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context,
        language: this.properties.language,
        debug: this.properties.debug,
        cacheTime: this.properties.cacheTime,
        jobTypeTermSetGuid: this.properties.jobTypeTermSetGuid,
        ClassificationCodeKey: this.properties.ClassificationCodeKey,
        ClassificationLevelKey: this.properties.ClassificationLevelKey,
        DepartmentKey: this.properties.DepartmentKey,
        WorkArrangementKey: this.properties.WorkArrangementKey,
        CityKey: this.properties.CityKey,
        LanguageRequirementKey: this.properties.LanguageRequirementKey
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this.properties.language ??= Language.English;
    this.properties.ClassificationCodeKey ??= CrawledPropertyOption.ID;
    this.properties.ClassificationLevelKey ??= CrawledPropertyOption.ID;
    this.properties.DepartmentKey ??= CrawledPropertyOption.ID;
    this.properties.WorkArrangementKey ??= CrawledPropertyOption.NameEn;
    this.properties.CityKey ??= CrawledPropertyOption.ID;
    this.properties.LanguageRequirementKey ??= CrawledPropertyOption.ID;
    this.properties.cacheTime ??= 30;

    Globals.setLanguage(this.properties.language);
    Globals.setCacheTime(this.properties.cacheTime);
    Globals.setDebugMode(this.properties.debug);
    Globals.setJobTypeTermSetGuid(this.properties.jobTypeTermSetGuid);
    
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }
  }

  protected onDispose(): void {
    (Object.keys(FilterSessionKeys) as (keyof typeof FilterSessionKeys)[])
    .map(k => FilterSessionKeys[k])
    .forEach(key => sessionStorage.removeItem(key));

    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private getCrawledPropertyOption(): IPropertyPaneDropdownOption[] {
    return (Object.keys(CrawledPropertyOption) as Array<keyof typeof CrawledPropertyOption>).map((key) => ({
      key: CrawledPropertyOption[key],
      text: CrawledPropertyOption[key]
    }));
  }

  private getLanguageOption(): IPropertyPaneDropdownOption[] {
    return (Object.keys(Language) as Array<keyof typeof Language>).map((key) => ({
      key: Language[key],
      text: Language[key]
    }));
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupFields: [
                PropertyPaneDropdown('language', {
                  label: 'Language',
                  options: this.getLanguageOption(),
                  selectedKey: Globals.getLanguage() || Language.English,
                }),
                PropertyPaneTextField('jobTypeTermSetGuid', {
                  label: 'JobType term set GUID',
                  value: Globals.getJobTypeTermSetGuid() || '45f37f08-3ff4-4d84-bf21-4a77ddffcf3e',
                  placeholder: '45f37f08-3ff4-4d84-bf21-4a77ddffcf3e'
                }),
                PropertyPaneDropdown('ClassificationCodeKey', {
                  label: 'ClassificationCode mapped crawled property',
                  options: this.getCrawledPropertyOption(),
                  selectedKey: this.properties.ClassificationCodeKey || CrawledPropertyOption.ID
                }),
                PropertyPaneDropdown('ClassificationLevelKey', {
                  label: 'ClassificationLevel mapped crawled property',
                  options: this.getCrawledPropertyOption(),
                  selectedKey: this.properties.ClassificationLevelKey || CrawledPropertyOption.ID
                }),
                PropertyPaneDropdown('DepartmentKey', {
                  label: 'Department mapped crawled property',
                  options: this.getCrawledPropertyOption(),
                  selectedKey: this.properties.DepartmentKey || CrawledPropertyOption.ID
                }),
                PropertyPaneDropdown('WorkArrangementKey', {
                  label: 'WorkArrangement mapped crawled property',
                  options: this.getCrawledPropertyOption(),
                  selectedKey: this.properties.WorkArrangementKey || CrawledPropertyOption.NameEn
                }),
                PropertyPaneDropdown('CityKey', {
                  label: 'City mapped crawled property',
                  options: this.getCrawledPropertyOption(),
                  selectedKey: this.properties.CityKey || CrawledPropertyOption.ID
                }),
                PropertyPaneDropdown('LanguageRequirementKey', {
                  label: 'LanguageRequirement mapped crawled property',
                  options: this.getCrawledPropertyOption(),
                  selectedKey: this.properties.LanguageRequirementKey || CrawledPropertyOption.ID
                }),
                PropertyPaneTextField('cacheTime', {
                  label: 'Cache Time',
                  description: 'Enter a number in minutes',
                  value: Globals.getCacheTime().toString() || '30',
                  onGetErrorMessage: (value: string): string => {
                    if (isNaN(Number(value)))
                      return 'Please enter a valid number.';
                    else if (Number(value) <= 0)
                      return 'Please number greater than 0';
                    return '';
                  }
                }),
                PropertyPaneToggle('debug', {
                  label: 'Debug',
                  checked: Globals.isDebugMode()
                }),
              ]
            }
          ]
        }
      ]
    };
  }

  public onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    switch(propertyPath) {
      case 'language':
        Globals.setLanguage(newValue);
        break;
      case 'debug':
        Globals.setDebugMode(newValue);
        break;
      case 'cacheTime':
        Globals.setCacheTime(newValue);
        break;
      case 'jobTypeTermSetGuid':
        Globals.setJobTypeTermSetGuid(newValue);
        break;
    }
  }
}
