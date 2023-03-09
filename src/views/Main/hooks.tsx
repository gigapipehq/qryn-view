import { useMemo } from "react";
import { useCookies } from "react-cookie";
import DOMPurify from 'isomorphic-dompurify';
// useCookiesAvailable:

export function useCookiesAvailable(urlParams: any) {
    let cookieAuth = "";
    let cookiesAvailable = false;

    const hasCookie = useMemo(() => {
        return urlParams.has("cookie") || false;
    }, [urlParams]);

    const cookieParam = useMemo(() => {
        if (hasCookie) {
            return DOMPurify.sanitize(urlParams.get("cookie"));
        }
        return "";
    }, [urlParams, hasCookie]);
      // eslint-disable-next-line
    const [cookie, _] = useCookies([cookieParam]);

    if (cookie[cookieParam] && cookie[cookieParam] !== "") {
        cookieAuth = cookie[cookieParam];
        cookiesAvailable = true;
    }
    return { cookieAuth, cookiesAvailable };
}

// useUrlAvailable:

export function useUrlAvailable(urlParams: any) {
    const hasOneForAll = useMemo(() => {
        return urlParams.has("url");
    }, [urlParams]);

    const oneForAllParam = useMemo(() => {
        if (hasOneForAll) {
            return DOMPurify.sanitize(urlParams.get("url"));
        }
        return "";
    }, [urlParams, hasOneForAll]);

    return { url: oneForAllParam, urlAvailable: hasOneForAll };
}
