import Head from "next/head";
import "../styles/globals.css";
import dynamic from "next/dynamic";
import { store } from "../data/store";
import { Provider } from "react-redux";
import pluralise from "pluralize";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import ReleaseNotes from "../views/components/ReleaseNotes";
import useMediaQuery from "@mui/material/useMediaQuery";

// TODO: Better place for global generic things to go?
pluralise.addSingularRule(/Fuses$/i, "Fuse"); // Spear-Fuses -> Spear-Fuse
pluralise.addSingularRule(/Axes$/i, "Axe"); // Axes -> Axe

function MyApp({ Component, pageProps }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = createTheme({
    palette: {
      //mode: prefersDarkMode ? "dark" : "light",
      mode: "light"
    },
    typography: {
      fontFamily: "Source Sans Pro",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "1.25px",
          },
        },
      },
    },
  });
  console.log("Theme", theme);

  return (
    <>
      <Head>
        <title>OPR Army Forge Beta</title>
        <meta name="description" content="OPR Army Forge List Builder" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@600&&family=Source+Sans+Pro:wght@400;500;600;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <Component {...pageProps} />
          <ReleaseNotes />
        </Provider>
      </ThemeProvider>
    </>
  );
}

export default dynamic(() => Promise.resolve(MyApp), { ssr: false });
