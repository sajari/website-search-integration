const initOverlay = (config, pub, sub) => {
  ReactDOM.render(
    <Overlay
      config={config}
      setOverlayControls={setOverlayControls}
      tabsFilter={tabsFilter}
      instantPipeline={instantPipeline}
      instantValues={instantValues}
      pipeline={pipeline}
      values={values}
    />,
    overlayContainer
  );

  if ((values || instantValues).get().q) {
    pub(integrationEvents.overlayShow);
  }
};
