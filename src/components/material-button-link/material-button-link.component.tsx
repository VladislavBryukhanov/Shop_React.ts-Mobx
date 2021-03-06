import { Link, LinkProps } from 'react-router-dom';
import * as React from 'react';

export const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link innerRef={ref as any} {...props}/>
));
