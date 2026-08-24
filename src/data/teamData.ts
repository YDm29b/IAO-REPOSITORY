import { TeamMember } from '../types';

/**
 * IAO Team Data Placeholder Slots
 * 
 * TODO: Replace with approved staff names, official titles, and biographies
 * provided by the IST Astronomical Observatory administration.
 */
export const OBSERVATORY_HEAD: TeamMember = {
  id: 'observatory-head',
  name: 'Yawar Abbas',
  role: 'In Charge of IST Astronomical Observatory',
  isHead: true,
  department: 'Research Associate, Space & Education Research Lab (SERL), NCGSA',
  bio: 'In Charge of IAO and conducts guided observation sessions including telescope operations.',
  avatarPlaceholder: 'observatory_head_placeholder.jpg',
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-member-1',
    name: 'Muhammad Junaid',
    role: 'Graduate Research Assistant',
    department: 'Space & Astrophysics Research Lab (SARL), NCGSA',
    bio: 'Placeholder for researcher biography covering telescope operations, photometric reductions, and spectroscopic data pipelines.',
    avatarPlaceholder: 'team_member_1.jpg',
  },
  {
    id: 'team-member-2',
    name: '[Telescope Engineer Name — Placeholder]',
    role: 'Lead Instrumentation & Optical Engineer',
    department: 'Observatory Technical Services',
    bio: 'Placeholder for technical lead biography covering mount calibration, optical alignment, detector cooling, and observatory automation.',
    avatarPlaceholder: 'team_member_2.jpg',
  },
  {
    id: 'team-member-3',
    name: '[Outreach Coordinator Name — Placeholder]',
    role: 'Public Outreach & Education Officer',
    department: 'IST Student Affairs & Community Outreach',
    bio: 'Placeholder for education officer biography managing university student observation nights, school visits, and public skywatching events.',
    avatarPlaceholder: 'team_member_3.jpg',
  },
];
