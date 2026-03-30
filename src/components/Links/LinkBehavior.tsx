import { forwardRef } from "react";
import { Link as RouterLink, type LinkProps as RouterLinkProps } from "react-router-dom";

export const LinkBehavior = forwardRef<HTMLAnchorElement, RouterLinkProps>(
    (props, ref) => {
        return <RouterLink ref={ref} {...props} />;
    }
);

LinkBehavior.displayName = "LinkBehavior";
