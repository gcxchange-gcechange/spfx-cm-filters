/* eslint-disable @typescript-eslint/no-this-alias */
import * as React from 'react';
import styles from './SpfxCmFilters.module.scss';
import type { ISpfxCmFiltersProps } from './ISpfxCmFiltersProps';
import { Globals, Language } from '../Globals';
import { DefaultButton, Icon, IDropdownOption } from '@fluentui/react';
import FilterForm from './FilterForm';
import { SessionController } from '../SessionController';
import { TermSet, TermSetError } from '../interfaces/ITermSet';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { SPFI } from '@pnp/sp';
import { getSP } from '../../../pnpjsConfig';
import { ICityItem, IListItem, IRegionItem } from '../interfaces/IListItem';
import { CrawledPropertyOption } from '../SpfxCmFiltersWebPart';

const jobTypeCtrl = new SessionController<TermSet | TermSetError>('gcx-cm-jobTypeList');
const jobTypeListEn: IDropdownOption[] = [];
const jobTypeListFr: IDropdownOption[] = [];

const classCodeCtrl = new SessionController<IListItem[]>('gcx-cm-classCodeList');
const classificationCodeListEn: IDropdownOption[] = [];
const classificationCodeListFr: IDropdownOption[] = [];

const classLevelCtrl = new SessionController<IListItem[]>('gcx-cm-classLevelList');
const classificationLevelListEn: IDropdownOption[] = [];
const classificationLevelListFr: IDropdownOption[] = [];

const departmentCtrl = new SessionController<IListItem[]>('gcx-cm-departmentList');
const departmentListEn: IDropdownOption[] = [];
const departmentListFr: IDropdownOption[] = [];

const workArrangementCtrl = new SessionController<IListItem[]>('gcx-cm-workArrList');
const workArrangementListEn: IDropdownOption[] = [];
const workArrangementListFr: IDropdownOption[] = [];

const cityCtrl = new SessionController<ICityItem[]>('gcx-cm-cityList');
const regionCtrl = new SessionController<IRegionItem[]>('gcx-cm-regionList');
const cityListEn: IDropdownOption[] = [];
const cityListFr: IDropdownOption[] = [];

const languageReqCtrl = new SessionController<IListItem[]>('gcx-cm-languageReqList');
const languageRequirementListEn: IDropdownOption[] = [];
const languageRequirementListFr: IDropdownOption[] = [];

export default class SpfxCmFilters extends React.Component<ISpfxCmFiltersProps> {
  strings = Globals.getStrings();
  sp!: SPFI;

  buttonStyle = {
    fontSize: '16px',
    minWidth: '25px',
    minHeight: '25px',
    border: '0',
    color: 'black'
  };

  public constructor(props: ISpfxCmFiltersProps, state: ISpfxCmFiltersProps){ 
    super(props); 
    this.state = { 
    };
  }

  public async componentDidMount(): Promise<void>
  {
    const reacthandler = this;
    reacthandler.sp = getSP(this.props.context);

    const jobTypeResponse = await jobTypeCtrl.fetch(this.getJobTypeTerms);
    if (jobTypeResponse && !(jobTypeResponse as TermSetError).error) {
      jobTypeListEn.length = 0;
      jobTypeListFr.length = 0;
      
      (jobTypeResponse as TermSet).value.forEach((term) => {
        if (!term.isDeprecated) {
          jobTypeListEn.push({key: term.id, text: term.labels.filter(t => t.languageTag === 'en-US')[0].name});
          jobTypeListFr.push({key: term.id, text: term.labels.filter(t => t.languageTag !== 'en-US')[0].name});
        } else if (Globals.isDebugMode() ) {
          console.log('The following term is deprecated and will not be added to the JobType list:', term);
        }
      });

      jobTypeListEn.sort((a, b) => a.text.localeCompare(b.text));
      jobTypeListFr.sort((a, b) => a.text.localeCompare(b.text));

      this.setState({jobTypeListEn, jobTypeListFr});
    }

    try {
      const classCodeResponse = await classCodeCtrl.fetch(this.sp.web.lists.getByTitle('ClassificationCode').items.select('ID,NameEn,NameFr').top(5000));
      if (classCodeResponse) {
        classificationCodeListEn.length = 0;
        classificationCodeListFr.length = 0;

        (classCodeResponse as IListItem[]).forEach((item) => {
          switch(this.props.ClassificationCodeKey) {
            case CrawledPropertyOption.ID:
            case CrawledPropertyOption.Id:
              classificationCodeListEn.push({key: item[this.props.ClassificationCodeKey], text: item.NameEn});
              classificationCodeListFr.push({key: item[this.props.ClassificationCodeKey], text: reacthandler.decode(item.NameFr)});
              break;
            case CrawledPropertyOption.NameEn:
            case CrawledPropertyOption.NameFr:
              classificationCodeListEn.push({key: `"${item[this.props.ClassificationCodeKey]}"`, text: item.NameEn});
              classificationCodeListFr.push({key: `"${item[this.props.ClassificationCodeKey]}"`, text: reacthandler.decode(item.NameFr)});
              break;
            default:
              console.error(`Unknown ClassificationCodeKey: ${this.props.ClassificationCodeKey}`);
              break;
          }
        });

        classificationCodeListEn.sort((a, b) => a.text.localeCompare(b.text));
        classificationCodeListFr.sort((a, b) => a.text.localeCompare(b.text));

        reacthandler.setState({classificationCodeListEn, classificationCodeListFr});
      }
    } catch (e) { console.error('Unable to fetch ClassificationCode list', e);}

    try {
      const classLevelResponse = await classLevelCtrl.fetch(this.sp.web.lists.getByTitle('ClassificationLevel').items.select('ID,NameEn,NameFr').top(5000));
      if (classLevelResponse) {
        classificationLevelListEn.length = 0;
        classificationLevelListFr.length = 0;

        (classLevelResponse as IListItem[]).forEach((item) => {
          switch(this.props.ClassificationLevelKey) {
            case CrawledPropertyOption.ID:
            case CrawledPropertyOption.Id:
              classificationLevelListEn.push({key: item[this.props.ClassificationLevelKey], text: item.NameEn});
              classificationLevelListFr.push({key: item[this.props.ClassificationLevelKey], text: reacthandler.decode(item.NameFr)});
              break;
            case CrawledPropertyOption.NameEn:
            case CrawledPropertyOption.NameFr:
              classificationLevelListEn.push({key: `"${item[this.props.ClassificationLevelKey]}"`, text: item.NameEn});
              classificationLevelListFr.push({key: `"${item[this.props.ClassificationLevelKey]}"`, text: reacthandler.decode(item.NameFr)});
              break;
            default:
              console.error(`Unknown ClassificationLevelKey: ${this.props.ClassificationLevelKey}`);
              break;
          }
        });

        classificationLevelListEn.sort((a, b) => a.text.localeCompare(b.text));
        classificationLevelListFr.sort((a, b) => a.text.localeCompare(b.text));

        reacthandler.setState({classificationLevelListEn, classificationLevelListFr});
      }
    } catch (e) { console.error('Unable to fetch ClassificationLevel list', e);}

    try {
      const departmentResponse = await departmentCtrl.fetch(this.sp.web.lists.getByTitle('Department').items.select('ID,NameEn,NameFr').top(5000));
      if (departmentResponse) {
        departmentListEn.length = 0;
        departmentListFr.length = 0;

        (departmentResponse as IListItem[]).forEach((item) => {
          switch(this.props.DepartmentKey) {
            case CrawledPropertyOption.ID:
            case CrawledPropertyOption.Id:
              departmentListEn.push({key: item[this.props.DepartmentKey], text: item.NameEn});
              departmentListFr.push({key: item[this.props.DepartmentKey], text: reacthandler.decode(item.NameFr)});
              break;
            case CrawledPropertyOption.NameEn:
            case CrawledPropertyOption.NameFr:
              departmentListEn.push({key: `"${item[this.props.DepartmentKey]}"`, text: item.NameEn});
              departmentListFr.push({key: `"${item[this.props.DepartmentKey]}"`, text: reacthandler.decode(item.NameFr)});
              break;
            default:
              console.error(`Unknown DepartmentKey: ${this.props.DepartmentKey}`);
              break;
          }
        });

        departmentListEn.sort((a, b) => a.text.localeCompare(b.text));
        departmentListFr.sort((a, b) => a.text.localeCompare(b.text));

        reacthandler.setState({departmentListEn, departmentListFr});
      }
    } catch (e) { console.error('Unable to fetch Department list', e);}

    try {
      const workArrangementResponse = await workArrangementCtrl.fetch(this.sp.web.lists.getByTitle('WorkArrangement').items.select('ID,NameEn,NameFr').top(5000));
      if (workArrangementResponse) {
        workArrangementListEn.length = 0;
        workArrangementListFr.length = 0;

        (workArrangementResponse as IListItem[]).forEach((item) => {
          switch(this.props.WorkArrangementKey) {
            case CrawledPropertyOption.ID:
            case CrawledPropertyOption.Id:
              workArrangementListEn.push({key: item[this.props.WorkArrangementKey], text: item.NameEn});
              workArrangementListFr.push({key: item[this.props.WorkArrangementKey], text: reacthandler.decode(item.NameFr)});
              break;
            case CrawledPropertyOption.NameEn:
            case CrawledPropertyOption.NameFr:
              workArrangementListEn.push({key: `"${item[this.props.WorkArrangementKey]}"`, text: item.NameEn});
              workArrangementListFr.push({key: `"${item[this.props.WorkArrangementKey]}"`, text: reacthandler.decode(item.NameFr)});
              break;
            default:
              console.error(`Unknown WorkArrangementKey: ${this.props.WorkArrangementKey}`);
              break;
          }
        });

        workArrangementListEn.sort((a, b) => a.text.localeCompare(b.text));
        workArrangementListFr.sort((a, b) => a.text.localeCompare(b.text));

        reacthandler.setState({workArrangementListEn, workArrangementListFr});
      }
    } catch (e) { console.error('Unable to fetch WorkArrangement list', e);}

    try {
      const cityResponse = await cityCtrl.fetch(this.sp.web.lists.getByTitle('City').items
      .select('ID,NameEn,NameFr,Region/ID,Region/NameEn,Region/NameFr')
      .expand('Region').top(5000));
      if (cityResponse) {
        try {
          const regionResponse = await regionCtrl.fetch(this.sp.web.lists.getByTitle('Region').items
          .select('ID,NameEn,NameFr,Province/ID,Province/NameEn,Province/NameFr')
          .expand('Province').top(5000));
          if (regionResponse) {
            cityListEn.length = 0;
            cityListFr.length = 0;

            (cityResponse as ICityItem[]).forEach((item) => {

              let provinceEn: string = "Unknown";
              let provinceFr: string = "Inconnu";
              for (let i = 0; i < regionResponse.length; i++) {
                if (regionResponse[i].ID === item.Region.ID) {
                  provinceEn = regionResponse[i].Province.NameEn;
                  provinceFr = regionResponse[i].Province.NameFr;
                  break;
                }
              }

              const finalTextEn = `${item.NameEn}, ${item.Region.NameEn}, ${provinceEn}`.trim();
              const finalTextFr = reacthandler.decode(`${item.NameFr}, ${item.Region.NameFr}, ${provinceFr}`.trim());

              switch(this.props.CityKey) {
                case CrawledPropertyOption.ID:
                case CrawledPropertyOption.Id:
                  cityListEn.push({key: item[this.props.CityKey], text: finalTextEn});
                  cityListFr.push({key: item[this.props.CityKey], text: finalTextFr});
                  break;
                case CrawledPropertyOption.NameEn:
                case CrawledPropertyOption.NameFr:
                  cityListEn.push({key: `"${item[this.props.CityKey]}"`, text: finalTextEn});
                  cityListFr.push({key: `"${item[this.props.CityKey]}"`, text: finalTextFr});
                  break;
                default:
                  console.error(`Unknown CityKey: ${this.props.CityKey}`);
                  break;
              }
            });

            cityListEn.sort((a, b) => a.text.localeCompare(b.text));
            cityListFr.sort((a, b) => a.text.localeCompare(b.text));

            reacthandler.setState({cityListEn, cityListFr});
          }
        } catch (e) { console.error('Unable to fetch Province list', e);}
      }
    } catch (e) { console.error('Unable to fetch City list', e);}

    try {
      const languageRequirementResponse = await languageReqCtrl.fetch(this.sp.web.lists.getByTitle('LanguageRequirement').items.select('ID,NameEn,NameFr').top(5000));
      if (languageRequirementResponse) {
        languageRequirementListEn.length = 0;
        languageRequirementListFr.length = 0;

        (languageRequirementResponse as IListItem[]).forEach((item) => {
          languageRequirementListEn.push({key: item.ID, text: item.NameEn});
          languageRequirementListFr.push({key: item.ID, text: reacthandler.decode(item.NameFr)});

          switch(this.props.LanguageRequirementKey) {
            case CrawledPropertyOption.ID:
            case CrawledPropertyOption.Id:
              languageRequirementListEn.push({key: item[this.props.LanguageRequirementKey], text: item.NameEn});
              languageRequirementListFr.push({key: item[this.props.LanguageRequirementKey], text: reacthandler.decode(item.NameFr)});
              break;
            case CrawledPropertyOption.NameEn:
            case CrawledPropertyOption.NameFr:
              languageRequirementListEn.push({key: `"${item[this.props.LanguageRequirementKey]}"`, text: item.NameEn});
              languageRequirementListFr.push({key: `"${item[this.props.LanguageRequirementKey]}"`, text: reacthandler.decode(item.NameFr)});
              break;
            default:
              console.error(`Unknown LanguageRequirementKey: ${this.props.LanguageRequirementKey}`);
              break;
          }
        });

        languageRequirementListEn.sort((a, b) => a.text.localeCompare(b.text));
        languageRequirementListFr.sort((a, b) => a.text.localeCompare(b.text));

        reacthandler.setState({languageRequirementListEn, languageRequirementListFr});
      }
    } catch (e) { console.error('Unable to fetch LanguageRequirement list', e);}
  }

  public async componentDidUpdate(prevProps: Readonly<ISpfxCmFiltersProps>, prevState: Readonly<{}>, snapshot?: unknown): Promise<void> {
    if (prevProps.language !== this.props.language && (this.props.language === Language.English || this.props.language === Language.French)) {
      this.forceUpdate();
    }
  }

  private getJobTypeTerms = async (): Promise<TermSet> => {
    const response = await fetch(`/_api/v2.1/termstore/sets/${Globals.getJobTypeTermSetGuid()}/terms/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json;odata=verbose' }
    });
  
    return await response.json();
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private decode(s: string) {
    return decodeURIComponent(s);
  }

  public render(): React.ReactElement<ISpfxCmFiltersProps> {
    const {
      hasTeamsContext
    } = this.props;

    const open = Globals.isOpen();

    return (
      <section className={`${styles.spfxCmFilters} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.filtersHeader} style={{paddingBottom: open ? '10px' : '0px'}}>
          <h2 id='gcx-cm-filter-title'>
            {this.strings.Filters}
          </h2>

          <div style={{float: 'right'}}>
            <DefaultButton 
              style={this.buttonStyle} 
              role='button'
              aria-label={open ? this.strings.btnExpanderOpen : this.strings.btnExpanderClosed}
              aria-expanded={open}
              onClick={() => {
                Globals.setOpen(!open);
                this.forceUpdate();
              }}
            >
              <Icon iconName={open ? 'ChevronUp' : 'ChevronDown'} />
            </DefaultButton>
          </div>
        </div>

        <div style={{display: open ? 'block' : 'none'}}>
          <FilterForm
            jobTypeListEn={jobTypeListEn}
            jobTypeListFr={jobTypeListFr}
            classificationCodeListEn={classificationCodeListEn}
            classificationCodeListFr={classificationCodeListFr}
            classificationLevelListEn={classificationLevelListEn}
            classificationLevelListFr={classificationLevelListFr}
            departmentListEn={departmentListEn}
            departmentListFr={departmentListFr}
            workArrangementListEn={workArrangementListEn}
            workArrangementListFr={workArrangementListFr}
            cityListEn={cityListEn}
            cityListFr={cityListFr}
            languageRequirementListEn={languageRequirementListEn}
            languageRequirementListFr={languageRequirementListFr}
          />
        </div>
      </section>
    );
  }
}
