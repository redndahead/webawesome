// Load template files
async function loadTemplate(url) {
  const res = await fetch(url);
  return await res.text();
}

async function fetchServices() {
  const res = await fetch(API_URL);
  const data = await res.json();

  // Transform Airtable format into something usable for our template
  return data.records.map(record => {
    const fields = record.fields;

    return {
      title: fields['Service Name'] || '',
      description: fields['Service Description'] || '',
      coreServices: (fields['Core Service'] || []).map(label => ({
        label,
        variant: 'brand'
      })),
      clients: (fields['Clients'] || []).map(label => ({
        label,
        variant: 'success'
      })),
      requestLink: fields['Request Services'] || '#'
    };
  });
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

  // Fetch services
  const services = await fetchServices();

  // Render all services
  const grid = document.getElementById('service-grid');
  services.forEach(service => {
    grid.insertAdjacentHTML('beforeend', template(service));
  });
})();
