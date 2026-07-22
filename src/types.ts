export interface Member {
  id: string;
  name: string;
  role: string;
  status: string;
  imageUrl?: string;
  spiritualLevel?: string;
  lastActive?: string;
  location?: string;
  nurAccount?: string;
}

export interface SystemStatus {
  activeNur: string;
  backupStatus: string;
  lastAdzan: string;
  runningText: string;
}

export interface PrayerSchedule {
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  tanggal: string;
}

export interface NurAccount {
  name: string;
  role: string;
  url: string;
}

