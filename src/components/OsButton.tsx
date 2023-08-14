import { styled } from "@macaron-css/solid";
import { For, type Component } from "solid-js";

import { useGlobalConfig } from "../contexts/useGlobalConfig";
import { useObsWebSocket } from "../contexts/useObsWebSocket";
import { useWindows } from "../contexts/useWindows";
import usePopup from "../lib/usePopup";
import useScenes from "../lib/useScenes";
import { primitiveColors, semanticColors } from "../theme/color";

import UIButton from "./UI/UIButton";
import UIInput from "./UI/UIInput";
import UISelect from "./UI/UISelect";

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
    obsConfig,
    actions: { setObsConfig, refetchObs },
  } = useObsWebSocket();
  const [config, { setConfig }] = useGlobalConfig();
  const [_state, { resetDisplay }] = useWindows();
  const { globalOBSScenes } = useScenes();

  const { Popup, open, setBaseElement } = usePopup();

  return (
    <>
      <Container ref={setBaseElement} onClick={open}>
        <Mark />
      </Container>
      <Popup>
        <PopupContainer>
          <Ul>
            <li>
              <UIButton onClick={resetDisplay}>reset window position</UIButton>
            </li>
            <li>
              <UIButton
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={async () => {
                  await refetchObs();
                }}
              >
                reload OBS
              </UIButton>
            </li>
            <li>
              <div>obs websocket address</div>
              <UIInput
                type="text"
                value={obsConfig.address}
                onChange={(e) => {
                  setObsConfig("address", e.currentTarget.value);
                }}
              />
            </li>
            <li>
              <div>obs websocket pass</div>
              <UIInput
                type="password"
                value={obsConfig.password}
                onChange={(e) => {
                  setObsConfig("password", e.currentTarget.value);
                }}
              />
            </li>
            <li>
              <div>connected scene</div>
              <UISelect
                value={config.currentSceneName}
                onChange={(e) => {
                  setConfig("currentSceneName", e.currentTarget.value);
                }}
              >
                <For each={globalOBSScenes()}>
                  {(scene) => (
                    <option value={scene.sceneName}>{scene.sceneName}</option>
                  )}
                </For>
              </UISelect>
            </li>
          </Ul>
        </PopupContainer>
      </Popup>
    </>
  );
};

export default OsButton;
