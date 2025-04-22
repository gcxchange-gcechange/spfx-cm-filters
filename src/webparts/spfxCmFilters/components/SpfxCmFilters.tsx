import * as React from 'react';
import styles from './SpfxCmFilters.module.scss';
import type { ISpfxCmFiltersProps } from './ISpfxCmFiltersProps';
import { Globals, Language, TermSetResponse } from '../Globals';
import { IDropdownOption } from '@fluentui/react';
import FilterForm from './FilterForm';
import { SessionController } from '../SessionController';

const jobTypeListEn: IDropdownOption[] = [];
const jobTypeListFr: IDropdownOption[] = [];
const programAreaListEn: IDropdownOption[] = [];
const programAreaListFr: IDropdownOption[] = [];

const jobTypeCtrl = new SessionController<TermSetResponse>('gcx-cm-jobTypeList');
const programAreaCtrl = new SessionController<TermSetResponse>('gcx-cm-programAreaList');

export default class SpfxCmFilters extends React.Component<ISpfxCmFiltersProps> {
  strings = Globals.getStrings();
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
    const jobTypeResponse = await jobTypeCtrl.fetch(this.getJobTypeTerms);
    if (jobTypeResponse) {
      jobTypeResponse.value.forEach((term) => {
        jobTypeListEn.push({key: term.id, text: term.labels.filter(t => t.languageTag === 'en-US')[0].name});
        jobTypeListFr.push({key: term.id, text: term.labels.filter(t => t.languageTag !== 'en-US')[0].name});
      });
      this.setState({jobTypeListEn, jobTypeListFr});
    }

    const programAreaResponse = await programAreaCtrl.fetch(this.getProgramAreaTerms);
    if (programAreaResponse) {
      programAreaResponse.value.forEach((term) => {
        programAreaListEn.push({key: term.id, text: term.labels.filter(t => t.languageTag === 'en-US')[0].name});
        programAreaListFr.push({key: term.id, text: term.labels.filter(t => t.languageTag !== 'en-US')[0].name});
      });
      this.setState({programAreaListEn, programAreaListFr});
    }
  }

  public async componentDidUpdate(prevProps: Readonly<ISpfxCmFiltersProps>, prevState: Readonly<{}>, snapshot?: unknown): Promise<void> {
    if (prevProps.language !== this.props.language && (this.props.language === Language.English || this.props.language === Language.French)) {
      this.forceUpdate();
    }
  }

  private getJobTypeTerms = async (): Promise<TermSetResponse> => {
    const response = await fetch(`/_api/v2.1/termstore/sets/${Globals.getJobTypeTermSetGuid()}/terms/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json;odata=verbose' }
    });
  
    return await response.json();
  };

  private getProgramAreaTerms = async (): Promise<TermSetResponse> => {
    const response = await fetch(`/_api/v2.1/termstore/sets/${Globals.getProgramAreaTermSetGuid()}/terms/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json;odata=verbose' }
    });
  
    return await response.json();
  };

  public render(): React.ReactElement<ISpfxCmFiltersProps> {
    const {
      hasTeamsContext
    } = this.props;

    return (
      <section className={`${styles.spfxCmFilters} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.filtersHeader}>
          <h2 id='gcx-cm-filter-title'>
            {this.strings.Filters}
          </h2>
        </div>
        <FilterForm
          jobTypeListEn={jobTypeListEn}
          jobTypeListFr={jobTypeListFr}
          programAreaListEn={programAreaListEn}
          programAreaListFr={programAreaListFr}
        />
      </section>
    );
  }
}
