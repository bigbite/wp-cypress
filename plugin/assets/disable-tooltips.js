const { wp } = window;

wp.domReady(() => {
  const { dispatch, select } = wp.data;

  const nux = select('core/nux');

  if (!nux) {
    if (select('core/edit-post').isFeatureActive('welcomeGuide')) {
      dispatch('core/edit-post').toggleFeature('welcomeGuide');
    }

    return;
  }

  if (nux.areTipsEnabled()) {
    dispatch('core/nux').disableTips();
  }
});
