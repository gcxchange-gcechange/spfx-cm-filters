import { DatePicker, DefaultButton, Dropdown, Icon, IconButton, IDatePickerStyleProps, IDatePickerStyles, IDropdownOption, IStyleFunctionOrObject, PrimaryButton, Stack, useTheme } from "@fluentui/react";
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
  const theme = useTheme();
  const strings = Globals.getStrings();

  const [selectedJobTypes, setSelectedJobTypes] = React.useState<string[]>([]);
  const [selectedProgramAreas, setSelectedProgramAreas] = React.useState<string[]>([]);
  const [applicationDeadline, setApplicationDeadline] = React.useState('');
  const [disableApply, setDisableApply] = React.useState(true);

  let appliedJobTypes: string[] = [];
  let appliedProgramAreas: string[] = [];
  let appliedApplicationDeadline: string = '';

  const chipColor = {
    backgroundColor: theme.palette.themePrimary
  };

  const SetSessionKeys = (): void => {
    const jobTypes = selectedJobTypes.join(',');
    const programAreas = selectedProgramAreas.join(',');

    sessionStorage.setItem(FilterSessionKeys.JobType, jobTypes === undefined ? '' : jobTypes);
    sessionStorage.setItem(FilterSessionKeys.ProgramArea, programAreas === undefined ? '' : programAreas);
    sessionStorage.setItem(FilterSessionKeys.ApplicationDeadline, applicationDeadline);

    appliedJobTypes = [...selectedJobTypes];
    appliedProgramAreas = [...selectedProgramAreas];
    appliedApplicationDeadline = applicationDeadline;
    setDisableApply(true);

    if (Globals.isDebugMode()) {
      console.log('\njobType: ' + jobTypes);
      console.log('programArea: ' + programAreas);
      console.log('applicationDeadline: ' + applicationDeadline);
    }
  }

  const ClearSessionKeys = (): void => {
    sessionStorage.removeItem(FilterSessionKeys.JobType);
    sessionStorage.removeItem(FilterSessionKeys.ProgramArea);
    sessionStorage.removeItem(FilterSessionKeys.ApplicationDeadline);
  }

  const ClearValues = (): void => {
    setSelectedJobTypes([]);
    setSelectedProgramAreas([]);
    setApplicationDeadline(''); 
    ClearSessionKeys();
  }

  const TermChipList = (originalList: IDropdownOption[], selectedTerms: string[], updateFunc: Function, labeledBy: string): JSX.Element => {
    const chips = originalList.filter(term1 =>
      selectedTerms.some(term2 => term2 === term1.key)
    );

    return chips.length > 0 ? (
      <div className={styles.chipContainer}>
        <label aria-labelledby={labeledBy}>
          {strings.selectedFilters}
        </label>
        {chips.map((term, index) => (
          <div className={styles.chip} style={chipColor}>
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
              }}
            >
              <Icon iconName='ChromeClose' />
            </IconButton>
          </div>
        ))}
      </div>
    ) : <></>;
  }

  const DateChip = () => {
    return applicationDeadline ? (
      <div className={styles.chipContainer}>
        <label aria-labelledby='gcx-filter-applicationDeadline-label'>
          {strings.selectedFilters}
        </label>
          <div className={styles.chip} style={chipColor}>
            <span>{applicationDeadline}</span>
            <IconButton
              aria-labelledby='gcx-filter-applicationDeadline-label'
              aria-label={`${strings.remove} ${applicationDeadline}`}
              title={`${strings.remove} ${applicationDeadline}`}
              onClick={() => {
                setApplicationDeadline('');
              }}
            >
              <Icon iconName='ChromeClose' />
            </IconButton>
          </div>
      </div>
    ) : <></>;
  }

  React.useEffect(() => {
    const isMatchJobType = selectedJobTypes.every((val, index) => val === appliedJobTypes[index]);
    const isMatchProgramArea = selectedProgramAreas.every((val, index) => val === appliedProgramAreas[index]);
    const isMatchDeadline = applicationDeadline === appliedApplicationDeadline
    
    setDisableApply(isMatchJobType && isMatchProgramArea && isMatchDeadline);

    const allCleared = selectedJobTypes.length === 0 && selectedProgramAreas.length === 0 && applicationDeadline === '';
    if (allCleared) {
      SetSessionKeys();
    }
  }, [selectedJobTypes, selectedProgramAreas, applicationDeadline]);

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
          {TermChipList(Globals.getLanguage() === Language.French ? props.jobTypeListFr : props.jobTypeListEn, selectedJobTypes, setSelectedJobTypes, 'gcx-filter-jobType-label')}
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
          {DateChip()}
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
          {TermChipList(Globals.getLanguage() === Language.French ? props.programAreaListFr : props.programAreaListEn, selectedProgramAreas, setSelectedProgramAreas, 'gcx-filter-programArea-label')}
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