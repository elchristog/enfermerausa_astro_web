window.addEventListener('message', function (event) {
  if (event.origin !== 'https://calendly.com') return;
  if (!event.data || event.data.event !== 'calendly.event_scheduled') return;

  if (window.fbq) {
    window.fbq('track', 'Schedule', {
      content_name: 'Sesión informativa gratuita'
    });
  }

  if (window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'Calendly',
      event_label: 'Sesión informativa gratuita'
    });
  }

  var success = document.getElementById('booking-success');
  if (success) success.classList.remove('hidden');
});
