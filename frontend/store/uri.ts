import create from 'zustand';

interface UriState {
    uri: string;
    setUri: (uri: string) => void;
}

export const useUriStore = create<UriState>((set) => ({
    uri: '',
    setUri: (uri: string) => set(() => ({ uri }))
}));
