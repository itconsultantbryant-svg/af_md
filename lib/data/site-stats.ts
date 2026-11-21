export interface SiteStatDefinition {
  key: string;
  label: string;
  value: number;
  prefix: string;
  suffix: string;
  sortOrder: number;
}

/**
 * Default public website statistics. These are seeded into the database and
 * can be edited at any time from Admin → Site Stats.
 */
export const defaultSiteStats: SiteStatDefinition[] = [
  {
    key: "projects_completed",
    label: "Projects Completed",
    value: 6,
    prefix: "",
    suffix: "+",
    sortOrder: 0,
  },
  {
    key: "clients",
    label: "Clients Served",
    value: 10,
    prefix: "",
    suffix: "+",
    sortOrder: 1,
  },
  {
    key: "funds_raised",
    label: "Funds Raised",
    value: 250000,
    prefix: "$",
    suffix: "+",
    sortOrder: 2,
  },
  {
    key: "partners",
    label: "Partners",
    value: 6,
    prefix: "",
    suffix: "",
    sortOrder: 3,
  },
];
