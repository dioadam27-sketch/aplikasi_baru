export type AppStatus = 'active' | 'maintenance' | 'off';
export type AppColor = 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal';

export interface AppItem {
  id: string;
  title: string;
  description: string;
  url: string;
  iconUrl: string;
  category?: string;
  status: AppStatus;
  color: AppColor;
}

export interface PageConfig {
  heroTitle: string;
  heroDescription: string;
}

export interface AdminState {
  isAuthenticated: boolean;
}
