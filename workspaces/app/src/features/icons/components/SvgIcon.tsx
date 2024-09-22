// import * as Icons from '@mui/icons-material';
import { ArrowBack, Close, Search, NavigateNext, Favorite, FavoriteBorder } from '@mui/icons-material';

const Icons = {
  ArrowBack,
  Close,
  Search,
  NavigateNext,
  Favorite,
  FavoriteBorder,
};

type Props = {
  color: string;
  height: number;
  type: keyof typeof Icons;
  width: number;
};

export const SvgIcon: React.FC<Props> = ({ color, height, type, width }) => {
  // eslint-disable-next-line
  const Icon = Icons[type];
  return <Icon style={{ color, height, width }} />;
};
