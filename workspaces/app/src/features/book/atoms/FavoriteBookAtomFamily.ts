import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';

type FavoriteBookStore = { [bookId: string]: boolean };

const FavoriteBookStoreAtom = atomWithStorage<FavoriteBookStore>('FavoriteBookStore', {});

export const FavoriteBookAtomFamily = atomFamily((bookId: string) => {
  const IsFavoriteAtom = atom((get) => {
    return get(FavoriteBookStoreAtom)[bookId] ?? false;
  });

  return atom(
    (get) => {
      return get(IsFavoriteAtom);
    },
    (get, set) => {
      const isFavorite = get(IsFavoriteAtom);
      const store = get(FavoriteBookStoreAtom);
      set(FavoriteBookStoreAtom, { ...store, [bookId]: !isFavorite });
    },
  );
});
