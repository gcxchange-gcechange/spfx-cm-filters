import * as React from 'react';
import styles from './SpfxCmFilters.module.scss';
import type { ISpfxCmFiltersProps } from './ISpfxCmFiltersProps';
import { Globals, Language } from '../Globals';
import { IDropdownOption } from '@fluentui/react';
import FilterForm from './FilterForm';
//import { SessionController } from '../SessionCOntroller';

const jobTypeListEn: IDropdownOption[] = [];
const jobTypeListFr: IDropdownOption[] = [];
const programAreaListEn: IDropdownOption[] = [];
const programAreaListFr: IDropdownOption[] = [];

//const jobTypeCtrl = new SessionController<unknown[]>('gcx-cm-jobTypeList');
//const ProgramAreaCtrl = new SessionController<unknown[]>('gcx-cm-programAreaList');

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
    // TODO

    jobTypeListEn.push({key: '0', text: 'Assignments'});
    jobTypeListEn.push({key: '1', text: 'Deployments'});
    jobTypeListEn.push({key: '2', text: 'Mentoring'});
    jobTypeListEn.push({key: '3', text: 'Secondments'});

    programAreaListEn.push({key: '0', text: 'Administration'});
    programAreaListEn.push({key: '1', text: 'Information Technology'});
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
