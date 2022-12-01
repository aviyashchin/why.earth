export const TAG_EMAIL = "EMAIL";
export const TAG_PROBLEM = "PROBLEM";
export const TAG_ATTRIBUTES = "ATTRIBUTES";
export const TAG_ACCESS_TOKEN = "ACCESS_TOKEN";
export const TAG_REFRESH_TOKEN = "REFRESH_TOKEN";

export type Option = {
  id: number;
  image: Promise<string>;
  label: string;
  value: any;
  description: string;
};

export type Attribute = {
  id: number;
  label: string;
  image: Promise<string>;
  value: any;
  description: string;
  options: Array<Option>;
};
