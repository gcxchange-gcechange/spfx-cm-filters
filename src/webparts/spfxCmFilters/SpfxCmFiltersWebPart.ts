import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
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
  programAreaTermSetGuid: string;
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
        language: this.properties.language,
        debug: this.properties.debug,
        cacheTime: this.properties.cacheTime,
        jobTypeTermSetGuid: this.properties.jobTypeTermSetGuid,
        programAreaTermSetGuid: this.properties.programAreaTermSetGuid
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    Globals.setLanguage(this.properties.language);
    Globals.setCacheTime(this.properties.cacheTime ? this.properties.cacheTime : 30);
    Globals.setDebugMode(this.properties.debug);
    Globals.setJobTypeTermSetGuid(this.properties.jobTypeTermSetGuid);
    Globals.setProgramAreaTermSetGuid(this.properties.programAreaTermSetGuid);
    
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
    sessionStorage.removeItem(FilterSessionKeys.Initialized);
    sessionStorage.removeItem(FilterSessionKeys.JobType);
    sessionStorage.removeItem(FilterSessionKeys.ProgramArea);
    sessionStorage.removeItem(FilterSessionKeys.ApplicationDeadline);

    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('language', {
                  label: 'Language',
                  value: Globals.getLanguage(),
                  placeholder: `${Language.English} or ${Language.French}`
                }),
                PropertyPaneTextField('jobTypeTermSetGuid', {
                  label: 'JobType term set GUID',
                  value: Globals.getJobTypeTermSetGuid(),
                  placeholder: '45f37f08-3ff4-4d84-bf21-4a77ddffcf3e'
                }),
                PropertyPaneTextField('programAreaTermSetGuid', {
                  label: 'ProgramArea term set GUID',
                  value: Globals.getProgramAreaTermSetGuid(),
                  placeholder: 'bd807536-d8e7-456b-aab0-fae3eecedd8a'
                }),
                PropertyPaneTextField('cacheTime', {
                  label: 'Cache Time',
                  description: 'Enter a number in minutes',
                  value: Globals.getCacheTime().toString(),
                  onGetErrorMessage: (value: string): string => {
                    if (isNaN(Number(value)))
                      return "Please enter a valid number.";
                    else if (Number(value) <= 0)
                      return "Please number greater than 0";
                    return "";
                  }
                }),
                PropertyPaneToggle('debug', {
                  label: 'Debug',
                  checked: Globals.isDebugMode()
                })
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
      case 'programAreaTermSetGuid':
        Globals.setProgramAreaTermSetGuid(newValue);
        break;  
    }
  }
}
