import { forwardRef } from "react";
import { Link as RouterLink, type LinkProps as RouterLinkProps } from "react-router-dom";

export const LinkBehavior = forwardRef<HTMLAnchorElement, RouterLinkProps>(
    (props, ref) => {
        console.log("Navigate to:", props.to);  // analytics

        return <RouterLink ref={ref} {...props} />;
    }
);