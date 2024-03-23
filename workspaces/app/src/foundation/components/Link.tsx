type Props = {
  children: React.ReactNode;
  to?: string;
} & JSX.IntrinsicElements['a'];

export const Link: React.FC<Props> = ({ children, to, ...rest }) => {
  return (
    <a href={to} {...rest}>
      {children}
    </a>
  );
};
