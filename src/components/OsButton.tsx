import { styled } from "@macaron-css/solid";
import { type Component } from "solid-js";

import { useObsWebSocket } from "../contexts/useObsWebSocket";
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

const Ul = styled("ul", {
  base: {
    listStyle: "none",
  },
});

const OsButton: Component = () => {
  const {
    obsResource: [obs, { refetch }],
    obsConfig,
    actions: { setObsConfig },
  } = useObsWebSocket();
  const [_state, { resetDisplay }] = useWindows();
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
            <li>
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <button
                onClick={async () => {
                  if (obs.state === "ready") {
                    await obs().disconnect();
                  }
                  await refetch();
                }}
              >
                reload OBS
              </button>
            </li>
            <li>
              <div>obs websocket address</div>
              <input
                type="text"
                value={obsConfig.address}
                onChange={(e) => {
                  setObsConfig("address", e.currentTarget.value);
                }}
              />
            </li>
            <li>
              <div>obs websocket pass</div>
              <input
                type="password"
                value={obsConfig.password}
                onChange={(e) => {
                  setObsConfig("password", e.currentTarget.value);
                }}
              />
            </li>
          </Ul>
        </PopupContainer>
      </Popup>
    </>
  );
};

export default OsButton;
