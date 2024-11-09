// import * as Icons from '@mui/icons-material';
import { ArrowBack, NavigateNext, Close, Search, Favorite, FavoriteBorder } from '@mui/icons-material';

type Props = {
  color: string;
  height: number;
  type: keyof typeof Icons;
  width: number;
};

const Icons = {
  ArrowBack,
  NavigateNext,
  Close,
  Search,
  Favorite,
  FavoriteBorder,
};

export const SvgIcon: React.FC<Props> = ({ color, height, type, width }) => {
  // eslint-disable-next-line
  const Icon = Icons[type];
  return <Icon style={{ color, height, width }} />;
};
