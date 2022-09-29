(() => {
    $(document).ready(function () {
        'use strict';

        const submissionTypesCheckboxes = $("input[name^='SubmissionTypes'][name$='.IsChecked']");

        submissionTypesCheckboxes.change((ev) => {
            try {
                const number = getNumber(ev.currentTarget);
                if (isChecked($(ev.currentTarget))){
                    insertElement(number, ev);
                } else {
                    removeElement(number);
                }
            } catch (ex) {
                console.log(ex);
            }
        });
    });

    const getSolutionSkeletonElement = (number) => {
        return `<div class="row">
        <div class="editor-label col-xs-3">
            <div class="pull-right">
                <label for="SubmissionTypes_${number}__SolutionSkeleton">Solution skeleton</label>
            </div>
        </div>
        <div class="editor-field col-xs-4">
            <textarea class="form-control valid" cols="20" id="SubmissionTypes_${number}__SolutionSkeleton" name="SubmissionTypes[${number}].SolutionSkeleton" rows="10" spellcheck="true" aria-invalid="false"></textarea>
        </div>
        <div class="editor-field col-xs-4">
            <span class="glyphicon glyphicon-question-sign text-primary" title="Enter solution skeleton" data-tooltip="true"></span>
            <span class="field-validation-valid" data-valmsg-for="SubmissionTypes[${number}].SolutionSkeleton" data-valmsg-replace="true"></span>
        </div>
    </div>`;
    };

    const getNumber = (el) =>  {
        return $(el).attr("id").split("_")[1];
    };

    function isChecked(elements) {
        return elements.is(':checked');
    }

    const insertElement = (number, ev) => {
        $(getSolutionSkeletonElement(number))
            .insertAfter($(ev.currentTarget)
                .parent()
                .parent());
    };

    const removeElement = (number) => {
        $(`#SubmissionTypes_${number}__SolutionSkeleton`).parent().parent().remove();
    };
})();