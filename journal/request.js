// Keep the consent specific to the enquiry, including back/forward navigation.
function selectEnquiry() {
  document.querySelectorAll('.agree').forEach(input => { input.checked = false; });
  const route = document.getElementById(location.hash.slice(1));
  const fragment = route?.classList.contains('route') ? location.hash : '#email';
  document.querySelectorAll('.journal-nav nav a').forEach(link => { link.hash = fragment; });
}
window.addEventListener('pageshow', selectEnquiry);
window.addEventListener('hashchange', selectEnquiry);
