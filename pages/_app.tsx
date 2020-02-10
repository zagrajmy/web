import { universalLanguageDetect } from "@unly/universal-language-detector";
import App, { AppContext } from "next/app";
import nextCookies from "next-cookies";
import React from "react";
import { ThemeProvider as ThemeUiProvider, Styled, ColorMode } from "theme-ui";
import { Global, InterpolationWithTheme } from "@emotion/core";
import { loadGetInitialProps } from "next/dist/next-server/lib/utils";

import { theme } from "../src/ui/theme";
import { NavHeader } from "../src/app/components";
import { auth } from "../src/app/auth";
import { AppStateProvider, StateFromAppInitialProps } from "../src/app/store";
import { SUPPORTED_LANGUAGES, FALLBACK_LANG } from "../src/i18n";

const globalStyles: InterpolationWithTheme<any> = {
  body: {
    margin: 0,
  },
  html: {
    boxSizing: "border-box",
  },
  "*, *:before, *:after": {
    boxSizing: "inherit",
  },
};

export default class MyApp extends App<{
  appState: StateFromAppInitialProps;
}> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    const pageProps = await loadGetInitialProps(Component, ctx);

    const cookies = nextCookies(ctx);

    const lang = universalLanguageDetect({
      supportedLanguages: SUPPORTED_LANGUAGES,
      fallbackLanguage: FALLBACK_LANG,
      acceptLanguageHeader: ctx.req?.headers?.["accept-language"],
      serverCookies: cookies,
      errorHandler: (error, level, origin, context) => {
        console.error(error, level, origin, context);
      },
    });

    Object.assign(pageProps, { lang, cookies });

    if (ctx.req) {
      const session = await auth.getSession(ctx.req);
      return { appState: { user: session?.user }, pageProps };
    }
    return { pageProps, appState: {} };
  }

  render() {
    const { Component, pageProps, appState } = this.props;
    return (
      <ThemeUiProvider theme={theme}>
        <Global styles={globalStyles} />
        <AppStateProvider stateFromInitialProps={appState}>
          <ColorMode />
          <Styled.root>
            <NavHeader user={appState.user} />
            <Component {...pageProps} />
          </Styled.root>
        </AppStateProvider>
      </ThemeUiProvider>
    );
  }
}
