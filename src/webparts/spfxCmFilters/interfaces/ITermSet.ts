interface Label {
  name: string;
  isDefault: boolean;
  languageTag: string;
}

interface IsAvailableTag {
  isAvailable: boolean;
}

class Term {
  id: string;
  isDeprecated: boolean;
  childrenCount: number;
  createdDateTime: string;
  lastModifiedDateTime: string;
  setId: string;
  labels: Label[];
  descriptions: unknown[];
  isAvailableForTagging: IsAvailableTag[];
}

export interface TermSet {
  "@odata.context": string;
  value: Term[];
}

interface Error {
  code: string;
  message: string;
}

export interface TermSetError {
  error: Error;
}