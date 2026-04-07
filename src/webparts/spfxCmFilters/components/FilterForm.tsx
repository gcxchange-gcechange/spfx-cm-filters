/* eslint-disable react/jsx-key */
import { ComboBox, DefaultButton, Dropdown, ICalloutContentStyles, IComboBox, IComboBoxOption, IComboBoxStyles, Icon, IconButton, IDropdownOption, IDropdownStyles, PrimaryButton, Stack } from "@fluentui/react";
import * as React from "react";
import { Globals, Language } from "../Globals";
import styles from './SpfxCmFilters.module.scss';
import { IChipItem } from "../interfaces/IChipItem";

export interface ISearchFormProps {
  jobTypeListEn: IDropdownOption[];
  jobTypeListFr: IDropdownOption[];
  classificationCodeListEn: IDropdownOption[];
  classificationCodeListFr: IDropdownOption[];
  classificationLevelListEn: IDropdownOption[];
  classificationLevelListFr: IDropdownOption[];
  departmentListEn: IDropdownOption[];
  departmentListFr: IDropdownOption[];
  workArrangementListEn: IDropdownOption[];
  workArrangementListFr: IDropdownOption[];
  cityListEn: IDropdownOption[];
  cityListFr: IDropdownOption[];
  languageRequirementListEn: IDropdownOption[];
  languageRequirementListFr: IDropdownOption[];
}

export enum FilterSessionKeys {
  Initialized = 'gcx-cm-filter-init',
  JobType = 'gcx-cm-filter-jobType',
  ClassificationCode = 'gcx-cm-filter-classificationCode',
  ClassificationLevel = 'gcx-cm-filter-clasificationLevel',
  Department = 'gcx-cm-filter-department',
  WorkArrangement = 'gcx-cm-filter-workArrangement',
  City = 'gcx-cm-filter-city',
  LanguageRequirement = 'gcx-cm-filter-languageRequirement'
}

const FilterForm = (props: ISearchFormProps): JSX.Element => {
  const strings = Globals.getStrings();

  const [selectedJobTypes, setSelectedJobTypes] = React.useState<string[]>([]);
  const [selectedClassificationCodes, setSelectedClassificationCodes] = React.useState<string[]>([]);
  const [selectedClassificationLevels, setSelectedClassificationLevels] = React.useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>([]);
  const [selectedWorkArrangements, setSelectedWorkArrangements] = React.useState<string[]>([]);
  const [selectedCities, setSelectedCities] = React.useState<string[]>([]);
  const [selectedLanguageRequirements, setSelectedLanguageRequirements] = React.useState<string>('');

  const [disableApply, setDisableApply] = React.useState(true);

  const appliedJobTypes = React.useRef<string[]>([]);
  const appliedClassificationCodes = React.useRef<string[]>([]);
  const appliedClassificationLevels = React.useRef<string[]>([]);
  const appliedDepartments = React.useRef<string[]>([]);
  const appliedWorkArrangements = React.useRef<string[]>([]);
  const appliedCities = React.useRef<string[]>([]);
  const appliedLanguageRequirements = React.useRef<string>();

  const SetSessionKeys = (): void => {
    const jobTypes = selectedJobTypes.join(',');
    const classificationCodes = selectedClassificationCodes.join(',');
    const classificationLevels = selectedClassificationLevels.join(',');
    const departments = selectedDepartments.join(',');
    const workArrangements = selectedWorkArrangements.join(',');
    const cities = selectedCities.join(',');
    const languageRequirements = selectedLanguageRequirements;

    sessionStorage.setItem(FilterSessionKeys.JobType, jobTypes === undefined ? '' : jobTypes);
    sessionStorage.setItem(FilterSessionKeys.ClassificationCode, classificationCodes === undefined ? '' : classificationCodes);
    sessionStorage.setItem(FilterSessionKeys.ClassificationLevel, classificationLevels === undefined ? '' : classificationLevels);
    sessionStorage.setItem(FilterSessionKeys.Department, departments === undefined ? '' : departments);
    sessionStorage.setItem(FilterSessionKeys.WorkArrangement, workArrangements === undefined ? '' : workArrangements);
    sessionStorage.setItem(FilterSessionKeys.City, cities === undefined ? '' : cities);
    sessionStorage.setItem(FilterSessionKeys.LanguageRequirement, languageRequirements === undefined ? '' : languageRequirements);

    appliedJobTypes.current = [...selectedJobTypes];
    appliedClassificationCodes.current = [...selectedClassificationCodes];
    appliedClassificationLevels.current = [...selectedClassificationLevels];
    appliedDepartments.current = [...selectedDepartments];
    appliedWorkArrangements.current = [...selectedWorkArrangements];
    appliedCities.current = [...selectedCities];
    appliedLanguageRequirements.current = selectedLanguageRequirements;

    setDisableApply(true);

    if (Globals.isDebugMode()) {
      console.log('\nJobTypes: ' + jobTypes);
      console.log('ClassificationCodes: ' + classificationCodes);
      console.log('ClassificationLevels: ' + classificationLevels);
      console.log('Departments: ' + departments);
      console.log('WorkArrangements: ' + workArrangements);
      console.log('Cities: ' + cities);
      console.log('LanguageRequirements: ' + languageRequirements);
    }
  }

  const ClearValues = (): void => {
    appliedJobTypes.current = [];
    appliedClassificationCodes.current = [];
    appliedClassificationLevels.current = [];
    appliedDepartments.current = [];
    appliedWorkArrangements.current = [];
    appliedCities.current = [];
    appliedLanguageRequirements.current = '';

    setSelectedJobTypes([]);
    setSelectedClassificationCodes([]);
    setSelectedClassificationLevels([]);
    setSelectedDepartments([]);
    setSelectedWorkArrangements([]);
    setSelectedCities([]);
    setSelectedLanguageRequirements('');
  }

  React.useEffect(() => {
    sessionStorage.setItem(FilterSessionKeys.Initialized, 'true');

    if (Globals.isDebugMode())
      console.log(`${FilterSessionKeys.Initialized}: ${sessionStorage.getItem(FilterSessionKeys.Initialized)}`);

    return () => {
      sessionStorage.removeItem(FilterSessionKeys.Initialized);
    };
  }, []);

  React.useEffect(() => {
    const isMatchJobType = selectedJobTypes.length === appliedJobTypes.current.length &&
      selectedJobTypes.every(val => appliedJobTypes.current.indexOf(val) !== -1);

    const isMatchClassificationCodes = selectedClassificationCodes.length === appliedClassificationCodes.current.length &&
      selectedClassificationCodes.every(val => appliedClassificationCodes.current.indexOf(val) !== -1);

    const isMatchClassificationLevels = selectedClassificationLevels.length === appliedClassificationLevels.current.length &&
      selectedClassificationLevels.every(val => appliedClassificationLevels.current.indexOf(val) !== -1);

    const isMatchDepartments = selectedDepartments.length === appliedDepartments.current.length &&
      selectedDepartments.every(val => appliedDepartments.current.indexOf(val) !== -1);

    const isMatchWorkArrangements = selectedWorkArrangements.length === appliedWorkArrangements.current.length &&
      selectedWorkArrangements.every(val => appliedWorkArrangements.current.indexOf(val) !== -1);

    const isMatchCities = selectedCities.length === appliedCities.current.length &&
      selectedCities.every(val => appliedCities.current.indexOf(val) !== -1);

    const isMatchLanguageRequirements = selectedLanguageRequirements === appliedLanguageRequirements.current;

    const selectedMatchesApplied = isMatchJobType 
    && isMatchClassificationCodes
    && isMatchClassificationLevels
    && isMatchDepartments
    && isMatchWorkArrangements
    && isMatchCities
    && isMatchLanguageRequirements;
    
    setDisableApply(selectedMatchesApplied);

    const allCleared = selectedJobTypes.length === 0 
    && selectedClassificationCodes.length === 0
    && selectedClassificationLevels.length === 0
    && selectedDepartments.length === 0
    && selectedWorkArrangements.length === 0
    && selectedCities.length === 0
    && selectedLanguageRequirements === '';

    if (allCleared && selectedMatchesApplied) {
      SetSessionKeys();
    }
  }, [selectedJobTypes, 
      selectedClassificationCodes, 
      selectedClassificationLevels,
      selectedDepartments,
      selectedWorkArrangements,
      selectedCities,
      selectedLanguageRequirements
     ]);

  const getAllSelectedChips = (): IChipItem[] => {
    const jobTypeOptions = Globals.getLanguage() === Language.French ? props.jobTypeListFr : props.jobTypeListEn;
    const jobTypeChips = jobTypeOptions
    .filter(opt => selectedJobTypes.indexOf(opt.key as string) !== -1)
    .map(opt => ({
      key: opt.key as string,
      text: opt.text,
      source: strings.jobType
    }));

    const classificationOptions = Globals.getLanguage() === Language.French ? props.classificationCodeListFr : props.classificationCodeListEn;
    const classificationChips = classificationOptions
    .filter(opt => selectedClassificationCodes.indexOf(opt.key as string) !== -1)
    .map(opt => ({
      key: opt.key as string,
      text: opt.text,
      source: strings.classification
    }));

    const classificationLevelOptions = Globals.getLanguage() === Language.French ? props.classificationLevelListFr : props.classificationLevelListEn;
    const classificationLevelChips = classificationLevelOptions
    .filter(opt => selectedClassificationLevels.indexOf(opt.key as string) !== -1)
    .map(opt => ({
      key: opt.key as string,
      text: opt.text,
      source: strings.classificationLevel
    }));

    const departmentOptions = Globals.getLanguage() === Language.French ? props.departmentListFr : props.departmentListEn;
    const departmentChips = departmentOptions
    .filter(opt => selectedDepartments.indexOf(opt.key as string) !== -1)
    .map(opt => ({
      key: opt.key as string,
      text: opt.text,
      source: strings.department
    }));

    const workArrangementOptions = Globals.getLanguage() === Language.French ? props.workArrangementListFr : props.workArrangementListEn;
    const workArrangementChips = workArrangementOptions
    .filter(opt => selectedWorkArrangements.indexOf(opt.key as string) !== -1)
    .map(opt => ({
      key: opt.key as string,
      text: opt.text,
      source: strings.workArrangement
    }));

    const cityOptions = Globals.getLanguage() === Language.French ? props.cityListFr : props.cityListEn;
    const cityChips = cityOptions
    .filter(opt => selectedCities.indexOf(opt.key as string) !== -1)
    .map(opt => ({
      key: opt.key as string,
      text: opt.text,
      source: strings.city
    }));

    const languageRequirementOptions = Globals.getLanguage() === Language.French ? props.languageRequirementListFr : props.languageRequirementListEn;
    const languageRequirementChips = languageRequirementOptions
    .filter(opt => selectedLanguageRequirements === opt.key)
    .map(opt => ({
      key: opt.key as string,
      text: opt.text,
      source: strings.languageRequirement
    }));

    return [...jobTypeChips, ...classificationChips, ...classificationLevelChips, ...departmentChips, ...workArrangementChips, ...cityChips, ...languageRequirementChips];
  };

  const SelectedChipList = (): JSX.Element => {
    const chips = getAllSelectedChips();

    if (chips.length === 0) return <></>;
    
    return (
      <div className={styles.chipContainer}>
        {chips.map((chip) => (
          <div className={styles.chip} key={`${chip.source}-${chip.key}`}>
            <span>{chip.source}: {chip.text}</span>
            <IconButton
              aria-label={`${strings.remove} ${chip.source}: ${chip.text}`}
              title={`${strings.remove} ${chip.source}: ${chip.text}`}
              onClick={() => {
                if (chip.source === strings.jobType) {
                  setSelectedJobTypes(prev =>
                    prev.filter(k => k !== chip.key)
                  );
                } else if (chip.source === strings.classification) {
                  setSelectedClassificationCodes(prev =>
                    prev.filter(k => k !== chip.key)
                  );
                } else if (chip.source === strings.classificationLevel) {
                  setSelectedClassificationLevels(prev =>
                    prev.filter(k => k !== chip.key)
                  );
                } else if (chip.source === strings.department) {
                  setSelectedDepartments(prev =>
                    prev.filter(k => k !== chip.key)
                  );
                } else if (chip.source === strings.workArrangement) {
                  setSelectedWorkArrangements(prev =>
                    prev.filter(k => k !== chip.key)
                  );
                } else if (chip.source === strings.city) {
                  setSelectedCities(prev =>
                    prev.filter(k => k !== chip.key)
                  );
                } else if (chip.source === strings.languageRequirement) {
                  setSelectedLanguageRequirements('');
                }

                setDisableApply(false);
              }}
            >
              <Icon iconName='ChromeClose' />
            </IconButton>
          </div>
        ))}
      </div>
    );
  };

  const borderColor: string = '#c2c2c2';
  const calloutStyles: Partial<ICalloutContentStyles> = {
    root: {
      minWidth: 'fit-content',
    },
    calloutMain: {
      width: 'fit-content',
      minWidth: '100%',
      maxWidth: 'none'
    },
  };

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: {
      width: '100%'
    },
    title: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    dropdownItem: {
      whiteSpace: 'normal',
      wordBreak: 'break-word'
    },
    dropdownItemsWrapper: {
      minWidth: '100%'
    }
  };

  const comboBoxStyles: Partial<IComboBoxStyles> = {
    root: {
      selectors: {
        '::after': {
          borderColor: borderColor,
        },
      },
    },
    rootHovered: {
      selectors: {
        '::after': {
          borderColor: 'rgb(50, 49, 48)',
        },
      },
    },
    rootFocused: {
      selectors: {
        '::after': {
          borderColor: 'rgb(3, 120, 124)',
        },
      },
    }
  }

  const CalcComponentWidth = (numberOfItems: number, gap: number = 10): React.CSSProperties => {
    gap = numberOfItems <= 1 ? 0 : gap;
    return {
      width: `calc((100% - ${gap}px) / ${numberOfItems}`,
      maxWidth: `calc((100% - ${gap}px) / ${numberOfItems}`
    }
  }

  const disabledClearFilter = (
    selectedJobTypes.length + 
    selectedClassificationCodes.length + 
    selectedClassificationLevels.length + 
    selectedDepartments.length + 
    selectedWorkArrangements.length 
    + selectedCities.length 
    + selectedLanguageRequirements.length
  ) === 0;

  return (
    <>
    <form id="gcx-cm-filter-form">
      <Stack className={styles.filterRow}>

        {/* OPPORTUNITY DETAILS */}
        <Stack className={styles.filter} role='group' aria-labelledby='gcx-filter-opportunityDetails-label'>
          <Stack horizontal className={styles.label}>
            <div id='gcx-filter-opportunityDetails-label'>
              <b>{strings.opportunityDetails}</b>
            </div>
          </Stack>

          <div className={styles.row}>
            <div style={CalcComponentWidth(4)}>
              <Dropdown 
                id='ddJobTypeFilter' 
                aria-labelledby={strings.jobType}
                placeholder={strings.jobType}
                styles={{
                  ...dropdownStyles,
                  title: { borderColor: borderColor }
                }} 
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
                calloutProps={{styles: calloutStyles}}
              />
            </div>
            <div style={CalcComponentWidth(4)}>
              <ComboBox 
                id='ddClassificationCodeFilter' 
                aria-label={strings.classification}
                placeholder={strings.classification}
                styles={comboBoxStyles}
                options={Globals.getLanguage() === Language.French ? props.classificationCodeListFr : props.classificationCodeListEn} 
                onChange={(e: React.FormEvent<IComboBox>, option?: IComboBoxOption) => {
                  if (!option) return;

                  const newSelectedKeys = option.selected
                    ? [...selectedClassificationCodes, option.key as string]
                    : selectedClassificationCodes.filter(key => key !== option.key);

                  setSelectedClassificationCodes(newSelectedKeys);
                  (e.target as HTMLElement)?.blur();
                }}
                selectedKey={selectedClassificationCodes}
                multiSelect={true}
                autoComplete="on"
                calloutProps={{styles: calloutStyles}}
              />
            </div>
            <div style={CalcComponentWidth(4)}>
              <Dropdown 
                id='ddClassificationLevelFilter' 
                aria-labelledby={strings.classificationLevel}
                placeholder={strings.classificationLevel}
                styles={{
                  ...dropdownStyles,
                  title: { borderColor: borderColor }
                }} 
                options={Globals.getLanguage() === Language.French ? props.classificationLevelListFr : props.classificationLevelListEn} 
                onChange={(e: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => { 
                  if (!option) return;
      
                  const newSelectedKeys = option.selected
                    ? [...selectedClassificationLevels, option.key] as string[] 
                    : selectedClassificationLevels.filter(key => key !== option.key);
      
                  setSelectedClassificationLevels(newSelectedKeys);
                }}
                selectedKeys={selectedClassificationLevels}
                multiSelect={true}
                calloutProps={{styles: calloutStyles}}
              />
            </div>
            <div style={CalcComponentWidth(4)}>
              <ComboBox 
                id='ddDepartmentFilter' 
                aria-label={strings.department}
                placeholder={strings.department}
                styles={comboBoxStyles} 
                options={Globals.getLanguage() === Language.French ? props.departmentListFr : props.departmentListEn} 
                onChange={(e: React.FormEvent<IComboBox>, option?: IComboBoxOption) => {
                  if (!option) return;

                  const newSelectedKeys = option.selected
                    ? [...selectedDepartments, option.key as string]
                    : selectedDepartments.filter(key => key !== option.key);

                  setSelectedDepartments(newSelectedKeys);
                  (e.target as HTMLElement)?.blur();
                }}
                selectedKey={selectedDepartments}
                multiSelect={true}
                autoComplete="on"
                calloutProps={{styles: calloutStyles}}
              />
            </div>
          </div>
        </Stack>

        {/* LOCATION */}
        <Stack className={styles.filter} role='group' aria-labelledby='gcx-filter-location-label'>
          <Stack horizontal className={styles.label}>
            <div id='gcx-filter-location-label'>
              <b>{strings.location}</b>
            </div>
          </Stack>

          <div className={styles.row}>
            <div style={CalcComponentWidth(2)}>
              <Dropdown 
                id='ddWorkArrangementFilter' 
                aria-label={strings.workArrangement}
                placeholder={strings.workArrangement}
                styles={{
                  ...dropdownStyles,
                  title: { borderColor: borderColor }
                }} 
                options={Globals.getLanguage() === Language.French ? props.workArrangementListFr : props.workArrangementListEn} 
                onChange={(e: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => { 
                  if (!option) return;
      
                  const newSelectedKeys = option.selected
                    ? [...selectedWorkArrangements, option.key] as string[] 
                    : selectedWorkArrangements.filter(key => key !== option.key);
      
                  setSelectedWorkArrangements(newSelectedKeys);
                }}
                selectedKeys={selectedWorkArrangements}
                multiSelect={true}
                calloutProps={{styles: calloutStyles}}
              />
            </div>
            <div style={CalcComponentWidth(2)}>
              <ComboBox 
                id='ddCityFilter' 
                aria-label={strings.city}
                placeholder={strings.city}
                styles={comboBoxStyles}
                options={Globals.getLanguage() === Language.French ? props.cityListFr : props.cityListEn} 
                onChange={(e: React.FormEvent<IComboBox>, option?: IComboBoxOption) => {
                  if (!option) return;

                  const newSelectedKeys = option.selected
                    ? [...selectedCities, option.key as string]
                    : selectedCities.filter(key => key !== option.key);

                  setSelectedCities(newSelectedKeys);
                  (e.target as HTMLElement)?.blur();
                }}
                selectedKey={selectedCities}
                multiSelect={true}
                autoComplete="on"
                calloutProps={{styles: calloutStyles}}
              />
            </div>
          </div>
        </Stack>

        {/* REQUIREMENTS */}
        <Stack className={styles.filter} role='group' aria-labelledby='gcx-filter-requirements-label'>
          <Stack horizontal className={styles.label}>
            <div id='gcx-filter-requirements-label'>
              <b>{strings.requirements}</b>
            </div>
          </Stack>

          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <Stack grow styles={{ root: { minWidth: 0 } }}>
              <Dropdown 
                id='ddLanguageRequirementsFilter' 
                aria-label={strings.languageRequirement}
                placeholder={strings.languageRequirement}
                styles={{
                  ...dropdownStyles,
                  title: { borderColor: borderColor }
                }} 
                options={Globals.getLanguage() === Language.French ? props.languageRequirementListFr : props.languageRequirementListEn} 
                onChange={(e: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => { 
                  if (!option) return;

                  setSelectedLanguageRequirements(option.key ? option.key as string : '');
                }}
                selectedKey={selectedLanguageRequirements}
                multiSelect={false}
                calloutProps={{styles: calloutStyles}}
              />
            </Stack>
          </Stack>
        </Stack>

        {/* CHIP LIST */}
        <div className={styles.chipContainer}>
            <SelectedChipList />
        </div>
      </Stack>

      <Stack className={styles.controls}>
        <DefaultButton
          id='gcx-cm-filter-clear'
          aria-describedby='gcx-cm-filter-title'
          aria-label={strings.clear}
          disabled={disabledClearFilter}
          onClick={() => {
            ClearValues();
          }}
        >
          {strings.clear}
        </DefaultButton>
  
        <PrimaryButton
          id='gcx-cm-filter-apply'
          aria-describedby='gcx-cm-filter-title'
          aria-label={strings.apply}
          disabled={disableApply}
          onClick={() => {
            SetSessionKeys();
          }}
        >
          {strings.apply}
        </PrimaryButton>
      </Stack>
    </form>
    </>
  );
}

export default FilterForm;