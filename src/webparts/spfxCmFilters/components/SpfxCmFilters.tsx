import * as React from 'react';
import styles from './SpfxCmFilters.module.scss';
import type { ISpfxCmFiltersProps } from './ISpfxCmFiltersProps';
import { Globals, Language } from '../Globals';
import { IDropdownOption } from '@fluentui/react';
import FilterForm from './FilterForm';
import { SessionController } from '../SessionController';
import { TermSet, TermSetError } from '../interfaces/ITermSet';

const jobTypeListEn: IDropdownOption[] = [];
const jobTypeListFr: IDropdownOption[] = [];
const programAreaListEn: IDropdownOption[] = [];
const programAreaListFr: IDropdownOption[] = [];

const jobTypeCtrl = new SessionController<TermSet | TermSetError>('gcx-cm-jobTypeList');
const programAreaCtrl = new SessionController<TermSet | TermSetError>('gcx-cm-programAreaList');

export default class SpfxCmFilters extends React.Component<ISpfxCmFiltersProps> {
  strings = Globals.getStrings();

  public constructor(props: ISpfxCmFiltersProps, state: ISpfxCmFiltersProps){ 
    super(props); 
    this.state = { 
    };
  }

  public async componentDidMount(): Promise<void>
  {
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

      this.setState({jobTypeListEn, jobTypeListFr});
    }

    const programAreaResponse = await programAreaCtrl.fetch(this.getProgramAreaTerms);
    if (programAreaResponse && !(programAreaResponse as TermSetError).error) {
      programAreaListEn.length = 0;
      programAreaListFr.length = 0;

      (programAreaResponse as TermSet).value.forEach((term) => {
        if (!term.isDeprecated) {
          programAreaListEn.push({key: term.id, text: term.labels.filter(t => t.languageTag === 'en-US')[0].name});
          programAreaListFr.push({key: term.id, text: term.labels.filter(t => t.languageTag !== 'en-US')[0].name});
        } else if (Globals.isDebugMode() ) {
          console.log('The following term is deprecated and will not be added to the ProgramArea list:', term);
        }
      });

      this.setState({programAreaListEn, programAreaListFr});
    }
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

  private getProgramAreaTerms = async (): Promise<TermSet> => {
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
