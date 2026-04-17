import { useEffect } from "react";
import { useRef } from "react";

export default function useTitle(title, setSuffix = true, prevailOnUnmount = false) {
    const defaultTitle = useRef(document.title);

    useEffect(() => {
        document.title = `${title} ${setSuffix ? "| Target ⚡" : ""}`;
    }, [title, setSuffix]);

    useEffect(() => {
        if (prevailOnUnmount) {
            document.title = `${defaultTitle.current} | Target ⚡`;
        }
    }, [prevailOnUnmount]);
}
