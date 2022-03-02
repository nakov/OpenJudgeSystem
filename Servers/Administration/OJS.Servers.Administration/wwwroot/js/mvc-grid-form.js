$(document).ready(function() {
    $(":checkbox").on('click', function(event) {
        if (event.target.value === "True") {
            event.target.value = "False"
        } else {
            event.target.value = "True"
        }
    });

    console.log('Hello from iniiit');

    const forms = $('form');

    forms.find('select').select2();

    forms.submit(function() {
        $('select').prop('disabled', false);

        $('fieldset').each(function (ev, fs) {
            const selectedCheckboxes = $(fs).find('input[type=checkbox]').toArray();
            const result = selectedCheckboxes.map(x => ({
                name: $(x).data("name"),
                value: $(x).data("value"),
                isChecked: $(x).is(":checked")}));
            const input = $(`<input name="${fs.name}">`)
                .attr('type','hidden')
                .val(JSON.stringify(result));
            form.append(input);
        });

        return true;
    });
});
