import { filterOptionConfig as filterOptionConfig_Job } from './Job';
import { filterOptionConfig as filterOptionConfig_Resume } from './Resume';
import { filterOptionConfig as filterOptionConfig_BusinessPartner } from './BusinessPartner';
import { filterOptionConfig as filterOptionConfig_SystemEmployee } from './SystemEmployee';
import { filterOptionConfig as filterOptionConfig_JobOpportunities } from './JobOpportunities';
import type { FilterOptionConfig } from '../search/filter';

export const entitiesWithoutFilters: EntityModel.EntityType[] = ['Project'];

export const entityConfigMap = new Map<EntityModel.EntityType, { filterOptionConfig: FilterOptionConfig }>([
  ['Job', { filterOptionConfig: filterOptionConfig_Job }],
  ['Resume', { filterOptionConfig: filterOptionConfig_Resume }],
  ['BusinessPartner', { filterOptionConfig: filterOptionConfig_BusinessPartner }],
  ['SystemEmployee', { filterOptionConfig: filterOptionConfig_SystemEmployee }],
  ['JobOpportunities', { filterOptionConfig: filterOptionConfig_JobOpportunities }]
]);

export const predefineColors = [
  '#6f59f7',
  '#DBAA2C',
  '#40A6E6',
  '#28AAB4',
  '#CE61B1',
  '#EE5E99',
  '#ED927D',
  '#78B960',
  '#6A88F2',
  '#F9795F',
  '#1abc9c',
  '#27ae60',
  '#ec555c',
  '#fc575e',
  '#fcb410'
];
