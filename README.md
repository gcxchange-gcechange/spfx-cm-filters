# spfx-cm-filters

## Summary

The webpart is used to filter JobOpportunities for GCX Career Marketplace.

- Pulls the `JobType` term set
- Pulls the following lookup lists: `ClassificationCode`, `ClassificationLevel`, `Department`, `WorkArrangement`, `City/Region/Province`, `LanguageRequirements`
- Config requires the Term Set GUID for `JobType`. You can find this in the term store.
- Config allows you to set which crawled property you've mapped to your managed property for the column being filtered. The options are `ID`, `Id`, `NameEn`, and `NameFr`. If you have issues with filters not working please check the search schema to verify that the managed property uses the crawled property you've selected in this web part.
- Data is cached to localStorage for a certain amount of minutes which is set by the `Cache Time` property in the web part configuration.
- Supports English and French by setting the `Language` property in the web part configuration.
- Turn debugging on/off by toggling the `Debug` property in the web part configuration.

## Prerequisites

[spfx-pnp-modern-search-career-marketplace](https://github.com/gcxchange-gcechange/spfx-pnp-modern-search-career-marketplace) with the Advanced Search query modifier enabled in your pnp modern search results web part.

## API permission

Office 365 SharePoint Online - TermStore.Read.All

## Version

![SPFX](https://img.shields.io/badge/SPFX-1.20.0-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-v18.17.1+-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- In the command-line run:
  - **npm install**
  - **gulp serve**
- To debug in the front end:
  - go to the `serve.json` file and update `initialPage` to `https://domain-name.sharepoint.com/_layouts/15/workbench.aspx`
  - Run the command **gulp serve**
- To deploy: in the command-line run
  - **gulp bundle --ship**
  - **gulp package-solution --ship**
- Add the webpart to your tenant app store
- Add the Webpart to a page
- Edit the webpart
  - Enter the Greeting, Welcome Message and Text for Button in required language in the property pane (setting)
  - Enter the URL for button in the property pane (setting)
- Save and publish the page

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
