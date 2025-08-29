const services = [
  {
    title: 'Grant Support',
    description: 'GSB faculty seeking grant funding...',
    coreServices: [
      { label: 'Grant Support', variant: 'brand' },
      { label: 'Funding Strategy', variant: 'info' }
    ],
    clients: [
      { label: 'GSB Faculty', variant: 'success' },
      { label: 'PhD Students', variant: 'warning' }
    ],
    requestLink: 'https://gsbresearchhub.stanford.edu/services/general-support-request-form'
  },
  {
    title: 'Research Assistance',
    description: 'Provides research support services...',
    coreServices: [
      { label: 'Data Analysis', variant: 'primary' },
      { label: 'Literature Review', variant: 'secondary' }
    ],
    clients: [
      { label: 'Faculty', variant: 'success' },
      { label: 'Postdocs', variant: 'info' }
    ],
    requestLink: 'https://gsbresearchhub.stanford.edu/services/research-assistance'
  }
];

// Load template files
async function loadTemplate(url) {
  const res = await fetch(url);
  return await res.text();
}

(async () => {
  // Load all templates
  const [serviceCardTemplate, coreServicesTemplate, clientsTemplate] = await Promise.all([
    loadTemplate('templates/service-card.hbs'),
    loadTemplate('templates/core-services.hbs'),
    loadTemplate('templates/clients.hbs')
  ]);

  // Register partials
  Handlebars.registerPartial('coreServicesPartial', coreServicesTemplate);
  Handlebars.registerPartial('clientsPartial', clientsTemplate);

  // Compile main template
  const template = Handlebars.compile(serviceCardTemplate);

  // Render all services
  const grid = document.getElementById('service-grid');
  services.forEach(service => {
    grid.insertAdjacentHTML('beforeend', template(service));
  });
})();
