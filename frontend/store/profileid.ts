import create from 'zustand';

interface ProfileIdState {
  profileId: number;
  setProfileId: (profileId: number) => void;
}

export const useProfileIdStore = create<ProfileIdState>((set) => ({
  profileId: 0,
  setProfileId: (profileId: number) => set(() => ({ profileId }))
}));
