import type { FC, ReactNode } from "react";
import { HeaderContent, HeaderRoot } from "./style";

export interface IHeaderProps {
  children?: ReactNode;
}
const Header: FC<IHeaderProps> = ({ children }) => {
  return (
    <HeaderRoot>
      <HeaderContent>{children}</HeaderContent>
    </HeaderRoot>
  );
};

export default Header;
