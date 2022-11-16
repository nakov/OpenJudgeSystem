/* exported onSearchSelect */
function onSearchSelect(e) {
    'use strict';

    var contestId = this.dataItem(e.item.index()).Id;
    populateDropDowns(contestId);
    initializeGrid(contestId);
}

/* exported onContestSelect */
function onContestSelect() {
    'use strict';

    var contestId = $('#contests').val();
    initializeGrid(contestId);
}

function onCopySuccess(response, status) {
    $('#copy-popup-window').data('kendoWindow').close();
    displayAlertMessage(response, status, $('.main-container'));
}

function onCopyFailure(response, status) {
    displayAlertMessage(response.responseJSON.errorMessages, status, $(this).parent());
}

function initializeGrid(contestId) {
    'use strict';

    var response;
    var sendSubmissionsActionName;
    var contestName;

    $('#status').show();
    $('#problems-grid').empty();

    $.get('/Administration/KendoRemoteData/GetContestNameAndCompeteOrPracticeActionName/' + contestId, function (data) {
        sendSubmissionsActionName = data.actionName;
        contestName = data.contestName;
    }).then(function() {
        $.get('/Administration/Problems/ByContest/' + contestId, function (data) {
            response = data;
        }).then(function () {
            var urlContestName = convertContestNameToUrlName(contestName);
            var escapedContestName = escapeSpecialSymbols(contestName);
            
            $('#status').hide();
            $('#problems-grid').kendoGrid({
                dataSource: new kendo.data.DataSource({
                    data: response
                }),
                scrollable: false,
                toolbar: [{
                    template: '<a href="/Administration/Problems/Create/' + contestId +
                    '" class="btn btn-sm btn-primary">Create</a>' +
                    '<a href="/Administration/Problems/DeleteAll/' + contestId +
                    '" class="btn btn-sm btn-primary">Delete all</a>' +
                    '<a data-role="button" onclick="prepareCopyWindow(' + contestId + ', \'' + escapedContestName + '\', true)' +
                    '" class="btn btn-sm btn-primary">Copy all</a>' +
                    '<a href="/Administration/Problems/ExportToExcel?contestId=' + contestId +
                    '" id="export" class="btn btn-sm btn-primary">Export as excel</a>' +
                    '<a href="/Contests/' + sendSubmissionsActionName + '/Index/' + contestId +
                    '" class="btn btn-sm btn-primary">Submit solution/s</a>' +
                    '<a href="/Contests/' + contestId + '/' + urlContestName +
                    '" class="pull-right kendo-grid-link text-bold">' + escapedContestName + '</a>'
                }],
                columns: [
                    { field: 'Name', title: 'Name', template: '<a href="/Administration/Problems/Details/#= Id #"' +
                            ' class="kendo-grid-link text-bold">#=Name#</a>'},
                    { field: 'ProblemGroupOrderBy', title: 'Group' },
                    { field: 'ProblemGroupType', title: 'Type group', template: '#: ProblemGroupTypeName #' },
                    { title: 'Tests', template: '<div> Practice: #= TrialTests # </div><div> Compete: #=' +
                            ' CompeteTests # </div>' },
                    {
                        title: 'Actions', width: '40%', template: '<div class="text-center">' +
                        '<a href="/Administration/Tests/Problem/#= Id #" class="btn btn-sm' +
                            ' btn-primary">Tests</a>&nbsp;' +
                        '<a href="/Administration/Problems/Retest/#= Id #" class="btn btn-sm' +
                            ' btn-primary">Retest</a>&nbsp;' +
                        '<a href="/Administration/Problems/Edit/#= Id #" class="btn btn-sm' +
                            ' btn-primary">Edit</a>&nbsp;' +
                        '<a href="/Administration/Problems/Delete/#= Id #" class="btn btn-sm' +
                            ' btn-primary">Delete</a>&nbsp;' +
                        '<a data-role="button" onclick="prepareCopyWindow(#=Id#, \'#=escapeSpecialSymbols(Name)#\')"' +
                            ' class="btn btn-sm btn-primary">Copy</a></div>'
                    }
                ],
                detailInit: detailInit
            });

            function detailInit(e) {
                $('<div/>').appendTo(e.detailCell).kendoGrid({
                    dataSource: {
                        transport: {
                            read: '/Administration/Resources/GetAll/' + e.data.Id,
                            destroy: '/Administration/Resources/Delete'
                        },
                        type: 'aspnetmvc-ajax',
                        pageSize: 5,
                        schema: {
                            data: 'Data',
                            total: 'Total',
                            errors: 'Errors',
                            model: {
                                id: 'Id',
                                fields: {
                                    Id: { type: 'number', editable: false },
                                    Name: { type: 'string' },
                                    Type: { type: 'number' },
                                    TypeName: { type: 'string' },
                                    OrderBy: { type: 'number' },
                                    Link: { type: 'string' }
                                }
                            }
                        },
                        sort: { field: 'OrderBy', dir: 'asc' },
                        serverSorting: true,
                        serverPaging: true,
                        serverFiltering: true
                    },
                    editable: 'popup',
                    pagable: true,
                    sortable: true,
                    filterable: true,
                    scrollable: false,
                    toolbar: [{
                        template: '<a href="/Administration/Resources/Create/' +
                        e.data.Id +
                        '" class="btn btn-sm btn-primary">Add resource</a>'
                    }],
                    columns: [
                        { field: 'Id', title: 'Id' },
                        { field: 'Name', title: 'Name' },
                        { field: 'Type', title: 'Type', template: '#= TypeName #' },
                        { field: 'OrderBy', title: 'Order by' },
                        {
                            title: 'Link', template: '# if(Type == 3) { ' +
                                '# <a href="#= Link #" class="btn btn-sm btn-primary" target="_blank">Link</a> ' +
                                '# } else { # ' +
                                '<a href="/Administration/Resources/Download/#= Id #" class="btn btn-sm' +
                                ' btn-primary">Download</a> # } #'
                        },
                        {
                            title: 'Actions', template: "<a href='/Administration/Resources/Edit/#= Id #' " +
                            "class='btn btn-sm btn-primary'>Edit</a> " +
                            "<a href='\\#' class='btn btn-sm btn-primary k-grid-delete'>Delete</a>"
                        }
                    ]
                });
            }

            $('.k-header.k-grid-toolbar').addClass('problems-grid-toolbar');
        });
    });
}

/* exported hideTheadFromGrid */
function hideTheadFromGrid() {
    'use strict';

    $('#future-grid thead').hide();

    $('[data-clickable="grid-click"]').click(function () {
        var contestId = $(this).data('id');
        populateDropDowns(contestId);
        initializeGrid(contestId);
    });
}

function prepareCopyWindow(id, name, isBulkCopy) {
    var copyWindowSelector = $('#copy-popup-window');

    var titlePrefix, actionName, controllerName;

    if (isBulkCopy) {
        titlePrefix = 'Copy all problems from the contest';
        actionName = 'CopyAllPartial';
        controllerName = "ProblemGroups";
    } else {
        titlePrefix = 'Copy problem';
        actionName = 'CopyPartial';
        controllerName = "Problems";
    }

    var url = '/Administration/' + controllerName + '/' + actionName + '/' + id;
    var title = titlePrefix + ' ' + name;

    var copyPopUp = copyWindowSelector.data('kendoWindow');

    if (typeof copyPopUp == typeof undefined) {
        (function () {
            copyWindowSelector.kendoWindow({
                width: '600px',
                modal: true,
                iframe: false,
                resizable: false,
                title: title,
                content: url,
                visible: false
            });

            copyPopUp = copyWindowSelector.data('kendoWindow');
        })();
    } else {
        copyPopUp.title(title);
        copyPopUp.refresh(url);
    }

    copyPopUp.open();
    copyPopUp.center();
}

$(document).ready(function () {
    'use strict';

    $('#status').hide();

    var contestId = $('#contestId').val();
    if (contestId) {
        populateDropDowns(contestId);
        initializeGrid(contestId);
    }
});