const API_URL = 'https://gsbrh-airtable-cache.s3.us-west-2.amazonaws.com/airtable-proxy-cache-tblc4rd8zXVHOgAXj-viwkVEH2eez8BOgL3.json';
import {allDefined} from "./chunks/chunk.UW377HVP.js"

// Load template files
async function loadTemplate(url) {
  const res = await fetch(url);
  return await res.text();
}

async function fetchServices() {
  const res = await fetch(API_URL);
  const data = await res.json();

  // Transform Airtable format into something usable for our template
  return data.data.records.map(record => {
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

  await allDefined();
  equalRowHeight();
})();

function equalRowHeight() {
  // Remove all set row classes
  $(".grid-item").removeClass (function (index, className) {
    return (className.match (/(^|\s)airtable-list-height-row-\S+/g) || []).join(' ');
  });

  // Reset the height to auto.
  $('.airtable-list-record-row [data-row-height-id]').height("auto");

  var rowNum = 0;
  var previousTop = 0;
  var fields = {};
  $('.grid-item:visible').each(function() {
    $this = $(this);
    let nextTop = $this.offset().top;
    if (nextTop !== previousTop) {
      rowNum++;
      previousTop = nextTop;
      fields[rowNum] = {};
    }

    // Loop through each field that needs to be equal in height and collect the necessary heights.
    $this.find("[data-row-height-id]").each(function() {
      $field = $(this);
      var fieldId = $field.data('row-height-id');
      var height = $field.height();

      if (!fields[rowNum].hasOwnProperty(fieldId) || (fields[rowNum].hasOwnProperty(fieldId) && fields[rowNum][fieldId] < height)) {
        fields[rowNum][fieldId] = height;
      }
    });

    $this.addClass('airtable-list-height-row-' + rowNum);
  });

  // Set the height of each element.
  for (rowIndex in fields) {
    var fieldHeights = fields[rowIndex];
    for (key in fieldHeights) {
      $('.airtable-list-height-row-' + rowIndex + ' [data-row-height-id="' + key + '"]').height(fieldHeights[key]);
    }
  }
}
