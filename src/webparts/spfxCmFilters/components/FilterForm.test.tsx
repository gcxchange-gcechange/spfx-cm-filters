import { render, screen } from '@testing-library/react';
import FilterForm from "./FilterForm";
import strings from 'SpfxCmFiltersWebPartStrings';

jest.mock('SpfxCmFiltersWebPartStrings', () => ({
  Filters: 'Filters',
  PropertyPaneDescription: 'Description',
  // ...rest of your mock strings
}));

describe('FilterForm', () => {
  it('renders the component correctly', () => {
    render(
      <FilterForm
        jobTypeListEn={[]}
        jobTypeListFr={[]}
        programAreaListEn={[]}
        programAreaListFr={[]}
      />
    );
    expect(screen.getByText(strings.Filters)).toBeInTheDocument();
  });
});