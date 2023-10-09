$(document).ready(() => {
    $(':checkbox').on('click', (event) => {
        if (event.target.value === 'True') {
            event.target.value = 'False';
        } else {
            event.target.value = 'True';
        }
    });

    const forms = $('form');

    forms.find('select').select2();

    forms.submit((ev) => {
        const form = $(ev.target);

        form.find('select').prop('disabled', false);

        form.find('fieldset').each((ev, fs) => {
            const selectedCheckboxes = $(fs).find('input[type=checkbox]').toArray();

            const getExpandElements = (checkbox) => {
                const expandElementId = $(checkbox).attr('expand');
                const result = [];

                if (expandElementId) {
                    const expandElements = $(`#${expandElementId} :input`);

                    expandElements.each(function () {
                        const element = $(this);
                        result.push({
                            name: element.prop('name'),
                            value: element.val(),
                        });
                    });
                }

                return result.length > 0
                    ? result
                    : null;
            };

            const result = selectedCheckboxes.map((x) => ({
                name: $(x).data('name'),
                value: $(x).data('value'),
                isChecked: $(x).is(':checked'),
                expand: getExpandElements(x),
            }));

            const input = $(`<input name="${fs.name}">`)
                .attr('type', 'hidden')
                .val(JSON.stringify(result));

            form.append(input);
        });

        return true;
    });
});