import { AppItem, PageConfig } from './types';

export const INITIAL_CONFIG: PageConfig = {
  heroTitle: "Direktorat Pendidikan",
  heroDescription: "PDB"
};

export const INITIAL_APPS: AppItem[] = [
  {
    id: '1',
    title: 'CyberCampus',
    description: 'Sistem Informasi Akademik terintegrasi untuk mahasiswa dan dosen.',
    url: 'https://cybercampus.unair.ac.id',
    iconUrl: 'preset:graduation',
    category: 'Akademik',
    status: 'active',
    color: 'blue'
  },
  {
    id: '2',
    title: 'E-Learning (HEBAT)',
    description: 'Platform pembelajaran daring berbasis Moodle.',
    url: 'https://hebat.unair.ac.id',
    iconUrl: 'preset:book',
    category: 'Pembelajaran',
    status: 'active',
    color: 'teal'
  },
  {
    id: '3',
    title: 'Sistem Remunerasi',
    description: 'Portal pengelolaan kinerja dan remunerasi pegawai.',
    url: '#',
    iconUrl: 'preset:chart',
    category: 'Keuangan',
    status: 'maintenance',
    color: 'orange'
  },
  {
    id: '4',
    title: 'Repository',
    description: 'Penyimpanan digital karya ilmiah dan publikasi.',
    url: 'https://repository.unair.ac.id',
    iconUrl: 'preset:data',
    category: 'Pustaka',
    status: 'active',
    color: 'purple'
  },
  {
    id: '5',
    title: 'Helpdesk',
    description: 'Layanan bantuan teknis dan pengaduan layanan.',
    url: '#',
    iconUrl: 'preset:help',
    category: 'Layanan',
    status: 'off',
    color: 'red'
  }
];