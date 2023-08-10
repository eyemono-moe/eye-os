import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

import { useGlobalConfig } from "../contexts/useGlobalConfig";
import { useWindows } from "../contexts/useWindows";
import usePopup from "../lib/usePopup";
import { primitiveColors, semanticColors } from "../theme/color";

const Container = styled("div", {
  base: {
    display: "grid",
    placeItems: "center",
    padding: "8px",
    cursor: "pointer",
    selectors: {
      "&:hover": {
        backgroundColor: semanticColors.ui.hoverWhite,
      },
    },
  },
});

const Mark = styled("div", {
  base: {
    width: "24px",
    height: "24px",
    backgroundColor: primitiveColors.green[500],
    borderRadius: "16px",
  },
});

const PopupContainer = styled("div", {
  base: {
    backgroundColor: primitiveColors.black,
    padding: "8px",
    borderRadius: "8px",
  },
});

const Setting = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px",
  },
});

const Ul = styled("ul", {
  base: {
    listStyle: "none",
  },
});

const OsButton: Component = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [config, { setConfig }] = useGlobalConfig()!;
  const [_, { resetDisplay }] = useWindows();
  const { Popup, open } = usePopup();

  return (
    <>
      <Container
        onClick={() => {
          open({
            x: 16,
            y: 16,
          });
        }}
      >
        <Mark />
      </Container>
      <Popup>
        <PopupContainer>
          <Ul>
            <li>
              <button onClick={resetDisplay}>reset window position</button>
            </li>
          </Ul>
          <Ul>
            <li>
              <Setting>
                <div>obs websocket address</div>
                <input
                  type="text"
                  value={config.obs.address}
                  onChange={(e) => {
                    setConfig("obs", "address", e.currentTarget.value);
                  }}
                />
              </Setting>
            </li>
          </Ul>
          <Ul>
            <li>
              <Setting>
                <div>obs websocket pass</div>
                <input
                  type="password"
                  value={config.obs.password}
                  onChange={(e) => {
                    setConfig("obs", "password", e.currentTarget.value);
                  }}
                />
              </Setting>
            </li>
          </Ul>
        </PopupContainer>
      </Popup>
    </>
  );
};

export default OsButton;
