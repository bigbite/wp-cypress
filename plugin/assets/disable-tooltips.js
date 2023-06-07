const { wp, jQuery } = window;

jQuery(document).ready(() => {
  const { dispatch, select } = wp.data;

  const nux = select('core/nux');

  if (!nux) {
    return;
  }

  if (nux.areTipsEnabled()) {
    dispatch('core/nux').disableTips();
  }
});
