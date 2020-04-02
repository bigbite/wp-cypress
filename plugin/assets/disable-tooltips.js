wp.domReady(() => {
  var isVisible = wp.data.select('core/nux').areTipsEnabled();

  if (isVisible) {
    wp.data.dispatch('core/nux').disableTips();
  }
});
