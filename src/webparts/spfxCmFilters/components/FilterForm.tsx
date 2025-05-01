/* eslint-disable react/jsx-key */
import { DatePicker, DefaultButton, Dropdown, Icon, IconButton, IDatePickerStyleProps, IDatePickerStyles, IDropdownOption, IStyleFunctionOrObject, PrimaryButton, Stack } from "@fluentui/react";
import * as React from "react";
import { Globals, Language } from "../Globals";
import styles from './SpfxCmFilters.module.scss';

export interface ISearchFormProps {
  jobTypeListEn: IDropdownOption[];
  jobTypeListFr: IDropdownOption[];
  programAreaListEn: IDropdownOption[];
  programAreaListFr: IDropdownOption[];
}

export enum FilterSessionKeys {
  JobType = 'gcx-cm-filter-jobType',
  ProgramArea = 'gcx-cm-filter-programArea',
  ApplicationDeadline = 'gcx-cm-filter-applicationDeadline'
}

const FilterForm = (props: ISearchFormProps): JSX.Element => {
  const strings = Globals.getStrings();

  const [selectedJobTypes, setSelectedJobTypes] = React.useState<string[]>([]);
  const [selectedProgramAreas, setSelectedProgramAreas] = React.useState<string[]>([]);
  const [applicationDeadline, setApplicationDeadline] = React.useState('');
  const [disableApply, setDisableApply] = React.useState(true);

  const appliedJobTypes = React.useRef<string[]>([]);
  const appliedProgramAreas = React.useRef<string[]>([]);
  const appliedApplicationDeadline = React.useRef<string>('');

  const SetSessionKeys = (): void => {
    const jobTypes = selectedJobTypes.join(',');
    const programAreas = selectedProgramAreas.join(',');

    sessionStorage.setItem(FilterSessionKeys.JobType, jobTypes === undefined ? '' : jobTypes);
    sessionStorage.setItem(FilterSessionKeys.ProgramArea, programAreas === undefined ? '' : programAreas);
    sessionStorage.setItem(FilterSessionKeys.ApplicationDeadline, applicationDeadline);

    appliedJobTypes.current = [...selectedJobTypes];
    appliedProgramAreas.current = [...selectedProgramAreas];
    appliedApplicationDeadline.current = applicationDeadline;

    setDisableApply(true);

    if (Globals.isDebugMode()) {
      console.log('\njobType: ' + jobTypes);
      console.log('programArea: ' + programAreas);
      console.log('applicationDeadline: ' + applicationDeadline);
    }
  }

  const ClearValues = (): void => {
    appliedJobTypes.current = [];
    appliedProgramAreas.current = [];
    appliedApplicationDeadline.current = '';

    setSelectedJobTypes([]);
    setSelectedProgramAreas([]);
    setApplicationDeadline(''); 
  }

  React.useEffect(() => {
    const isMatchJobType = selectedJobTypes.length === appliedJobTypes.current.length &&
      selectedJobTypes.every(val => appliedJobTypes.current.indexOf(val) !== -1)
  
    const isMatchProgramArea = selectedProgramAreas.length === appliedProgramAreas.current.length &&
      selectedProgramAreas.every(val => appliedProgramAreas.current.indexOf(val) !== -1)

    const isMatchDeadline = applicationDeadline === appliedApplicationDeadline.current;

    const selectedMatchesApplied = isMatchJobType && isMatchProgramArea && isMatchDeadline;
    
    setDisableApply(selectedMatchesApplied);

    const allCleared = selectedJobTypes.length === 0 && selectedProgramAreas.length === 0 && applicationDeadline === '';
    if (allCleared && selectedMatchesApplied) {
      SetSessionKeys();
    }
  }, [selectedJobTypes, selectedProgramAreas, applicationDeadline]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const TermChipList = (originalList: IDropdownOption[], selectedTerms: string[], updateFunc: Function, label: string, labeledBy: string): JSX.Element => {
    const chips = originalList.filter(term1 =>
      selectedTerms.some(term2 => term2 === term1.key)
    );

    return chips.length > 0 ? (
      <div className={styles.chipContainer}>
        <label aria-labelledby={labeledBy}>
          {label}
        </label>
        {chips.map((term, index) => (
          <div className={styles.chip}>
            <span>{term.text}</span>
            <IconButton
              aria-labelledby={labeledBy}
              aria-label={`${strings.remove} ${term.text}`}
              title={`${strings.remove} ${term.text}`}
              onClick={() => {
                const updatedList = selectedTerms.filter(
                  item => item !== term.key
                );
                updateFunc(updatedList);
                setDisableApply(false);
              }}
            >
              <Icon iconName='ChromeClose' />
            </IconButton>
          </div>
        ))}
      </div>
    ) : <></>;
  }

  const borderColor: string = '#c2c2c2';
  const datePickerStyles: IStyleFunctionOrObject<IDatePickerStyleProps, IDatePickerStyles> = {
    textField: {
      '& .ms-TextField-fieldGroup': {
        borderColor: borderColor
      },
    }
  };

  return (
    <>
    <div>
      <Stack className={styles.filterRow}>

        <Stack className={styles.filter}>
          <Stack horizontal className={styles.label}>
            <label id='gcx-filter-jobType-label'>
              <b>{strings.jobType}</b>
            </label>
          </Stack>
          <Dropdown 
            id='ddJobTypeFilter' 
            aria-labelledby='gcx-filter-jobType-label'
            styles={{title: { borderColor: borderColor }}} 
            placeholder={strings.optionPlaceholder}
            options={Globals.getLanguage() === Language.French ? props.jobTypeListFr : props.jobTypeListEn} 
            onChange={(e: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => { 
              if (!option) return;
  
              const newSelectedKeys = option.selected
                ? [...selectedJobTypes, option.key] as string[] 
                : selectedJobTypes.filter(key => key !== option.key);
  
              setSelectedJobTypes(newSelectedKeys);
            }}
            selectedKeys={selectedJobTypes}
            multiSelect={true}
          />
          {TermChipList(Globals.getLanguage() === Language.French ? props.jobTypeListFr : props.jobTypeListEn, selectedJobTypes, setSelectedJobTypes, strings.selectedJobTypes, 'gcx-filter-jobType-label')}
        </Stack>
  
        <Stack className={styles.filter}>
          <Stack horizontal className={styles.label}>
            <label id='gcx-filter-programArea-label'>
              <b>{strings.programArea}</b>
            </label>
          </Stack>
          <Dropdown 
            id='ddProgramAreaFilter' 
            aria-labelledby='gcx-filter-programArea-label'
            styles={{title: { borderColor: borderColor }}} 
            placeholder={strings.optionPlaceholder}
            options={Globals.getLanguage() === Language.French ? props.programAreaListFr : props.programAreaListEn} 
            onChange={(e: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => { 
              if (!option) return;
  
              const newSelectedKeys = option.selected
                ? [...selectedProgramAreas, option.key] as string[] 
                : selectedProgramAreas.filter(key => key !== option.key);
  
              setSelectedProgramAreas(newSelectedKeys);
            }}
            selectedKeys={selectedProgramAreas}
            multiSelect={true}
          />
          {TermChipList(Globals.getLanguage() === Language.French ? props.programAreaListFr : props.programAreaListEn, selectedProgramAreas, setSelectedProgramAreas, strings.selectedProgramAreas, 'gcx-filter-programArea-label')}
        </Stack>

        <Stack className={styles.filter}>
          <Stack horizontal className={styles.label}>
            <label id='gcx-filter-applicationDeadline-label'>
              <b>{strings.applicationDeadline}</b>
            </label>
          </Stack>
          <DatePicker
            styles={datePickerStyles}
            placeholder={strings.datePlaceholder}
            onSelectDate={(date: Date) => {
              // The format of this date is important
              setApplicationDeadline(`${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`);
            }}
            value={applicationDeadline ? new Date(applicationDeadline) : undefined}
            minDate={new Date()} 
            highlightSelectedMonth={true}
          />
        </Stack>

      </Stack>

      <Stack className={styles.controls}>
        <DefaultButton
          id='gcx-cm-filter-clear'
          aria-labelledby='gcx-cm-filter-title'
          aria-label={strings.clear}
          disabled={selectedJobTypes.length === 0 && selectedProgramAreas.length === 0 && applicationDeadline === ''}
          onClick={() => {
            ClearValues();
          }}
        >
          {strings.clear}
        </DefaultButton>
  
        <PrimaryButton
          id='gcx-cm-filter-apply'
          aria-labelledby='gcx-cm-filter-title'
          aria-label={strings.apply}
          disabled={disableApply}
          onClick={() => {
            SetSessionKeys();
          }}
        >
          {strings.apply}
        </PrimaryButton>
      </Stack>
    </div>
    </>
  );
}

export default FilterForm;