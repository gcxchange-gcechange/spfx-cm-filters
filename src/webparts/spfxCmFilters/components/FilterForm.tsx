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

  const SetSessionKeys = (): void => {
    const jobTypes = selectedJobTypes.join(',');
    const programAreas = selectedProgramAreas.join(',');

    sessionStorage.setItem(FilterSessionKeys.JobType, jobTypes === undefined ? '' : jobTypes);
    sessionStorage.setItem(FilterSessionKeys.ProgramArea, programAreas === undefined ? '' : programAreas);
    sessionStorage.setItem(FilterSessionKeys.ApplicationDeadline, applicationDeadline);

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

  React.useEffect(() => {
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
            <IconButton
              title={strings.clear}
              aria-labelledby='gcx-filter-jobType-label'
              aria-label={strings.clear}
              className={styles.iconBtn}
              disabled={selectedJobTypes.length === 0}
              onClick={() => {
                setSelectedJobTypes([]);
              }}
            >
              <Icon iconName={'ClearFilter'} />
            </IconButton>
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
        </Stack>

        <Stack className={styles.filter}>
          <Stack horizontal className={styles.label}>
            <label id='gcx-filter-applicationDeadline-label'>
              <b>{strings.applicationDeadline}</b>
            </label>
            <IconButton
              title={strings.clear}
              aria-labelledby='gcx-filter-applicationDeadline-label'
              aria-label={strings.clear}
              className={styles.iconBtn}
              disabled={applicationDeadline === ''}
              onClick={() => {
                setApplicationDeadline('');
              }}
            >
              <Icon iconName={'ClearFilter'} />
            </IconButton>
          </Stack>
          <DatePicker
            styles={datePickerStyles}
            placeholder={strings.datePlaceholder}
            onSelectDate={(date: Date) => {
              setApplicationDeadline(`${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`);
            }}
            value={applicationDeadline ? new Date(applicationDeadline) : undefined}
            minDate={new Date()} 
            highlightSelectedMonth={true}
          />
        </Stack>
  
        <Stack className={styles.filter}>
          <Stack horizontal className={styles.label}>
            <label id='gcx-filter-programArea-label'>
              <b>{strings.programArea}</b>
            </label>
            <IconButton
              title={strings.clear}
              className={styles.iconBtn}
              aria-labelledby='gcx-filter-programArea-label'
              aria-label={strings.clear}
              disabled={selectedProgramAreas.length === 0}
              onClick={() => {
                setSelectedProgramAreas([]);
              }}
            >
              <Icon iconName={'ClearFilter'} />
            </IconButton>
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