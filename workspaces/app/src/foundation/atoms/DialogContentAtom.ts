import { atom } from 'jotai';

const StateAtom = atom<JSX.Element | null>(null);

export const DialogContentAtom = atom(
  (get) => {
    return get(StateAtom);
  },
  (_get, set, content: JSX.Element | null) => {
    const isOpen = content != null;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'scroll';
    }

    set(StateAtom, content);
  },
);
