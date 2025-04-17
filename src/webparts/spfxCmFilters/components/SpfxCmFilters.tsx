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
const ProgramAreaCtrl = new SessionController<TermSetResponse>('gcx-cm-programAreaList');

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
    await this.fetchData();
  }

  public async componentDidUpdate(prevProps: Readonly<ISpfxCmFiltersProps>, prevState: Readonly<{}>, snapshot?: any): Promise<void> {
    if (prevProps.language !== this.props.language && (this.props.language === Language.English || this.props.language === Language.French)) {
      this.forceUpdate();
    }
  }

  private fetchData(): void {
    const reactHandler = this;

    try {
      jobTypeCtrl.fetch(() => 
        fetch(`/_api/v2.1/termstore/sets/${Globals.getJobTypeTermSetGuid()}/terms/`, {
          method: 'GET',
          headers: { 'Accept': 'application/json;odata=verbose' }
        }).then(res => res.json())
      ).then((data: TermSetResponse) => {
        data.value.forEach((term) => {
          jobTypeListEn.push({key: term.id, text: term.labels.filter(t => t.languageTag === 'en-US')[0].name});
          jobTypeListFr.push({key: term.id, text: term.labels.filter(t => t.languageTag !== 'en-US')[0].name});
        });
        reactHandler.setState({jobTypeListEn, jobTypeListFr});
      });
    }
    catch (e) {
      console.error(e);
    }

    try {
      ProgramAreaCtrl.fetch(() => 
        fetch(`/_api/v2.1/termstore/sets/${Globals.getProgramAreaTermSetGuid()}/terms/`, {
          method: 'GET',
          headers: { 'Accept': 'application/json;odata=verbose' }
        }).then(res => res.json())
      ).then((data: TermSetResponse) => {
        data.value.forEach((term) => {
          programAreaListEn.push({key: term.id, text: term.labels.filter(t => t.languageTag === 'en-US')[0].name});
          programAreaListFr.push({key: term.id, text: term.labels.filter(t => t.languageTag !== 'en-US')[0].name});
        });
        reactHandler.setState({programAreaListEn, programAreaListFr});
      });
    }
    catch (e) {
      console.error(e);
    }
  }

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
