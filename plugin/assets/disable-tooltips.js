const { wp, jQuery } = window;

jQuery(document).ready(() => {
  const { dispatch, select } = wp.data;

  const nux = select('core/nux');

  if (!nux) {
    // needed for WP version <=6.0
    if (select('core/edit-post').isFeatureActive('welcomeGuide')) {
      dispatch('core/edit-post').toggleFeature('welcomeGuide');
    }

    return;
  }

  if (nux.areTipsEnabled()) {
    dispatch('core/nux').disableTips();
  }
});
